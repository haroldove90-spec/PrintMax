import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Upload, 
  Printer, 
  Layers, 
  Check, 
  DollarSign, 
  Tag, 
  Cpu,
  Image as ImageIcon
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
  onSave: (product: Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    code: '',
    category: 'multifuncionales-a3',
    categoryLabel: 'Multifuncional A3',
    price: 45000,
    rentalPriceMonthly: 1800,
    badge: 'Nuevo Modelo',
    shortDescription: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    rating: 5.0,
    reviewsCount: 1,
    specs: {
      velocidad: '35 ppm B&N y Color',
      formato: 'A3, Doble Carta, Oficio, Carta',
      resolucion: '1200 x 1200 dpi',
      cicloMensual: '100,000 páginas',
      capacidadPapel: '1,150 hojas',
      tipoTinta: 'Tóner cerámico de larga duración',
      conectividad: ['Ethernet Gigabit', 'USB 3.0', 'Wi-Fi'],
      duplex: true,
      red: true,
      color: true
    },
    features: [
      'Pantalla táctil intuitiva de alta resolución',
      'Escaneo dúplex de alta velocidad',
      'Compatibilidad con Net Manager y MyQ'
    ]
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData(JSON.parse(JSON.stringify(productToEdit)));
    } else {
      setFormData({
        id: `kyocera-custom-${Date.now()}`,
        name: '',
        code: 'TASKalfa ',
        category: 'multifuncionales-a3',
        categoryLabel: 'Multifuncional A3',
        price: 49900,
        rentalPriceMonthly: 1950,
        badge: 'Nuevo',
        shortDescription: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        rating: 5.0,
        reviewsCount: 1,
        specs: {
          velocidad: '35 ppm B&N y Color',
          formato: 'Hasta Doble Carta (11" x 17")',
          resolucion: '1200 x 1200 dpi',
          cicloMensual: '100,000 páginas',
          capacidadPapel: '1,150 hojas',
          tipoTinta: 'Tóner cerámico Kyocera',
          conectividad: ['Gigabit Ethernet', 'USB 3.0', 'Wi-Fi Direct'],
          duplex: true,
          red: true,
          color: true
        },
        features: [
          'Alimentador dúplex automático de un solo paso',
          'Conectores en la nube para Google Drive y OneDrive'
        ]
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const categoryOptions: { id: ProductCategory; label: string }[] = [
    { id: 'multifuncionales-a3', label: 'Multifuncional A3' },
    { id: 'multifuncionales-a4', label: 'Multifuncional A4' },
    { id: 'impresoras', label: 'Impresora Láser' },
    { id: 'produccion', label: 'Impresión de Producción' },
    { id: 'consumibles', label: 'Tóner y Consumibles' },
    { id: 'polizas', label: 'Póliza de Servicio' }
  ];

  const presetImages = [
    { label: 'Multifuncional A3 TASKalfa', url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80' },
    { label: 'Multifuncional Alto Volumen', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80' },
    { label: 'Multifuncional Compacto A4', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cartucho Tóner Original', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80' },
    { label: 'Póliza / Servicio Técnico', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert('Por favor ingrese el nombre y modelo/código del equipo.');
      return;
    }

    const finalProduct: Product = {
      id: formData.id || `prod-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      category: formData.category || 'multifuncionales-a3',
      categoryLabel: categoryOptions.find((c) => c.id === formData.category)?.label || 'Hardware',
      price: Number(formData.price) || 0,
      rentalPriceMonthly: formData.rentalPriceMonthly ? Number(formData.rentalPriceMonthly) : undefined,
      badge: formData.badge || '',
      shortDescription: formData.shortDescription || '',
      description: formData.description || '',
      image: formData.image || presetImages[0].url,
      specs: formData.specs || {
        velocidad: '35 ppm',
        formato: 'Carta / Oficio',
        resolucion: '1200 dpi',
        cicloMensual: '50,000 págs',
        capacidadPapel: '500 hojas',
        tipoTinta: 'Tóner Original',
        conectividad: ['Ethernet'],
        duplex: true,
        red: true,
        color: true
      },
      features: formData.features || ['Garantía oficial Kyocera'],
      inStock: formData.inStock ?? true,
      rating: formData.rating || 5.0,
      reviewsCount: formData.reviewsCount || 1,
      originalRef: formData.originalRef || ''
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-black text-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-neutral-800 my-8">
        
        {/* Header */}
        <div className="bg-neutral-950 px-6 py-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-500">
              <Printer className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {productToEdit ? `Editar Producto: ${productToEdit.name}` : 'Subir Nuevo Producto al Catálogo'}
              </h3>
              <p className="text-xs text-neutral-400">
                Administración de Tienda y Hardware Kyocera
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* General Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Nombre Comercial del Producto *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Kyocera TASKalfa 4054ci"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Modelo / Código SKU *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. TASKalfa 4054ci"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Categoría en Tienda
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
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
                Precio de Venta ($ MXN con IVA) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price || 0}
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
                placeholder="Dejar en 0 si solo es venta"
                value={formData.rentalPriceMonthly || ''}
                onChange={(e) => setFormData({ ...formData, rentalPriceMonthly: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full text-sm font-black bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Image URL & Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>URL de Imagen del Producto</span>
              <span className="text-[11px] text-blue-400">O elija una preconfigurada</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 mb-2 font-mono"
            />

            <div className="flex flex-wrap gap-2">
              {presetImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: img.url })}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                >
                  {img.label}
                </button>
              ))}
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
                placeholder="Detalle extenso de capacidades, componentes cerámicos ECOSYS, etc."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Technical Specs */}
          <div className="border-t border-neutral-800 pt-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-3">
              Especificaciones Técnicas
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Velocidad:</label>
                <input
                  type="text"
                  placeholder="Ej. 40 ppm"
                  value={formData.specs?.velocidad || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specs: { ...formData.specs!, velocidad: e.target.value }
                  })}
                  className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Formato:</label>
                <input
                  type="text"
                  placeholder="Ej. A3 / Doble Carta"
                  value={formData.specs?.formato || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specs: { ...formData.specs!, formato: e.target.value }
                  })}
                  className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Resolución:</label>
                <input
                  type="text"
                  placeholder="Ej. 1200 x 1200 dpi"
                  value={formData.specs?.resolucion || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specs: { ...formData.specs!, resolucion: e.target.value }
                  })}
                  className="w-full bg-neutral-900 text-white px-3 py-2 rounded-lg border border-neutral-800"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 mt-3">
              <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.specs?.color ?? true}
                  onChange={(e) => setFormData({
                    ...formData,
                    specs: { ...formData.specs!, color: e.target.checked }
                  })}
                  className="rounded text-blue-600 bg-neutral-900 border-neutral-700"
                />
                <span>Impresión a Color</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.specs?.duplex ?? true}
                  onChange={(e) => setFormData({
                    ...formData,
                    specs: { ...formData.specs!, duplex: e.target.checked }
                  })}
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
                <span className="font-bold text-emerald-400">En Existencia (Stock SLP)</span>
              </label>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-blue-500 text-xs sm:text-sm font-bold transition flex items-center space-x-2 shadow-lg"
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
