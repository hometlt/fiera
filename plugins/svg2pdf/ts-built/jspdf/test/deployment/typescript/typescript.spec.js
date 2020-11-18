import { jsPDF } from "jspdf";
describe("Typescript", () => {
    it("jsPDF should be loaded", () => {
        expect(jsPDF).toBeDefined();
    });
    it("basic test", () => {
        const doc = new jsPDF();
        doc.text("TypeScript test", 30, 30);
        comparePdf(doc.output(), "typescript-basic.pdf", "typescript");
    });
});
//# sourceMappingURL=typescript.spec.js.map