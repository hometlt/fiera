import fabric from './../fiera.core.js'
import ToolbarController from "./toolbar-controller.js"
import {capitalize, camelize} from '../../util/string.js'
import {deepClone} from "../util/util.js"
import Tool from "./tool";




let customIdCounter = 0
function prepareToolbarData(editor, data ,target){
	data = deepClone(data)

	let tempObjects = {} , tools = [], dynamic = false;
	function createKlass( klassname) {
		let object
		//get the pototype object
		if(klassname === 'Editor' || klassname === 'editor'){
			object = editor
		}
		else {
			if(!tempObjects.Canvas){
				tempObjects.Canvas = new fabric.StaticCanvas({editor: editor, element: false,stateful: false})
			}
			if(klassname === 'Canvas'  || klassname === 'canvas'){
				object = tempObjects.Canvas
			}
			else{
				object = new (fabric.util.getKlass(klassname,editor.klasses))({editor: editor, canvas: tempObjects.Canvas})
			}
		}
		return object
	}
	function getActionValue ( proto, property) {
		do {
			if(!proto.type)break
			let klassname = camelize(proto.type,true)
			let customProto = editor.prototypes && editor.prototypes[klassname]
			if(customProto && customProto.actions && customProto.actions[property] !== undefined){
				return customProto.actions[property]
			}
			if(proto.actions && proto.actions[property] !== undefined){
				return proto.actions[property]
			}
		} while (proto = proto.__proto__ )
		return false
	}
	function collectTools(array, klass, tools){
		for(let i in array) {
			let item = array[i]
			let id, tool

			if(!item)continue
			if(item === "*")continue
			if(item.constructor === String) {
				id = item
				if(tools[id])continue
				tool = getActionValue( klass, id)
				if(!tool){
					tools.splice(i--,1)
					console.warn('tool ' + id + ' is undefined')
					continue
				}
			}
			if(item.constructor === Object){
				if(item.reference){
					tool = getActionValue( klass, item.reference)
					if(!tool){
						tools.splice(i--,1)
						console.warn('tool ' + id + ' is undefined')
						continue
					}
					Object.assign(tool,item)
					tool.id = item.reference;
				}
				else{
					tool = item
				}
				id = tool.id || 'custom' + ++customIdCounter
				array[i] = id
			}

			if(tool.menu){
				collectTools(tool.menu, klass, tools)
			}
			tools[id] = tool
		}
	}
	function resolveToolsRecoursive (  value, data) {
		let klassname, prototype
		if(value.constructor === String){
			klassname = value
			let klass= editor.getKlass(klassname)
			if(!klass){
				console.error(klassname + ' not defined')
				return null
			}
			prototype = klass.prototype
		}
		else{
			prototype = value
			klassname = camelize(prototype.type, true)
		}

		let tools = data[klassname];// || prototype.tools
		let indexOfStar
		if(tools){
			tools = tools.slice()
			indexOfStar = tools ? tools.indexOf('*') : -1
			if (indexOfStar === -1) {
				return tools
			}
		}
		let tools2 = resolveToolsRecoursive( prototype.__proto__, data)
		if(tools){
			tools.splice.apply(tools, [indexOfStar, 1].concat(tools2))
		}else{
			tools = tools2
		}
		return tools
	}

	if(data.constructor === Array){
		if(target.constructor === String){
			target = createKlass(target)
		}
		collectTools(data, target, tools)
	}
	else{
		dynamic = {}

		//create temp objects
		for(let klassname in data) tempObjects[klassname] = createKlass(klassname)

		//collecting tools. replace all custom objects in data with its IDs
		for(let klassname in data) collectTools(data[klassname],tempObjects[klassname], tools)

		//replace all "*" with tools names
		for(let klassname in data) dynamic[klassname] = resolveToolsRecoursive( klassname, data)

	}


	for(let tool in tools){

		let item = tools[tool];

		if(!item.type){
		 	if (item.option) {
				item.type = "checkbox";
			}
			else if (item.menu) {
				item.type = "menu";
			}
			else if (item.options) {
				item.type = "select";
			}
			else if (item.variable) {
				item.type = "text";
			}
			else {
				item.type = "button";
			}
		}

		if (!item.variable && !item.set ) {

			switch (item.type) {
				case "color":
				case "text":
				case "number":
				case "range":
				case "label":
				case "select":
				case "checkbox":
					item.variable = tool ;
			}
		}

		if (!item.action) {
			switch (item.type) {
				case "button":
				case "key":
					item.action = item.variable ? "set" + capitalize(item.variable, true) : tool
			}
		}

		//поу умолчанию тулбары с типом "меню" и "color"  открывыаются в попапе
		if(item.popup === undefined){
			switch (item.type) {
				case "color":
				case "menu":
					item.popup = true
			}
		}
		tools[tool] = new Tool(item)
	}

	return {dynamic, tools}
}

const ToolbarsFactory = {
	create({editor, target, tools}){

		let data = prepareToolbarData(editor, tools, target )

		let toolbar = new ToolbarController(data.tools, data.dynamic)

		if(target.constructor === String){
			switch(target){
				case 'editor':
					toolbar.setTarget(editor)
					break
				case 'canvas':
					if(editor.canvas){
						toolbar.setTarget(editor.canvas)
					}
					editor.on('slide:changed',(event ) => {
						toolbar.setTarget(event.canvas)
					})
					break
				default:
					if(editor.target){
						toolbar.setTarget(editor.target)
					}
					editor.on({
						'target:changed': (event) => {
							if(event.selected && (target === 'objects' || editor.target.type === target)){
								toolbar.setTarget(editor.target)
								if(toolbar.position){
									ToolbarsFactory.updateToolbarPosition(toolbar)
								}
								// toolbar.container.show()
							}else{
								toolbar.setTarget(null)
								// toolbar.container.hide()
							}
						},
						'target:modified': (event) => {
							if(this.target){
								if(toolbar.position) {
									ToolbarsFactory.updateToolbarPosition(toolbar)
								}
							}
						}
					})
			}
		}
		else{
			toolbar.setTarget(target)
		}
		return toolbar
	},
	getToolbarPosition (toolbar) {
		let container = toolbar.container,
			options = toolbar.position,
			originX = options.originX || 'left',
			originY = options.originY || 'top',
			marginY = options.marginY || 0,
			marginX = options.marginX || 0,
			padding = options.padding || 0,
			containerOffset = $(container.parents()[0]).offset(),
			canvasOffset = $(target.canvas.wrapperEl).offset(),
			target = toolbar.target,
			scale = target.canvas.getZoom(),
			r, x, y

		target.setCoords()
		r = target.getBoundingRect()
		switch (originX) {
			case 'left':   x = (r.left) * scale - toolbar.container.width(); break
			case 'right':  x = (r.left + r.width) * scale; break
			case 'center': x = (r.left + r.width / 2) * scale - toolbar.container.width() / 2; break
		}
		switch (originY) {
			case 'top':    y = (r.top) * scale - toolbar.container.height(); break
			case 'bottom': y = (r.top + r.height) * scale; break
			case 'center': y = (r.top + r.height / 2) * scale - toolbar.container.height() / 2; break
		}

		let maxLeft = $(target.canvas.wrapperEl).offsetParent().width()  - container.width()  - padding
		let maxTop  = $(target.canvas.wrapperEl).offsetParent().height() - container.height() - padding

		return {
			left: Math.min( Math.max(padding, x + marginX + canvasOffset.left - containerOffset.left), maxLeft),
			top:  Math.min( Math.max(padding, y + marginY + canvasOffset.top  - containerOffset.top ), maxTop )
		}
	},
}

fabric.util.createToolbar = ToolbarsFactory.create
export default ToolbarsFactory;
