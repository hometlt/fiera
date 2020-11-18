import cssEsc from 'cssesc';
export class ReferencesHandler {
    constructor(idMap) {
        this.renderedElements = {};
        this.idMap = idMap;
    }
    async getRendered(id, renderCallback) {
        if (this.renderedElements.hasOwnProperty(id)) {
            return this.renderedElements[id];
        }
        const svgNode = this.get(id);
        this.renderedElements[id] = svgNode;
        await renderCallback(svgNode);
        return svgNode;
    }
    get(id) {
        return this.idMap[cssEsc(id, { isIdentifier: true })];
    }
}
//# sourceMappingURL=referenceshandler.js.map