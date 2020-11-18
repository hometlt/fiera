

export async function loadScript(requirement) {
    return new Promise((resolve, reject) => {
        var head = document.getElementsByTagName('head')[0];

        let script = Array.prototype.filter.call(head.getElementsByTagName("script"),(item) => (item.getAttribute("src") === requirement))[0]

        if(script){
            script.addEventListener("error", reject, {once: true});
            script.addEventListener("load", resolve, {once: true});
        }
        else{
            script = document.createElement('script');
            script.type = 'text/javascript';
            // script.onerror = function (errorMessage) {
            //     reject(errorMessage)
            // }
            // script.onreadystatechange = function () {
            //     if (this.readyState === 'complete') {
            //         resolve(script);
            //     }
            // };
            script.addEventListener("error", reject, {once: true});
            script.addEventListener("load", resolve, {once: true});
            script.src = requirement;
            head.appendChild(script);
        }


    })

}

export function scriptURL() {

    if (document.currentScript) {
        return document.currentScript.src;
    }
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i--;) {
        if (scripts[i].src) {
            return scripts[i].src;
        }
    }
    return false;
}


