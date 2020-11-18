import {capitalize} from '../../util/string.js'
import Observable from '../../plugins/observable.js'
import {camelize} from "../../util/string";

class ToolbarController  {
	constructor(tools,dynamic){
		for(let i in tools){
			tools[i].toolbar = this;
		}
		this.dynamic = dynamic;
		this._tools = tools;
		// this.initKeys();
	}
	handleKeydown(e){
		for(let btn of this._tools){
			btn.handleKeydown(e);
		}
	}
	initKeys () {
		this.__keydownHandler = this.handleKeydown.bind(this);
		$(document).on("keydown", this.__keydownHandler);
		//$(window).on("mousewheel", function (event) {
		//  for (var i in self.buttons) {
		//    var data = self.buttons[i];
		//    if (!data.mousewheel)continue;
		//    if (!data.ctrlKey || data.ctrlKey && event.ctrlKey) {
		//      if (event.deltaY > 0 && data.mousewheel == ">") {
		//        data.action.call(target, data.option || event, event)
		//      }
		//      if (event.deltaY < 0 && data.mousewheel == "<") {
		//        data.action.call(target, data.option || event, event)
		//      }
		//      event.preventDefault();
		//      event.stopPropagation();
		//      return false;
		//    }
		//  }
		//});
	}
	createItems(tools){
		let items = [];
		for(let i in tools){
			let tool = this._tools[tools[i]];
			if(!tools[i]){
				continue;
			}
			if(!tool){
				console.error(`tool  ${tools[i]} not found!`)
				continue
			}
			let item = {tool: tool};
			if(tool.menu){
				item.menu = this.createItems(tool.menu)
			}
			for(let i in item.menu){
				item.menu[i].parent = item;
			}
			items.push(item)
		}
		return items;
	}
	setTarget(target) {
		if( this.target ){
			for(let tool of this._tools){
				if (tool.connected) {
					tool.disconnect();
				}
			}
		}
		this.target = target;
		this.items = [];
		let tools = []; // string[]

		if(target){
			if(this.dynamic) {
				let type = camelize(capitalize(target.type, true))
				let dynamic = this.dynamic[type] || this.dynamic["All"] || [];
				for(let toolName of dynamic){
					tools.push(toolName)
				}
			}
			else {
				for(let toolName in this._tools){
					tools.push(toolName)
				}
			}

			this.items = this.createItems(tools)

			for(let item of this.items) {
				item.tool.connect()
			}
		}
		this.fire("target:changed")
	}
	destroy () {
		if (this.__keydownHandler) {
			$(document).off("keydown", this.__keydownHandler);
		}
		this.fire("destroy")
	}
	// [Symbol.iterator]: function* (){
	//   for(let btn of this.buttons){
	//     yield btn;
	//     if (btn.menu) {
	//       for(let subBtn of btn.menu) {
	//         yield subBtn;
	//       }
	//     }
	//   }
	// }
}

Object.assign(ToolbarController.prototype, Observable,{
	items: null
});

export default ToolbarController;
