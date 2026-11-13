import * as XLSX from 'xlsx';
import { Product, ProductListingType, StoreCategory } from '../types';

export interface ParsedImportResult {
  products: Product[];
  warnings: string[];
  detectedColumns: string[];
  totalRowsRead: number;
}

function normalizeHeader(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseNumericValue(raw: unknown): number {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : 0;
  const cleaned = String(raw ?? '')
    .replace(/[$,\sMXNmxn]/g, '')
    .trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function parseBooleanValue(raw: unknown, defaultVal = true): boolean {
  if (typeof raw === 'boolean') return raw;
  const v = normalizeHeader(raw);
  if (!v) return defaultVal;
  if (['no', 'false', '0', 'inactivo', 'desactivado', 'deshabilitado', 'oculto'].includes(v)) {
    return false;
  }
  if (['si', 'yes', 'true', '1', 'activo', 'habilitado', 'visible'].includes(v)) {
    return true;
  }
  return defaultVal;
}

function parseListingTypeValue(
  raw: unknown,
  priceVal: number,
  rentalVal: number | undefined,
  existing?: ProductListingType
): ProductListingType {
  const v = normalizeHeader(raw);
  if (v) {
    if (
      v.includes('ambos') ||
      (v.includes('venta') && v.includes('renta')) ||
      (v.includes('compra') && v.includes('renta'))
    ) {
      return 'ambos';
    }
    if (v.includes('renta') || v.includes('arrendamiento')) {
      return 'renta';
    }
    if (v.includes('venta') || v.includes('compra')) {
      return 'venta';
    }
  }
  if (existing) return existing;
  if (rentalVal && rentalVal > 0 && priceVal <= 0) return 'renta';
  if (rentalVal && rentalVal > 0 && priceVal > 0) return 'ambos';
  return 'venta';
}

function mapCategorySlugAndLabel(
  rawCategory: string,
  storeCategories?: StoreCategory[]
): { slug: string; label: string; formatoDefault: string } {
  const clean = rawCategory.trim();
  const norm = normalizeHeader(clean);

  // Check if matches an existing storeCategory by name or slug
  if (storeCategories && storeCategories.length > 0) {
    const exactMatch = storeCategories.find(
      (c) => normalizeHeader(c.name) === norm || normalizeHeader(c.slug) === norm
    );
    if (exactMatch) {
      return {
        slug: exactMatch.slug,
        label: clean || exactMatch.name,
        formatoDefault: norm.includes('a3') ? 'A3, Doble Carta, Oficio, Carta' : 'Carta, Oficio, A4'
      };
    }
  }

  if (norm.includes('a3')) {
    return {
      slug: 'multifuncionales-a3',
      label: clean || 'Multifuncional A3',
      formatoDefault: 'A3, Doble Carta (11" x 17"), Oficio, Carta'
    };
  }
  if (norm.includes('impresora') && !norm.includes('multifuncional')) {
    return {
      slug: 'impresoras',
      label: clean || 'Impresora A4',
      formatoDefault: 'Carta, Oficio, A4'
    };
  }
  if (norm.includes('a4') || norm.includes('multifuncional')) {
    return {
      slug: 'multifuncionales-a4',
      label: clean || 'Multifuncional A4',
      formatoDefault: 'Carta, Oficio, A4'
    };
  }
  if (norm.includes('produccion')) {
    return {
      slug: 'produccion',
      label: clean || 'Impresión de Producción',
      formatoDefault: 'Hasta 13" x 19.2"'
    };
  }
  if (norm.includes('consumible') || norm.includes('toner')) {
    return {
      slug: 'consumibles',
      label: clean || 'Tóner y Consumibles',
      formatoDefault: 'Consumible Original'
    };
  }
  if (norm.includes('poliza') || norm.includes('servicio')) {
    return {
      slug: 'polizas',
      label: clean || 'Póliza de Servicio',
      formatoDefault: 'Servicio Técnico'
    };
  }

  return {
    slug: slugify(clean) || 'multifuncionales-a4',
    label: clean || 'Equipos Kyocera',
    formatoDefault: 'Carta, Oficio, A4'
  };
}

function decodeCsvBuffer(buffer: ArrayBuffer): string {
  const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
  const utf8Text = utf8Decoder.decode(buffer);
  if (!utf8Text.includes('\uFFFD')) {
    return utf8Text;
  }

  // Compare Windows-1252 vs MacRoman (Excel on macOS often exports CSV as MacRoman)
  let winText = utf8Text;
  let macText = '';
  try {
    winText = new TextDecoder('windows-1252').decode(buffer);
  } catch {
    winText = utf8Text;
  }
  try {
    macText = new TextDecoder('macintosh').decode(buffer);
  } catch {
    macText = '';
  }

  if (macText) {
    const scoreSpanish = (txt: string) => {
      const good = (txt.match(/[áéíóúüñÁÉÍÓÚÜÑ]/g) || []).length;
      const bad = (txt.match(/[‡—’çîŽœ–]/g) || []).length;
      return good - bad * 3;
    };
    if (scoreSpanish(macText) > scoreSpanish(winText)) {
      return macText;
    }
  }

  return winText;
}

export async function parseProductFile(
  file: File,
  existingProducts: Product[] = [],
  storeCategories?: StoreCategory[]
): Promise<ParsedImportResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const buffer = await file.arrayBuffer();

  let workbook: XLSX.WorkBook;
  if (ext === 'csv' || ext === 'txt') {
    const csvText = decodeCsvBuffer(buffer);
    workbook = XLSX.read(csvText, { type: 'string' });
  } else {
    workbook = XLSX.read(buffer, { type: 'array' });
  }

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('El archivo no contiene ninguna hoja válida.');
  }

  const warnings: string[] = [];
  const parsedProducts: Product[] = [];
  const existingByCode = new Map<string, Product>();
  const existingById = new Map<string, Product>();
  const usedIds = new Set<string>();
  const seenSkusInFile = new Set<string>();

  for (const p of existingProducts) {
    existingByCode.set(normalizeHeader(p.code), p);
    existingById.set(p.id, p);
  }

  let detectedColumns: string[] = [];
  let totalRowsRead = 0;
  let foundAnyHeader = false;

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) continue;

    const rawRows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: ''
    });

    if (!rawRows || rawRows.length === 0) continue;

    // Locate header row (handles title/subtitle rows at top of Excel/CSV)
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(rawRows.length, 25); i++) {
      const rowNorm = rawRows[i].map(normalizeHeader);
      const hasSku = rowNorm.some(
        (c) => c.includes('sku') || c.includes('modelo') || c === 'codigo' || c === 'codigo sku'
      );
      const hasName = rowNorm.some(
        (c) => c.includes('nombre') || c === 'producto'
      );
      if (hasSku && hasName) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      continue;
    }

    foundAnyHeader = true;
    const rawHeaders = rawRows[headerRowIndex].map((h) => String(h ?? '').trim());
    if (detectedColumns.length === 0) {
      detectedColumns = rawHeaders.filter(Boolean);
    }
    const normHeaders = rawHeaders.map(normalizeHeader);

    const findColIdx = (candidates: string[], exactOnly = false): number => {
      for (const candidate of candidates) {
        const idx = normHeaders.findIndex((h) => h === candidate);
        if (idx !== -1) return idx;
      }
      if (!exactOnly) {
        for (const candidate of candidates) {
          const idx = normHeaders.findIndex((h) => h.includes(candidate));
          if (idx !== -1) return idx;
        }
      }
      return -1;
    };

    const colMap = {
      // Exact match only for ID so it NEVER collides with "Velocidad" or "Conectividad"
      id: findColIdx(['id', 'id producto', 'product id'], true),
      sku: findColIdx(['sku / modelo', 'codigo sku', 'sku', 'modelo', 'codigo']),
      name: findColIdx(['nombre del producto', 'nombre', 'producto']),
      category: findColIdx(['categoria', 'categoria en tienda']),
      listingType: findColIdx(['modalidad (venta / renta)', 'modalidad', 'tipo de operacion', 'venta o renta', 'venta / renta', 'venta/renta', 'operacion', 'disponible para']),
      printType: findColIdx(['tipo de impresion', 'impresion']),
      speed: findColIdx(['velocidad carta (ppm)', 'velocidad', 'ppm']),
      resolution: findColIdx(['resolucion']),
      maxCycle: findColIdx(['ciclo max. mensual', 'ciclo max mensual', 'ciclo mensual']),
      recVolume: findColIdx(['volumen rec. mensual', 'volumen rec mensual', 'volumen recomendado']),
      screen: findColIdx(['pantalla', 'display']),
      memory: findColIdx(['memoria', 'ram']),
      mainFunctions: findColIdx(['funciones principales', 'funciones']),
      connectivity: findColIdx(['conectividad / interfaces', 'conectividad', 'interfaces']),
      consumables: findColIdx(['consumibles principales', 'consumibles', 'toner']),
      dimensions: findColIdx(['dimensiones (an x pr x al)', 'dimensiones']),
      weight: findColIdx(['peso']),
      price: findColIdx(['precio venta', 'precio', 'price']),
      rentalPrice: findColIdx(['renta mensual', 'precio renta', 'renta']),
      stockQty: findColIdx(['stock slp', 'stock', 'cantidad', 'existencias']),
      minStock: findColIdx(['stock minimo alerta', 'stock minimo', 'alerta stock']),
      inStock: findColIdx(['en existencia', 'disponible']),
      active: findColIdx(['activo', 'estado', 'estatus']),
      shortDesc: findColIdx(['descripcion corta', 'resumen']),
      fullDesc: findColIdx(['descripcion completa', 'descripcion']),
      image: findColIdx(['url imagen', 'imagen', 'image']),
      datasheet: findColIdx(['ficha tecnica pdf', 'ficha tecnica', 'datasheet']),
      badge: findColIdx(['badge', 'etiqueta'])
    };

    for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || row.every((cell) => String(cell ?? '').trim() === '')) {
        continue;
      }

      const getCell = (idx: number): string => (idx >= 0 ? String(row[idx] ?? '').trim() : '');

      const sku = getCell(colMap.sku);
      const name = getCell(colMap.name);

      if (!sku && !name) {
        continue;
      }
      totalRowsRead++;

      if (!sku || !name) {
        warnings.push(`Hoja "${sheetName}" fila ${r + 1}: Se omitió por faltar SKU o Nombre del Producto.`);
        continue;
      }

      const normSku = normalizeHeader(sku);
      if (seenSkusInFile.has(normSku)) {
        warnings.push(`Hoja "${sheetName}" fila ${r + 1}: SKU duplicado (${sku}). Se asignó un identificador único para conservar ambos registros.`);
      }
      seenSkusInFile.add(normSku);

      const rawId = getCell(colMap.id);
      const existing =
        (rawId ? existingById.get(rawId) : undefined) ||
        existingByCode.get(normSku);

      let candidateId = existing?.id || rawId || `prod-${slugify(sku) || Date.now()}-${r}`;
      if (usedIds.has(candidateId)) {
        let suffix = 2;
        while (usedIds.has(`${candidateId}-${suffix}`)) {
          suffix++;
        }
        candidateId = `${candidateId}-${suffix}`;
      }
      usedIds.add(candidateId);

      const rawCat = getCell(colMap.category);
      const catInfo = mapCategorySlugAndLabel(
        rawCat || existing?.categoryLabel || 'Multifuncional A4',
        storeCategories
      );

      const printType = getCell(colMap.printType) || existing?.specs?.tipoImpresion || '';
      const isColor = printType
        ? normalizeHeader(printType).includes('color')
        : (existing?.specs?.color ?? false);

      const speed = getCell(colMap.speed) || existing?.specs?.velocidad || 'No especificado';
      const resolution = getCell(colMap.resolution) || existing?.specs?.resolucion || '1200 x 1200 dpi';
      const maxCycle = getCell(colMap.maxCycle) || existing?.specs?.cicloMensual || 'No especificado';
      const recVolume = getCell(colMap.recVolume) || existing?.specs?.volumenRecomendado || '';
      const screen = getCell(colMap.screen) || existing?.specs?.pantalla || '';
      const memory = getCell(colMap.memory) || existing?.specs?.memoria || '';
      const mainFunctions = getCell(colMap.mainFunctions) || existing?.specs?.funcionesPrincipales || '';
      const rawConn = getCell(colMap.connectivity);
      const connArray = rawConn
        ? rawConn.split(/[,;]+/).map((s) => s.trim()).filter(Boolean)
        : (existing?.specs?.conectividad || ['Ethernet', 'USB']);
      const consumables = getCell(colMap.consumables) || existing?.specs?.consumiblesPrincipales || '';
      const dimensions = getCell(colMap.dimensions) || existing?.specs?.dimensiones || '';
      const weight = getCell(colMap.weight) || existing?.specs?.peso || '';

      const priceVal = colMap.price >= 0 && getCell(colMap.price) !== ''
        ? parseNumericValue(row[colMap.price])
        : (existing?.price ?? 0);

      const rentalRaw = getCell(colMap.rentalPrice);
      const rentalVal = colMap.rentalPrice >= 0 && rentalRaw !== ''
        ? parseNumericValue(rentalRaw) || undefined
        : existing?.rentalPriceMonthly;

      const listingType = parseListingTypeValue(
        getCell(colMap.listingType),
        priceVal,
        rentalVal,
        existing?.listingType
      );

      const stockQty = colMap.stockQty >= 0 && getCell(colMap.stockQty) !== ''
        ? Math.max(0, Math.round(parseNumericValue(row[colMap.stockQty])))
        : (existing?.stockQuantity ?? 5);

      const minStock = colMap.minStock >= 0 && getCell(colMap.minStock) !== ''
        ? Math.max(1, Math.round(parseNumericValue(row[colMap.minStock])))
        : (existing?.minStockAlert ?? 2);

      const inStock = colMap.inStock >= 0 && getCell(colMap.inStock) !== ''
        ? parseBooleanValue(row[colMap.inStock], true)
        : (existing?.inStock ?? stockQty > 0);

      const active = colMap.active >= 0 && getCell(colMap.active) !== ''
        ? parseBooleanValue(row[colMap.active], true)
        : (existing?.active ?? true);

      const shortDesc =
        getCell(colMap.shortDesc) ||
        existing?.shortDescription ||
        `${catInfo.label} ${printType ? `• ${printType}` : ''} • ${speed}`.trim();

      const fullDesc =
        getCell(colMap.fullDesc) ||
        existing?.description ||
        `${name} (${sku}). ${mainFunctions ? `Funciones: ${mainFunctions}. ` : ''}${consumables ? `Consumibles: ${consumables}.` : ''}`.trim();

      const image = getCell(colMap.image) || existing?.image || '';
      const datasheet = getCell(colMap.datasheet) || existing?.datasheetUrl || '';
      const badge = getCell(colMap.badge) || existing?.badge || '';

      const generatedFeatures: string[] = [];
      if (mainFunctions) generatedFeatures.push(`Funciones: ${mainFunctions}`);
      if (screen) generatedFeatures.push(`Pantalla: ${screen}`);
      if (memory) generatedFeatures.push(`Memoria: ${memory}`);
      if (recVolume) generatedFeatures.push(`Volumen recomendado: ${recVolume}`);
      if (consumables) generatedFeatures.push(`Consumibles: ${consumables}`);

      const product: Product = {
        id: candidateId,
        name,
        code: sku,
        category: catInfo.slug,
        categoryLabel: catInfo.label,
        listingType,
        price: priceVal,
        rentalPriceMonthly: rentalVal,
        badge: badge || undefined,
        shortDescription: shortDesc,
        description: fullDesc,
        image,
        active,
        inStock,
        stockQuantity: stockQty,
        minStockAlert: minStock,
        datasheetUrl: datasheet || undefined,
        rating: existing?.rating ?? 5.0,
        reviewsCount: existing?.reviewsCount ?? 0,
        originalRef: consumables || existing?.originalRef || undefined,
        specs: {
          velocidad: speed,
          formato: existing?.specs?.formato || catInfo.formatoDefault,
          resolucion: resolution,
          cicloMensual: maxCycle,
          volumenRecomendado: recVolume || undefined,
          pantalla: screen || undefined,
          memoria: memory || undefined,
          funcionesPrincipales: mainFunctions || undefined,
          consumiblesPrincipales: consumables || undefined,
          tipoImpresion: printType || (isColor ? 'Color' : 'Monocromo (B&N)'),
          capacidadPapel: existing?.specs?.capacidadPapel || 'Estándar de fábrica',
          tipoTinta: consumables || existing?.specs?.tipoTinta || 'Consumible original Kyocera',
          conectividad: connArray,
          duplex: existing?.specs?.duplex ?? true,
          red: connArray.some((c) => /ethernet|red|wifi|wi-fi|1000|lan/i.test(c)) || (existing?.specs?.red ?? true),
          color: isColor,
          dimensiones: dimensions || undefined,
          peso: weight || undefined
        },
        features: existing?.features && existing.features.length > 0
          ? existing.features
          : (generatedFeatures.length > 0 ? generatedFeatures : ['Equipo Kyocera original con soporte técnico LUMESA'])
      };

      parsedProducts.push(product);
    }
  }

  if (!foundAnyHeader) {
    throw new Error(
      'No se encontraron las columnas requeridas ("SKU / Modelo" y "Nombre del Producto"). Verifica que el archivo tenga encabezados válidos.'
    );
  }

  return {
    products: parsedProducts,
    warnings,
    detectedColumns,
    totalRowsRead
  };
}

const EXPORT_HEADERS = [
  'SKU / Modelo',
  'Nombre del Producto',
  'Categoría',
  'Modalidad (Venta / Renta)',
  'Tipo de Impresión',
  'Velocidad Carta (ppm)',
  'Resolución',
  'Ciclo Máx. Mensual',
  'Volumen Rec. Mensual',
  'Pantalla',
  'Memoria',
  'Funciones Principales',
  'Conectividad / Interfaces',
  'Consumibles Principales',
  'Dimensiones (An x Pr x Al)',
  'Peso',
  'Precio Venta',
  'Renta Mensual',
  'Stock SLP',
  'Stock Mínimo Alerta',
  'En Existencia',
  'Activo',
  'Descripción Corta',
  'Descripción Completa',
  'URL Imagen',
  'Ficha Técnica PDF',
  'Badge',
  'ID'
];

function buildExportRows(products: Product[]): (string | number)[][] {
  return products.map((p) => {
    const modeLabel =
      p.listingType === 'renta'
        ? 'Solo Renta'
        : p.listingType === 'ambos'
        ? 'Venta y Renta'
        : 'Solo Venta';
    return [
      p.code,
      p.name,
      p.categoryLabel || p.category,
      modeLabel,
      p.specs?.tipoImpresion || (p.specs?.color ? 'Color' : 'Monocromo (B&N)'),
      p.specs?.velocidad || '',
      p.specs?.resolucion || '',
      p.specs?.cicloMensual || '',
      p.specs?.volumenRecomendado || '',
      p.specs?.pantalla || '',
      p.specs?.memoria || '',
      p.specs?.funcionesPrincipales || '',
      Array.isArray(p.specs?.conectividad) ? p.specs.conectividad.join(', ') : '',
      p.specs?.consumiblesPrincipales || p.specs?.tipoTinta || p.originalRef || '',
      p.specs?.dimensiones || '',
      p.specs?.peso || '',
      p.price ?? 0,
      p.rentalPriceMonthly ?? 0,
      p.stockQuantity ?? (p.inStock ? 5 : 0),
      p.minStockAlert ?? 2,
      p.inStock ? 'SI' : 'NO',
      p.active !== false ? 'SI' : 'NO',
      p.shortDescription || '',
      p.description || '',
      p.image || '',
      p.datasheetUrl || '',
      p.badge || '',
      p.id
    ];
  });
}

export function exportProductsToCsv(products: Product[]): void {
  const rows = buildExportRows(products);
  const escapeCsvCell = (val: string | number) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const csvContent =
    '\uFEFF' +
    [EXPORT_HEADERS.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `lumesa_base_datos_productos_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportProductsToXlsx(products: Product[]): void {
  const rows = buildExportRows(products);
  const worksheet = XLSX.utils.aoa_to_sheet([EXPORT_HEADERS, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos LUMESA');
  XLSX.writeFile(
    workbook,
    `lumesa_base_datos_productos_${new Date().toISOString().split('T')[0]}.xlsx`
  );
}
