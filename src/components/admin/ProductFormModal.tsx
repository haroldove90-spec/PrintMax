import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  Upload, 
  Printer, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Product, ProductCategory, StoreCategory } from '../../types';
import { uploadProductImageToSupabase } from '../../lib/supabase';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
  onSave: (product: Product) => void;
  categories?: StoreCategory[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
  categories
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [validationError, setValidationError] = useState('');

  const createEmptyForm = (): Partial<Product> => ({
    id: `prod-${Date.now()}`,
    name: '',
    code: '',
    category: 'multifuncionales-a4',
    categoryLabel: 'Multifuncional A4',
    price: 0,
    rentalPriceMonthly: undefined,
    badge: '',
    shortDescription: '',
    description: '',
    image: '',
    active: true,
    inStock: true,
    stockQuantity: 5,
    minStockAlert: 2,
    datasheetUrl: '',
    rating: 5.0,
    reviewsCount: 0,
    originalRef: '',
    specs: {
      velocidad: '',
      formato: 'Carta, Oficio, A4',
      resolucion: '1200 x 1200 dpi',
      cicloMensual: '',
      volumenRecomendado: '',
      pantalla: '',
      memoria: '',
      funcionesPrincipales: '',
      consumiblesPrincipales: '',
      tipoImpresion: 'Monocromo (B&N)',
      capacidadPapel: 'Estándar de fábrica',
      tipoTinta: 'Tóner original Kyocera',
      conectividad: ['Gigabit Ethernet', 'USB 2.0'],
      duplex: true,
      red: true,
      color: false,
      dimensiones: '',
      peso: ''
    },
    features: []
  });

  const [formData, setFormData] = useState<Partial<Product>>(createEmptyForm);
  const [connectivityText, setConnectivityText] = useState('Gigabit Ethernet, USB 2.0');

  useEffect(() => {
    setUploadNotice(null);
    setValidationError('');
    if (productToEdit) {
      const cloned: Product = JSON.parse(JSON.stringify(productToEdit));
      setFormData({
        ...cloned,
        active: cloned.active !== false
      });
      setConnectivityText(
        Array.isArray(cloned.specs?.conectividad) ? cloned.specs.conectividad.join(', ') : ''
      );
    } else {
      const empty = createEmptyForm();
      setFormData(empty);
      setConnectivityText('Gigabit Ethernet, USB 2.0');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const defaultCategoryOptions: { id: ProductCategory; label: string }[] = [
    { id: 'multifuncionales-a3', label: 'Multifuncional A3' },
    { id: 'multifuncionales-a4', label: 'Multifuncional A4' },
    { id: 'impresoras', label: 'Impresora A4' },
    { id: 'produccion', label: 'Impresión de Producción' },
    { id: 'consumibles', label: 'Tóner y Consumibles' },
    { id: 'polizas', label: 'Póliza de Servicio' }
  ];

  const categoryOptions = categories && categories.length > 0
    ? categories.filter((c) => c.active).map((c) => ({ id: c.slug, label: c.name }))
    : defaultCategoryOptions;

  const handleImageFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadNotice(null);

    const res = await uploadProductImageToSupabase(file, formData.code || formData.name);
    setUploadingImage(false);

    if (res.url) {
      setFormData((prev) => ({ ...prev, image: res.url }));
      setUploadNotice({
        type: 'success',
        message: 'Imagen subida directamente a Supabase Storage y vinculada al producto.'
      });
    } else {
      setUploadNotice({
        type: 'error',
        message: res.error || 'No se pudo subir la imagen a Supabase.'
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    if (!formData.name?.trim() || !formData.code?.trim()) {
      setValidationError('Por favor ingrese el nombre del producto y el SKU / Modelo.');
      return;
    }

    const qty = Number(formData.stockQuantity ?? 5);
    const connArray = connectivityText
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const isColor = formData.specs?.color ?? false;

    const finalProduct: Product = {
      id: formData.id || `prod-${Date.now()}`,
      name: formData.name.trim(),
      code: formData.code.trim(),
      category: formData.category || 'multifuncionales-a4',
      categoryLabel:
        categoryOptions.find((c) => c.id === formData.category)?.label ||
        formData.categoryLabel ||
        'Hardware',
      price: Number(formData.price) || 0,
      rentalPriceMonthly: formData.rentalPriceMonthly ? Number(formData.rentalPriceMonthly) : undefined,
      badge: formData.badge?.trim() || undefined,
      shortDescription: formData.shortDescription?.trim() || '',
      description: formData.description?.trim() || '',
      image: formData.image?.trim() || '',
      active: formData.active !== false,
      specs: {
        velocidad: formData.specs?.velocidad || '',
        formato: formData.specs?.formato || 'Carta / Oficio',
        resolucion: formData.specs?.resolucion || '1200 x 1200 dpi',
        cicloMensual: formData.specs?.cicloMensual || '',
        volumenRecomendado: formData.specs?.volumenRecomendado || '',
        pantalla: formData.specs?.pantalla || '',
        memoria: formData.specs?.memoria || '',
        funcionesPrincipales: formData.specs?.funcionesPrincipales || '',
        consumiblesPrincipales: formData.specs?.consumiblesPrincipales || '',
        tipoImpresion: formData.specs?.tipoImpresion || (isColor ? 'Color' : 'Monocromo (B&N)'),
        capacidadPapel: formData.specs?.capacidadPapel || 'Estándar de fábrica',
        tipoTinta: formData.specs?.consumiblesPrincipales || formData.specs?.tipoTinta || 'Consumible original',
        conectividad: connArray.length > 0 ? connArray : ['Ethernet'],
        duplex: formData.specs?.duplex ?? true,
        red: connArray.some((c) => /ethernet|red|wifi|wi-fi|1000|lan/i.test(c)) || (formData.specs?.red ?? true),
        color: isColor,
        dimensiones: formData.specs?.dimensiones || '',
        peso: formData.specs?.peso || ''
      },
      features:
        formData.features && formData.features.length > 0
          ? formData.features
          : [
              ...(formData.specs?.funcionesPrincipales ? [`Funciones: ${formData.specs.funcionesPrincipales}`] : []),
              ...(formData.specs?.pantalla ? [`Pantalla: ${formData.specs.pantalla}`] : []),
              ...(formData.specs?.consumiblesPrincipales ? [`Consumibles: ${formData.specs.consumiblesPrincipales}`] : [])
            ],
      inStock: qty > 0 && (formData.inStock ?? true),
      stockQuantity: qty,
      minStockAlert: Number(formData.minStockAlert ?? 2),
      datasheetUrl: formData.datasheetUrl?.trim() || undefined,
      rating: formData.rating || 5.0,
      reviewsCount: formData.reviewsCount || 0,
      originalRef: formData.specs?.consumiblesPrincipales || formData.originalRef || ''
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      <div className="relative bg-black text-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden border border-neutral-800 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="shrink-0 bg-neutral-950 px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-500 shrink-0">
              <Printer className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {productToEdit ? `Editar Producto: ${productToEdit.name}` : 'Subir Nuevo Producto al Catálogo'}
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 truncate">
                Administración de Tienda, Ficha Técnica e Imágenes en Supabase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition shrink-0 ml-2"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 md:p-8 space-y-5">
            {validationError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold">
                {validationError}
              </div>
            )}

            {/* Estado Activo/Desactivado */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                {formData.active !== false ? (
                  <Eye className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <EyeOff className="w-5 h-5 text-neutral-500 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold text-white">
                    Visibilidad en Tienda en Línea y Catálogo Público
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {formData.active !== false
                      ? 'Activo: El producto es visible para los clientes en la tienda.'
                      : 'Desactivado: El producto está oculto al público pero conservado en la base de datos.'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, active: formData.active === false })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition shrink-0 cursor-pointer ${
                  formData.active !== false
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                }`}
              >
                {formData.active !== false ? 'Activo' : 'Desactivado'}
              </button>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. TASKalfa MZ2501ci"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  SKU / Modelo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. TASKALFA-MZ2501CI"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const selected = categoryOptions.find((c) => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      category: e.target.value as ProductCategory,
                      categoryLabel: selected?.label || formData.categoryLabel
                    });
                  }}
                  className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Badge / Etiqueta Destacada
                </label>
                <input
                  type="text"
                  placeholder="Ej. Más Vendido, Novedad, A3 Pro"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Precio de Venta ($ MXN con IVA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.price ?? 0}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full text-sm font-black bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Precio de Renta Mensual ($ MXN/mes - Opcional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Dejar vacío o en 0 si solo es venta"
                  value={formData.rentalPriceMonthly || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentalPriceMonthly: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className="w-full text-sm font-black bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Supabase Direct Image Upload + URL */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Imagen del Producto (Subida directa a Supabase)</span>
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Sube una foto desde tu computadora directamente a Supabase Storage o pega una URL externa.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageFileSelected}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer shrink-0 shadow-md"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subiendo a Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Subir Imagen a Supabase</span>
                    </>
                  )}
                </button>
              </div>

              {uploadNotice && (
                <div
                  className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2 ${
                    uploadNotice.type === 'success'
                      ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                      : 'bg-red-950/70 border-red-800 text-red-300'
                  }`}
                >
                  {uploadNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{uploadNotice.message}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.name || 'Vista previa'}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-600" />
                  )}
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    URL de Imagen (se llena automáticamente al subir a Supabase):
                  </label>
                  <input
                    type="text"
                    placeholder="https://... (o sube una imagen con el botón de arriba)"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full text-xs bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Descripción Corta (Vista en tarjeta)
                </label>
                <input
                  type="text"
                  placeholder="Breve resumen de 1 línea"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Descripción Completa (Ficha Técnica y Detalle)
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalle de capacidades, componentes cerámicos ECOSYS, etc."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Technical Specs (All 15 Database Columns) */}
            <div className="border-t border-neutral-800 pt-4 space-y-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                Especificaciones Técnicas Completas (Base de Datos)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Tipo de Impresión:</label>
                  <select
                    value={formData.specs?.color ? 'Color' : 'Monocromo (B&N)'}
                    onChange={(e) => {
                      const isCol = e.target.value === 'Color';
                      setFormData({
                        ...formData,
                        specs: {
                          ...formData.specs!,
                          color: isCol,
                          tipoImpresion: e.target.value
                        }
                      });
                    }}
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  >
                    <option value="Color">Color</option>
                    <option value="Monocromo (B&N)">Monocromo (B&N)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Velocidad Carta (ppm):</label>
                  <input
                    type="text"
                    placeholder="Ej. 42 ppm"
                    value={formData.specs?.velocidad || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, velocidad: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Resolución:</label>
                  <input
                    type="text"
                    placeholder="Ej. 1200 x 1200 dpi"
                    value={formData.specs?.resolucion || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, resolucion: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Ciclo Máx. Mensual:</label>
                  <input
                    type="text"
                    placeholder="Ej. 100,000 pág/mes"
                    value={formData.specs?.cicloMensual || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, cicloMensual: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Volumen Rec. Mensual:</label>
                  <input
                    type="text"
                    placeholder="Ej. 48,000 pág/mes"
                    value={formData.specs?.volumenRecomendado || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, volumenRecomendado: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Pantalla:</label>
                  <input
                    type="text"
                    placeholder='Ej. LCD táctil 10.1"'
                    value={formData.specs?.pantalla || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, pantalla: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Memoria:</label>
                  <input
                    type="text"
                    placeholder="Ej. 4GB RAM / 256GB SSD"
                    value={formData.specs?.memoria || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, memoria: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Dimensiones (An x Pr x Al):</label>
                  <input
                    type="text"
                    placeholder="Ej. 602 x 662.9 x 789.9 mm"
                    value={formData.specs?.dimensiones || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, dimensiones: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Peso:</label>
                  <input
                    type="text"
                    placeholder="Ej. 90 kg"
                    value={formData.specs?.peso || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, peso: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-neutral-400 mb-1">Funciones Principales:</label>
                  <input
                    type="text"
                    placeholder="Ej. Impresión, Escaneo, Copiado, Fax opcional"
                    value={formData.specs?.funcionesPrincipales || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, funcionesPrincipales: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-neutral-400 mb-1">Conectividad / Interfaces (separado por comas):</label>
                  <input
                    type="text"
                    placeholder="Ej. Gigabit Ethernet, USB 3.0/2.0, Wi-Fi opc."
                    value={connectivityText}
                    onChange={(e) => setConnectivityText(e.target.value)}
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1">Consumibles Principales:</label>
                  <input
                    type="text"
                    placeholder="Ej. TK-8467 (Negro: ~30k, Color: ~20k)"
                    value={formData.specs?.consumiblesPrincipales || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: {
                          ...formData.specs!,
                          consumiblesPrincipales: e.target.value,
                          tipoTinta: e.target.value
                        }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Formato de Papel:</label>
                  <input
                    type="text"
                    placeholder="Ej. A3 / Doble Carta / Carta"
                    value={formData.specs?.formato || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, formato: e.target.value }
                      })
                    }
                    className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-1">
                <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specs?.duplex ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specs: { ...formData.specs!, duplex: e.target.checked }
                      })
                    }
                    className="rounded text-blue-600 bg-neutral-900 border-neutral-700"
                  />
                  <span>Dúplex Automático</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock ?? true}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded text-blue-600 bg-neutral-900 border-neutral-700"
                  />
                  <span className="font-bold text-emerald-400">Disponible en Inventario</span>
                </label>
              </div>

              {/* Inventario Numérico & Ficha Técnica */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs mt-2">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Unidades en Inventario (Piezas SLP):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity ?? 5}
                    onChange={(e) => {
                      const q = parseInt(e.target.value, 10) || 0;
                      setFormData({
                        ...formData,
                        stockQuantity: q,
                        inStock: q > 0
                      });
                    }}
                    className="w-full bg-neutral-950 text-white font-mono font-bold px-3 py-2 rounded-lg border border-neutral-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Alerta de Stock Bajo (&lt;= pzas):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStockAlert ?? 2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minStockAlert: parseInt(e.target.value, 10) || 2
                      })
                    }
                    className="w-full bg-neutral-950 text-amber-400 font-mono font-bold px-3 py-2 rounded-lg border border-neutral-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    Ficha Técnica Oficial (PDF URL):
                  </label>
                  <input
                    type="text"
                    placeholder="https://.../ficha-kyocera.pdf"
                    value={formData.datasheetUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        datasheetUrl: e.target.value
                      })
                    }
                    className="w-full bg-neutral-950 text-white font-mono px-3 py-2 rounded-lg border border-neutral-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="shrink-0 p-3.5 sm:p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-blue-500 text-xs sm:text-sm font-bold transition flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4 text-blue-500" />
              <span>{productToEdit ? 'Guardar Cambios' : 'Publicar Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
