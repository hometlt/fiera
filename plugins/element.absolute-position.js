function getElementWidth(element){
	parseFloat(getComputedStyle(element, null).width.replace("px", ""))

}
function getElementHeight(element){
	parseFloat(getComputedStyle(element, null).height.replace("px", ""))
}
function getElementOffset(el)
{
	var rect = el.getBoundingClientRect();

	return {
		top: rect.top + document.body.scrollTop,
		left: rect.left + document.body.scrollLeft
	}
}

function getValue(val) {
	if (val === "auto") return 0;
	let num = parseInt(val);
	return isNaN(num) ? 0 : num;
}

export function absolutePosition(element) {

	let style = getComputedStyle(element, null);
	let off = getElementOffset(element);// pos = this.position();
	let scroll = {
		top: document.documentElement.scrollTop || document.body.scrollTop || window.scrollY || 0,
		left: document.documentElement.scrollLeft || document.body.scrollLeft || window.scrollX || 0,
		bottom: document.documentElement.scrollHeight - window.innerWidth,
		right: document.documentElement.scrollWidth - window.innerHeight
	}
	let margin = {
		top: getValue(style.marginTop),
		left: getValue(style.marginLeft),
		bottom: getValue(style.marginBottom),
		right: getValue(style.marginRight)
	};


	let border_offset = getValue(style.borderWidth) * 2;

	return {
		top: off.top ,
		left: off.left,
		right: window.innerWidth - off.left - margin.right + scroll.right - getElementWidth(element),
		bottom: window.innerHeight - off.top - margin.bottom + scroll.bottom - getElementHeight(element) - border_offset
	};
}
