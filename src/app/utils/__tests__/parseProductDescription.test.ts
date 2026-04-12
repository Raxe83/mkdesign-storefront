import { describe, it, expect } from "vitest";
import { parseProductDescription } from "../parseProductDescription";

describe("parseProductDescription", () => {
  it("returns unchanged html when no specs present", () => {
    const html = "<p>Ein schönes Produkt.</p>";
    const { mainHtml, specs } = parseProductDescription(html);
    expect(mainHtml).toBe("<p>Ein schönes Produkt.</p>");
    expect(specs).toHaveLength(0);
  });

  it("returns empty specs for empty input", () => {
    const { mainHtml, specs } = parseProductDescription("");
    expect(mainHtml).toBe("");
    expect(specs).toHaveLength(0);
  });

  it("extracts specs from a table", () => {
    const html = `
      <p>Beschreibung</p>
      <table>
        <tr><td>Material</td><td>Stahl</td></tr>
        <tr><td>Gewicht</td><td>5 kg</td></tr>
      </table>
    `.trim();
    const { specs, mainHtml } = parseProductDescription(html);
    expect(specs).toHaveLength(2);
    expect(specs[0]).toEqual({ label: "Material", value: "Stahl" });
    expect(specs[1]).toEqual({ label: "Gewicht", value: "5 kg" });
    expect(mainHtml).not.toContain("<table");
    expect(mainHtml).toContain("Beschreibung");
  });

  it("extracts specs from a list with known keywords", () => {
    const html = `
      <ul>
        <li><strong>Material:</strong> Schwarzstahl</li>
        <li><strong>Maße:</strong> 60 × 60 × 80 cm</li>
      </ul>
    `.trim();
    const { specs, mainHtml } = parseProductDescription(html);
    expect(specs).toHaveLength(2);
    expect(specs.find((s) => s.label === "Material")?.value).toBe("Schwarzstahl");
    expect(specs.find((s) => s.label === "Maße")?.value).toBe("60 × 60 × 80 cm");
    expect(mainHtml).not.toContain("<ul");
  });

  it("keeps list items that are NOT spec keywords", () => {
    const html = `
      <ul>
        <li>Handgefertigt in Deutschland</li>
        <li>Perfekt als Geschenk</li>
      </ul>
    `.trim();
    const { specs, mainHtml } = parseProductDescription(html);
    expect(specs).toHaveLength(0);
    expect(mainHtml).toContain("Handgefertigt");
  });

  it("cleans up empty paragraphs after table removal", () => {
    const html = "<p>&nbsp;</p><table><tr><td>Maße</td><td>50cm</td></tr></table><p> </p>";
    const { mainHtml } = parseProductDescription(html);
    expect(mainHtml).not.toMatch(/<p>(\s|&nbsp;)*<\/p>/i);
  });
});
