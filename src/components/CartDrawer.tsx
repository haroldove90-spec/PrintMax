import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Tag, 
  FileText
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, acquisitionType: 'compra' | 'renta') => void;
  onRemoveItem: (productId: string, acquisitionType: 'compra' | 'renta') => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'KYOCERA10' || code === 'PRINTMAX10') {
      setDiscountPercent(10);
      setCouponSuccess('¡Cupón del 10% de descuento corporativo aplicado!');
    } else if (code === 'ENVIOFREE') {
      setCouponSuccess('¡Envío nacional gratuito aplicado!');
    } else {
      setCouponError('Cupón inválido. Intente con: KYOCERA10');
    }
  };

  const calculateItemPrice = (item: CartItem) => {
    if (item.acquisitionType === 'renta' && item.product.rentalPriceMonthly) {
      return item.product.rentalPriceMonthly * item.quantity;
    }
    return item.product.price * item.quantity;
  };

  const rawSubtotal = items.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.16; // 16% IVA
  const total = subtotalAfterDiscount + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Carrito de Compras</h3>
                <span className="text-xs text-slate-400">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'} seleccionados
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Tu carrito está vacío</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                  Explora nuestro catálogo de multifuncionales Kyocera, tóner original y pólizas de mantenimiento.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const unitPrice = item.acquisitionType === 'renta' && item.product.rentalPriceMonthly 
                    ? item.product.rentalPriceMonthly 
                    : item.product.price;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div 
                      key={`${item.product.id}-${item.acquisitionType}`}
                      className="pt-4 first:pt-0 flex space-x-4"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-slate-900 truncate pr-2" title={item.product.name}>
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id, item.acquisitionType)}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 mt-0.5 bg-blue-50 text-blue-700">
                          {item.acquisitionType === 'renta' ? 'Modalidad Renta Mensual' : 'Compra Definitiva'}
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          {/* Quantity selector */}
                          <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.acquisitionType)}
                              className="p-1 rounded bg-white text-slate-700 hover:bg-slate-200 transition shadow-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-2 text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.acquisitionType)}
                              className="p-1 rounded bg-white text-slate-700 hover:bg-slate-200 transition shadow-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black text-slate-900">
                              ${itemTotal.toLocaleString('es-MX')} MXN
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-[10px] text-slate-400">
                                (${unitPrice.toLocaleString('es-MX')} c/u)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Cupón corporativo (ej. KYOCERA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 uppercase placeholder:normal-case font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                >
                  Aplicar
                </button>
              </form>

              {couponSuccess && (
                <div className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{couponSuccess}</span>
                </div>
              )}
              {couponError && (
                <div className="text-xs text-red-500 font-medium">
                  {couponError}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">${rawSubtotal.toLocaleString('es-MX')} MXN</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Descuento ({discountPercent}%):</span>
                    <span className="font-semibold">-${discountAmount.toLocaleString('es-MX')} MXN</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>I.V.A. (16% Deducible):</span>
                  <span className="font-semibold text-slate-800">${tax.toLocaleString('es-MX')} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío a todo México:</span>
                  <span className="font-bold text-emerald-600">Gratis (SLP y Nacional)</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total Neto:</span>
                  <span className="text-blue-600">${total.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-neutral-900 active:bg-neutral-950 text-white font-bold text-sm tracking-wide border border-neutral-700 hover:border-blue-500 shadow-xl transition flex items-center justify-center space-x-2"
              >
                <span>Proceder al Checkout</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Factura CFDI 4.0 al confirmar su compra</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
