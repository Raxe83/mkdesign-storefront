export interface SpecRow {
  label: string;
  value: string;
}

export interface ParsedDescription {
  mainHtml: string;
  specs: SpecRow[];
}

// Known technical spec labels (lowercase, without colon).
// Add more here as needed.
const SPEC_KEYWORDS = new Set([
  'maße', 'masse', 'abmessungen', 'abmessung', 'größe', 'groesse', 'größen',
  'gewicht', 'volumen', 'fassungsvermögen', 'kapazität',
  'material', 'materialien', 'werkstoff',
  'wandstärke', 'wandstaerke', 'blechstärke',
  'oberfläche', 'oberflächenbehandlung', 'beschichtung', 'finish',
  'farbe', 'farben', 'farbton',
  'breite', 'höhe', 'hoehe', 'tiefe', 'länge', 'laenge', 'durchmesser',
  'lieferumfang', 'lieferzeit', 'versand', 'versandklasse', 'versandgewicht',
  'hergestellt', 'herkunft', 'herkunftsland', 'produktion', 'gefertigt',
  'zertifizierung', 'zertifikat', 'norm', 'prüfung',
  'anschluss', 'spannung', 'leistung', 'watt',
  'sku', 'artikelnummer', 'artikel', 'modell',
]);

function isSpecLabel(raw: string): boolean {
  const normalized = raw.toLowerCase().replace(/[^a-zäöüß]/g, '');
  return SPEC_KEYWORDS.has(normalized);
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

function parseTableRows(tableHtml: string): SpecRow[] {
  const rows: SpecRow[] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
    const rowContent = rowMatch[1];
    const cellRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
    const cells: string[] = [];
    let cellMatch: RegExpExecArray | null;

    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      const content = stripTags(cellMatch[1]);
      if (content) cells.push(content);
    }

    if (cells.length >= 2) {
      rows.push({ label: cells[0], value: cells.slice(1).join(' – ') });
    }
  }

  return rows;
}

// Only extracts an item if it has a <strong> tag AND the label is a known spec keyword.
function parseListItem(itemHtml: string): SpecRow | null {
  const boldMatch = itemHtml.match(/<strong[^>]*>([\s\S]*?)<\/strong>([\s\S]*)/i);
  if (!boldMatch) return null;

  const label = stripTags(boldMatch[1]).replace(/:$/, '').trim();
  const value = stripTags(boldMatch[2]).replace(/^[\s:]+/, '').trim();

  if (!label || !value) return null;
  if (!isSpecLabel(label)) return null;

  return { label, value };
}

function extractSpecsFromList(listHtml: string): SpecRow[] | null {
  const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  const items: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(listHtml)) !== null) {
    items.push(match[1]);
  }

  if (items.length === 0) return null;

  const parsed = items.map(parseListItem).filter((r): r is SpecRow => r !== null);
  if (parsed.length === 0) return null;

  return parsed;
}

export function parseProductDescription(html: string): ParsedDescription {
  if (!html) return { mainHtml: html, specs: [] };

  const specs: SpecRow[] = [];

  const mainHtml = html
    // Extract tables
    .replace(/<table[\s\S]*?<\/table>/gi, (tableHtml) => {
      specs.push(...parseTableRows(tableHtml));
      return '';
    })
    // Extract spec items from lists — leaves the list in place if no spec items found
    .replace(/<(?:ul|ol)[^>]*>[\s\S]*?<\/(?:ul|ol)>/gi, (listHtml) => {
      const rows = extractSpecsFromList(listHtml);
      if (!rows) return listHtml;

      // Remove only the matched <li> items; keep the list if non-spec items remain
      const strippedList = listHtml.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (liHtml, inner) => {
        return parseListItem(inner) ? '' : liHtml;
      });
      specs.push(...rows);

      // Drop the list entirely if it's now empty
      const hasRemainingItems = /<li/i.test(strippedList);
      return hasRemainingItems ? strippedList : '';
    })
    // Clean up empty paragraphs left behind
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
    .trim();

  return { mainHtml, specs };
}
