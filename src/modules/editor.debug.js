
import './../../plugins/console-debug.js'
import {FmTarget} from '../core/target.js'

function eventsLogger(options){
  var _counter = {};
  for(var i in options){
    _counter[i] = 0;
    this.on(options[i],function(i, event) {
      console.log(i + " " + ++_counter[i],event);
    }.bind(this,i));
  }
}

fabric.util.object.extend(fabric,{
  debugTimeout: 0
});

export const FmDebug = {
  name: "debug",
  deps: [FmTarget],
  prototypes: {
    StaticCanvas: {
      enableConsoleDebugging(){
        window.canvas = this;
        this.on({
          "object:selected" (e) {
            window.target = e.target;
          },
          "selection:updated" (e) {
            window.target = e.target;
          },
          "selection:cleared" (e) {
            window.target = null;
          },
          "selection:created" (e) {
            window.target = e.target;
          }
        });
      },
      setDebug(val){
        if(val){
          this.enableConsoleDebugging();
        }
      }
    },
    Editor: {
      logEvents: eventsLogger,
      setDebug: function (value) {
        if(!value)return;
        if(value === true){
          value = "editor";
        }
        this.debug = value;
        // var styledText = "color: #2EC06C; font-style: italic;";
        // console.info(`debugging enabled for %c${this.debug}`,styledText);
        // var normal =  "color: #202020"
        // console.info("%cdebug enabled. (use %ceditor%c, %cproject%c, %ccanvas%c, %ctarget%c in console)",
        //   styled, normal,
        //   styled, normal,
        //   styled, normal,
        //   styled, normal);
        window[this.debug] = this;
        window.canvas = this.canvas;
        window.target = null;
        this.on("target:changed", function () {
          window.target = this.target;
        });
        this.on("slide:changed", function (e) {
          window.canvas = e.canvas;
        });
      }
    },
    Pattern: {
      debug(noBorders){}
    },
    Object: {
      logEvents: eventsLogger,
      debug(noBorders){
        var canvas = document.createElement("canvas");
        canvas.width = noBorders ?this.width: this.width + 2;
        canvas.height = noBorders ?this.height : this.height + 2;

        var ctx = canvas.getContext('2d');
        if(!noBorders){
          ctx.lineWidth=1;
          ctx.strokeStyle="yellow";
          ctx.strokeRect(0,0,this.width + 2,this.height+ 2);
          ctx.setLineDash([4,4]);
          ctx.strokeStyle="#000000";
          ctx.strokeRect(0,0,this.width + 2,this.height+ 2);
        }
        ctx.translate(this.width/2 + 1,this.height/2+ 1);
        // var _clipTo = this.clipTo;
        // delete this.clipTo;
        this.drawObject(ctx);
        // this.clipTo = _clipTo;
        // canvas.toBlob(function(blob){
        //   let objectURL = URL.createObjectURL(blob);
        //   window.open(objectURL,"_blank");
        //   console.log(objectURL);
        //   // window.open(canvas.toDataURL(),"_blank");
        // })
        return canvas.toDataURL()
      }
    }
  }
}

