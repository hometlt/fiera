class Tool {
	constructor(options){
		Object.assign(this,options)
	}
	toggle(){
		this.isOpen = !this.isOpen
	}
	close() {
		if (!this.isOpen) {
			return
		}
		this.isOpen = false
	}
	observeCallback (){

	}
	connect(){
		let target = this.target;
		if (this.observe ) {
			this._observeCallback = this.observeCallback.bind(this);
			target.on(this.observe, this._observeCallback);
		}
		this.connected = true;
	}
	getTargetValue (property, argument) {
		let target = this.target;

		if(property === undefined){
			return null;
		}
		if (property.constructor === Function) {
			return property.call(this, target, argument)
		}
		if (property.constructor === String) {
			let negative = false;
			if(property.startsWith("not ")){
				property = property.substr(4);
				negative = true;
			}
			let value = target[property];

			let _result;
			if (value && value.constructor === Function) {
				if(this.option){
					_result = value.call(target, this.option, argument)
				}
				else{
					_result = value.call(target, argument)
				}
			}
			else{
				_result = value;
				//	allow to use set functions
				if(argument){
					target[value] = argument;
				}
			}
			return negative ? !!(_result ^ negative) : _result
		}
		return property;
	}
	disconnect(){
		if(!this.connected) return;
		if (this.observe) {
			this.target.off(this.observe, this._observeCallback);
		}
		this.connected = false;
	}
	callAction(){
		if (!this.enabled) return;


		if(this.popup){
			this.toggle()
			return;
		}

		//button behavior
		if(this._action){
			if(this._action.constructor === String){
				return this.target[this._action](this.option)
			}
			else{
				return this._action(this.target,this.option)
			}
		}
		else{
			let _var = this._variable || this.toolbar && this.toolbar.variable
			//radio button (option) behavior
			if(_var && this.option) {
				this.value = this.option
			}
			//checkbox behavior
			else if(!_var && !this.option){
				this.value = !this.value
			}
		}


	}

	set className(value) {this._className = value}
	get className(){
		if(!this._className){
			return "";
		}
		if(this._className.constructor === String){
			return this._className
		}
		if(this._className.constructor === Function){
			return this._className.call(this, this.target )
		}
	}
	//
	// set menu(value) {this._menu = value}
	// get menu() {
	// 	if(!this._menu){
	// 		return false;
	// 	}
	// 	return this._menu;
	// 	// let result = [];
	// 	// for (let item of this._menu) {
	// 	// 	result.push(this.toolbar._tools[item])
	// 	// }
	// 	// return result;
	// }

	set max(value) {this._max = value}
	get max() {
		if(this._max === undefined){
			return +Infinity
		}
		return this.getTargetValue(this._max)
	}

	set min(value) {this._min = value}
	get min() {
		if(this._min === undefined){
			return -Infinity
		}
		return this.getTargetValue(this._min)
	}

	set step(value) {this._step = value}
	get step() {
		if(!this._step){
			return 1
		}
		return this.getTargetValue(this._step)
	}

	set action(value) {this._action = value}
	get action() {
		return this.callAction
	}

	set options(value) {this._options = value}
	get options() {
		if(!this._calculatedOptions){
			this._calculatedOptions = this.getTargetValue(this._options)
		}
		return this._calculatedOptions
	}

	set active(value) {this._active = value}
	get active() {

		if(this.type === "checkbox"){
			if(this._active){
				return this.getTargetValue(this._active)
			}
			else if(this.option){
				return this.value === this.option;
			}
			return !!this.value
		}
	}

	set visible(value) {this._visible = value}
	get visible() {
		if(!this._visible){
			return true;
		}
		return this.getTargetValue(this._visible,true)
	}

	set hidden(value) {
		this._visible = "not " + value
	}
	get hidden() {
		return !this.visible
	}
	set disabled(value) {
		this._enabled = "not " + value
	}
	get disabled() {
		return !this.enabled
	}

	set enabled(value) {
		this._enabled = value
	}
	get enabled() {
		if(this._enabled === undefined){
			return true
		}
		if(this._enabled.constructor === Boolean){
			return this._enabled
		}
		else{
			return this.getTargetValue(this._enabled)
		}
	}

	set variable(value) {this._variable = value}
	get variable() {
		return this._variable
	}

	get value() {
		if(this.get) {
			return this.getTargetValue(this.get);
		}
		let vrbl = this._variable || this.toolbar && this.toolbar.variable
		if(vrbl){
			let foo = "get" + vrbl[0].toUpperCase() + vrbl.slice(1)
			let targetValue = this.getTargetValue(this.target[foo] ? foo : vrbl);
			return this.input && this.input.on !== undefined ? targetValue === this.input.on : targetValue
		}
	}
	set value(value) {
		if(this.set){
			return this.getTargetValue(this.set ,value);
			// this.set.apply(this,this.target, arguments);
		}
		let vrbl = this._variable || this.toolbar && this.toolbar.variable
		if(vrbl){
			let foo = "set" +  vrbl[0].toUpperCase() + vrbl.slice(1)
			if(this.target[foo]){
				let checked = value ? "on" : "off"
				let resultValue = this.input && this.input[checked] !== undefined ? this.input[checked] : value
				if(this.option){
					this.target[foo]( this.option, resultValue)
				}
				else{
					this.target[foo](resultValue)
				}
			}
			else{
				this.target[vrbl] = value
			}
		}
	}

	set target(value) {this._target = value}
	get target() {
		let target;
		if (this._target) {
			if (this._target.constructor === Function) {
				target = this._target.call(this.toolbar.getTarget());
			}
			else if (this._target.constructor === String) {
				target = this.toolbar.target[this._target];
			}
			else {
				target = this._target;
			}
		} else {
			target = this.toolbar.getTarget();
		}
		return target
	}
}

Object.assign(Tool.prototype, {
	itemClassName: "object-menu-item",
	buttonClassName: "fiera-btn"
});

export default Tool;
