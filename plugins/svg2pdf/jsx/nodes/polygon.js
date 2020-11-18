import { Traverse } from './traverse.js';
export class Polygon extends Traverse {
    constructor(node, children) {
        super(true, node, children);
    }
}
