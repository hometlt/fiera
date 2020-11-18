export function nodeIs(node, tagsString) {
    return tagsString.split(',').indexOf((node.nodeName || node.tagName).toLowerCase()) >= 0;
}
export function forEachChild(node, fn) {
    // copy list of children, as the original might be modified
    const children = [];
    for (let i = 0; i < node.childNodes.length; i++) {
        const childNode = node.childNodes[i];
        if (childNode.nodeName.charAt(0) !== '#')
            children.push(childNode);
    }
    for (let i = 0; i < children.length; i++) {
        fn(i, children[i]);
    }
}
// returns an attribute of a node, either from the node directly or from css
export function getAttribute(node, styleSheets, propertyNode, propertyCss = propertyNode) {
    const attribute = node.style.getPropertyValue(propertyCss);
    if (attribute) {
        return attribute;
    }
    else if (styleSheets.getPropertyValue(node, propertyCss)) {
        return styleSheets.getPropertyValue(node, propertyCss);
    }
    else if (node.hasAttribute(propertyNode)) {
        return node.getAttribute(propertyNode) || undefined;
    }
    else {
        return undefined;
    }
}
export function svgNodeIsVisible(svgNode, parentVisible, context) {
    if (getAttribute(svgNode.element, context.styleSheets, 'display') === 'none') {
        return false;
    }
    let visible = parentVisible;
    const visibility = getAttribute(svgNode.element, context.styleSheets, 'visibility');
    if (visibility) {
        visible = visibility !== 'hidden';
    }
    return visible;
}
export function svgNodeAndChildrenVisible(svgNode, parentVisible, context) {
    let visible = svgNodeIsVisible(svgNode, parentVisible, context);
    if (svgNode.element.childNodes.length === 0) {
        return false;
    }
    svgNode.children.forEach(child => {
        if (child.isVisible(visible, context)) {
            visible = true;
        }
    });
    return visible;
}
