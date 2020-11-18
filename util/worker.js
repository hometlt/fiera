export function runInWorker (foo) {
  if (window.Worker) {
    var str = foo.toString();
    var eventArg = str.substring(str.indexOf("(") + 1, str.indexOf(","));
    var postMessageArg = str.substring(str.indexOf(",") + 1, str.indexOf(")"));
    var _functionBody = str.substring(str.indexOf("{") + 1);
    str = "onmessage=function(" + eventArg + "){" + postMessageArg + "= postMessage;" + _functionBody;
    var blob = new Blob([str]);
    //"onmessage = function(e) { postMessage('msg from worker'); }"]);
    var blobURL = window.URL.createObjectURL(blob);
    return new Worker(blobURL);
  } else {
    var worker = {
      terminate: function () {
      },
      postMessage: function (data) {
        setTimeout(function () {
          foo({data: data}, function (responseData) {
            worker.onmessage && worker.onmessage({data: responseData});
          })
        });
      }
    };
    return worker;
  }
}