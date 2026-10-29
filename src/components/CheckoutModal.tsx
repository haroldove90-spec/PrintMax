import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  FileText, 
  Printer, 
  Send, 
  Truck, 
  Lock,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { CartItem, OrderDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
  onOrderCreated?: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onClearCart,
  onOrderCreated
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    rfc: '',
    email: '',
    phone: '',
    address: '',
    city: 'San Luis Potosí',
    state: 'San Luis Potosí',
    postalCode: '',
    paymentMethod: 'spei' as 'spei' | 'tarjeta' | 'credito-empresarial',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => {
    const price = item.acquisitionType === 'renta' && item.product.rentalPriceMonthly 
      ? item.product.rentalPriceMonthly 
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const tax = rawSubtotal * 0.16;
  const shipping = 0; // Envío gratis garantizado
  const total = rawSubtotal + tax + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `KM-${Math.floor(100000 + Math.random() * 900000)}`;
      const order: OrderDetails = {
        orderId: orderNumber,
        customerName: formData.customerName,
        companyName: formData.companyName || formData.customerName,
        rfc: formData.rfc.toUpperCase() || 'XAXX010101000',
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        paymentMethod: formData.paymentMethod,
        items: [...items],
        subtotal: rawSubtotal,
        tax,
        shipping,
        total,
        date: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'pendiente',
        notes: formData.notes
      };

      setConfirmedOrder(order);
      setIsSubmitting(false);
      onClearCart();
      if (onOrderCreated) {
        onOrderCreated(order);
      }
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  const getWhatsAppLink = (order: OrderDetails) => {
    const message = `Hola PrintMax Kyocera México, he generado el pedido ${order.orderId} a nombre de ${order.customerName} (${order.companyName}) por un total de $${order.total.toLocaleString('es-MX')} MXN. Solicito seguimiento de entrega y factura CFDI.`;
    return `https://wa.me/524448123000?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-100 my-8">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {confirmedOrder ? 'Confirmación de Pedido Oficial' : 'Finalizar Pedido y Facturación (CFDI 4.0)'}
              </h3>
              <p className="text-xs text-slate-400">
                Distribuidor Autorizado Kyocera • San Luis Potosí & Nacional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {confirmedOrder ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                ¡Pedido Generado con Éxito!
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-2">
                Folio: <span className="text-blue-600 font-mono">{confirmedOrder.orderId}</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Fecha de registro: {confirmedOrder.date}
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs sm:text-sm space-y-3">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-500 text-xs block">Cliente / Razón Social:</span>
                  <span className="font-bold text-slate-900">{confirmedOrder.customerName} ({confirmedOrder.companyName})</span>
                  <div className="text-slate-500 text-xs font-mono">RFC: {confirmedOrder.rfc}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Entrega en:</span>
                  <span className="font-semibold text-slate-900">{confirmedOrder.address}, {confirmedOrder.city}, {confirmedOrder.state} CP {confirmedOrder.postalCode}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 py-2">
                <span className="text-slate-500 text-xs block font-bold">Resumen de Equipos y Consumibles:</span>
                {confirmedOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-slate-800">
                      <strong>{it.quantity}x</strong> {it.product.name} ({it.acquisitionType === 'renta' ? 'Renta' : 'Venta'})
                    </span>
                    <span className="font-mono font-semibold text-slate-900">
                      ${((it.acquisitionType === 'renta' && it.product.rentalPriceMonthly ? it.product.rentalPriceMonthly : it.product.price) * it.quantity).toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-base font-black">
                <span className="text-slate-900">Total a Pagar (IVA incluido):</span>
                <span className="text-blue-600 text-lg font-mono">
                  ${confirmedOrder.total.toLocaleString('es-MX')} MXN
                </span>
              </div>
            </div>

            {/* Payment instructions based on method */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-blue-900 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Instrucciones de Pago ({confirmedOrder.paymentMethod === 'spei' ? 'Transferencia SPEI' : confirmedOrder.paymentMethod === 'tarjeta' ? 'Tarjeta Bancaria' : 'Crédito Empresarial'}):</span>
              </div>
              <p>
                Banco: <strong>BBVA México</strong> | Beneficiario: <strong>KM Corporación S.A. de C.V.</strong>
              </p>
              <p>
                CLABE Interbancaria: <strong className="font-mono text-slate-900">012 700 00123456789 4</strong> | Referencia: <strong className="font-mono text-blue-700">{confirmedOrder.orderId}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Al realizar su depósito, envíe el comprobante al correo de facturación o directamente al WhatsApp corporativo para despacho prioritario.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={getWhatsAppLink(confirmedOrder)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Notificar Pedido por WhatsApp</span>
              </a>

              <button
                onClick={handlePrint}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border border-slate-300"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Comprobante</span>
              </button>

              <button
                onClick={onClose}
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Step 1: Contact and Billing */}
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4" />
                <span>1. Datos Fiscales y de Contacto (CFDI 4.0)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Ing. Roberto Mendoza"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Empresa o Razón Social
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Soluciones Industriales del Centro S.A."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    RFC (para factura fiscal)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. SIC080412XYZ"
                    value={formData.rfc}
                    onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="roberto@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono Móvil / WhatsApp de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 444 812 3456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Truck className="w-4 h-4" />
                <span>2. Dirección de Entrega e Instalación en México</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Calle, Número Exterior e Interior, Colonia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Av. Venustiano Carranza #1450, Col. Tequisquiapan"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ciudad / Municipio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estado *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="78230"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4" />
                <span>3. Método de Pago Corporativo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${formData.paymentMethod === 'spei' ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="spei"
                      checked={formData.paymentMethod === 'spei'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'spei' })}
                      className="text-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-900">SPEI Interbancario</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    Sin comisiones extras. Confirmación inmediata.
                  </span>
                </label>

                <label className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${formData.paymentMethod === 'tarjeta' ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="tarjeta"
                      checked={formData.paymentMethod === 'tarjeta'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'tarjeta' })}
                      className="text-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-900">Tarjeta Visa / MC / Amex</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    Pago seguro con cifrado SSL bancario.
                  </span>
                </label>

                <label className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${formData.paymentMethod === 'credito-empresarial' ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credito-empresarial"
                      checked={formData.paymentMethod === 'credito-empresarial'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'credito-empresarial' })}
                      className="text-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-900">Orden de Compra / Renta</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    Para contratos de renta o crédito a 30 días.
                  </span>
                </label>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Total a Pagar (Neto con IVA):</span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ${total.toLocaleString('es-MX')} <span className="text-xs font-sans text-slate-500">MXN</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Volver al Carrito
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-black hover:bg-neutral-900 active:bg-neutral-950 text-white text-xs sm:text-sm font-bold tracking-wide border border-neutral-700 hover:border-blue-500 shadow-xl transition flex items-center space-x-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span>{isSubmitting ? 'Procesando Orden...' : 'Confirmar y Generar Pedido'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
