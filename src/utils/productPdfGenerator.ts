import { Product } from '../types';

/**
 * Encodes a Unicode string into a pure ASCII PDF literal string using
 * WinAnsiEncoding octal escapes so Spanish accents render cleanly
 * while keeping exact 1-byte-per-char xref offsets.
 */
function encodePdfText(input: string): string {
  const normalized = (input || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2022/g, '-')
    .replace(/\u2026/g, '...')
    .trim();

  let out = '';
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    if (code === 0x28 || code === 0x29 || code === 0x5c) {
      out += '\\' + normalized[i];
    } else if (code >= 0x20 && code <= 0x7e) {
      out += normalized[i];
    } else if (code >= 0xa0 && code <= 0xff) {
      out += '\\' + code.toString(8).padStart(3, '0');
    } else {
      out += ' ';
    }
  }
  return out;
}

function wrapText(text: string, maxChars: number): string[] {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const words = clean.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + ' ' + word).length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function generateProductDatasheetPdfBlob(product: Product): Blob {
  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 46;
  const contentWidth = pageWidth - marginX * 2;

  const ops: string[] = [];

  // Header Navy Bar (#102540)
  ops.push('0.063 0.145 0.251 rg');
  ops.push(`0 ${pageHeight - 92} ${pageWidth} 92 re f`);

  // Orange Accent Strip (#F27C36)
  ops.push('0.949 0.486 0.212 rg');
  ops.push(`0 ${pageHeight - 97} ${pageWidth} 5 re f`);

  // Header Brand & Title
  ops.push('1 1 1 rg');
  ops.push('BT /F2 20 Tf 46 742 Td (LUMESA) Tj ET');
  ops.push('0.80 0.85 0.91 rg');
  ops.push(`BT /F1 9.5 Tf 46 724 Td (${encodePdfText('Ficha Tecnica de Equipo de Impresion - Distribuidor Kyocera')}) Tj ET`);

  // Category pill label & SKU in header right
  ops.push('0.949 0.486 0.212 rg');
  ops.push(`BT /F2 9.5 Tf 370 744 Td (${encodePdfText((product.categoryLabel || 'EQUIPO KYOCERA').toUpperCase())}) Tj ET`);
  ops.push('0.85 0.89 0.94 rg');
  ops.push(`BT /F1 9 Tf 370 726 Td (${encodePdfText(`SKU: ${product.code || 'N/A'}`)}) Tj ET`);

  let y = pageHeight - 130;

  // Product Name
  ops.push('0.063 0.145 0.251 rg');
  ops.push(`BT /F2 19 Tf ${marginX} ${y} Td (${encodePdfText(product.name)}) Tj ET`);
  y -= 20;

  // Description
  if (product.description) {
    ops.push('0.27 0.33 0.40 rg');
    const descLines = wrapText(product.description, 88).slice(0, 4);
    for (const line of descLines) {
      ops.push(`BT /F1 10 Tf ${marginX} ${y} Td (${encodePdfText(line)}) Tj ET`);
      y -= 14;
    }
  }

  y -= 10;

  // Highlighted Features
  if (product.features && product.features.length > 0) {
    ops.push('0.063 0.145 0.251 rg');
    ops.push(`BT /F2 10.5 Tf ${marginX} ${y} Td (${encodePdfText('CARACTERISTICAS DESTACADAS')}) Tj ET`);
    y -= 6;
    ops.push('0.88 0.90 0.93 RG 0.8 w');
    ops.push(`${marginX} ${y} m ${marginX + contentWidth} ${y} l S`);
    y -= 15;

    for (const feat of product.features.slice(0, 6)) {
      const wrapped = wrapText(feat, 84);
      wrapped.forEach((line, idx) => {
        if (idx === 0) {
          ops.push('0.949 0.486 0.212 rg');
          ops.push(`BT /F2 10 Tf ${marginX} ${y} Td (-) Tj ET`);
        }
        ops.push('0.20 0.25 0.32 rg');
        ops.push(`BT /F1 9.5 Tf ${marginX + 12} ${y} Td (${encodePdfText(line)}) Tj ET`);
        y -= 13.5;
      });
    }
    y -= 10;
  }

  // Technical Specs Section Box
  const specEntries: { label: string; value: string }[] = [
    {
      label: 'Tipo de impresión',
      value: product.specs.tipoImpresion || (product.specs.color ? 'Color' : 'Monocromo (B&N)')
    },
    { label: 'Velocidad', value: product.specs.velocidad || 'No especificado' },
    { label: 'Resolución', value: product.specs.resolucion || 'No especificado' },
    { label: 'Ciclo máx. mensual', value: product.specs.cicloMensual || 'No especificado' },
    ...(product.specs.volumenRecomendado
      ? [{ label: 'Volumen rec. mensual', value: product.specs.volumenRecomendado }]
      : []),
    ...(product.specs.pantalla ? [{ label: 'Pantalla', value: product.specs.pantalla }] : []),
    ...(product.specs.memoria ? [{ label: 'Memoria', value: product.specs.memoria }] : []),
    { label: 'Formato de papel', value: product.specs.formato || 'Carta / Oficio' },
    ...(product.specs.funcionesPrincipales
      ? [{ label: 'Funciones principales', value: product.specs.funcionesPrincipales }]
      : []),
    ...(product.specs.conectividad && product.specs.conectividad.length > 0
      ? [{ label: 'Conectividad / Interfaces', value: product.specs.conectividad.join(', ') }]
      : []),
    ...(product.specs.consumiblesPrincipales || product.specs.tipoTinta
      ? [
          {
            label: 'Consumibles principales',
            value: product.specs.consumiblesPrincipales || product.specs.tipoTinta
          }
        ]
      : []),
    ...(product.specs.dimensiones
      ? [{ label: 'Dimensiones (An x Pr x Al)', value: product.specs.dimensiones }]
      : []),
    ...(product.specs.peso ? [{ label: 'Peso', value: product.specs.peso }] : [])
  ];

  ops.push('0.063 0.145 0.251 rg');
  ops.push(`BT /F2 10.5 Tf ${marginX} ${y} Td (${encodePdfText('FICHA DE ESPECIFICACIONES TECNICAS')}) Tj ET`);
  y -= 8;

  const colWidth = contentWidth / 2 - 8;
  const rowCount = Math.ceil(specEntries.length / 2);
  const rowHeight = 34;
  const boxHeight = Math.min(y - 74, rowCount * rowHeight + 20);
  const boxBottom = y - boxHeight;

  // Light slate background card
  ops.push('0.969 0.976 0.988 rg');
  ops.push(`${marginX} ${boxBottom} ${contentWidth} ${boxHeight} re f`);
  ops.push('0.85 0.88 0.92 RG 0.8 w');
  ops.push(`${marginX} ${boxBottom} ${contentWidth} ${boxHeight} re S`);

  let specY = y - 18;
  for (let row = 0; row < rowCount; row++) {
    if (specY < boxBottom + 16) break;
    const leftItem = specEntries[row * 2];
    const rightItem = specEntries[row * 2 + 1];

    if (leftItem) {
      ops.push('0.40 0.45 0.53 rg');
      ops.push(`BT /F1 8.5 Tf ${marginX + 12} ${specY} Td (${encodePdfText(leftItem.label + ':')}) Tj ET`);
      ops.push('0.063 0.145 0.251 rg');
      const valLine = wrapText(leftItem.value, 40)[0] || '';
      ops.push(`BT /F2 9.5 Tf ${marginX + 12} ${specY - 12} Td (${encodePdfText(valLine)}) Tj ET`);
    }

    if (rightItem) {
      const rightX = marginX + colWidth + 20;
      ops.push('0.40 0.45 0.53 rg');
      ops.push(`BT /F1 8.5 Tf ${rightX} ${specY} Td (${encodePdfText(rightItem.label + ':')}) Tj ET`);
      ops.push('0.063 0.145 0.251 rg');
      const valLine = wrapText(rightItem.value, 40)[0] || '';
      ops.push(`BT /F2 9.5 Tf ${rightX} ${specY - 12} Td (${encodePdfText(valLine)}) Tj ET`);
    }

    specY -= rowHeight;
  }

  // Footer Bar
  ops.push('0.88 0.90 0.93 RG 0.8 w');
  ops.push(`${marginX} 54 m ${marginX + contentWidth} 54 l S`);
  ops.push('0.40 0.45 0.53 rg');
  ops.push(
    `BT /F1 8.5 Tf ${marginX} 38 Td (${encodePdfText(
      'LUMESA - Renta y Venta de Equipos de Impresion Kyocera | San Luis Potosi, Mexico | Tel: (444) 812-3000'
    )}) Tj ET`
  );

  const streamContent = ops.join('\n');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n`,
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n',
    `6 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${offsets[i].toString().padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export function downloadProductDatasheetPdf(product: Product): void {
  const safeName = (product.name || product.code || 'equipo')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const blob = generateProductDatasheetPdfBlob(product);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Ficha_Tecnica_${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
