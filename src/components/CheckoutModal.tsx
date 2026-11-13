import React, { useState, useEffect } from 'react';
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
  Receipt,
  Sparkles
} from 'lucide-react';
import { CartItem, OrderDetails, PaymentConfig, DiscountCoupon } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
  onOrderCreated?: (order: OrderDetails) => void;
  paymentConfig?: PaymentConfig;
  coupons?: DiscountCoupon[];
  whatsappPhone?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onClearCart,
  onOrderCreated,
  paymentConfig,
  coupons = [],
  whatsappPhone = '524448123000'
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    rfc: '',
    cfdiUse: 'G03 Gastos en general',
    taxRegime: '601 General de Ley Personas Morales',
    email: '',
    phone: '',
    address: '',
    city: 'San Luis Potosí',
    state: 'San Luis Potosí',
    postalCode: '',
    paymentMethod: 'mercadopago' as 'spei' | 'tarjeta' | 'credito-empresarial' | 'mercadopago',
    notes: ''
  });

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
  const [mpProcessing, setMpProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmedOrder(null);
      setIsSubmitting(false);
      setAppliedCoupon(null);
      setCouponCodeInput('');
      setCouponError(null);
    }
  }, [isOpen]);

  const handleFillDemoData = () => {
    setFormData((prev) => ({
      ...prev,
      customerName: prev.customerName || 'Ing. Roberto Mendoza',
      companyName: prev.companyName || 'Soluciones Industriales del Centro S.A. de C.V.',
      rfc: prev.rfc || 'SIC080412XYZ',
      email: prev.email || 'compras@solucionescentro.mx',
      phone: prev.phone || '444 812 3456',
      address: prev.address || 'Av. Venustiano Carranza #1450, Col. Tequisquiapan',
      city: prev.city || 'San Luis Potosí',
      state: prev.state || 'San Luis Potosí',
      postalCode: prev.postalCode || '78230',
      notes: prev.notes || 'Simulación de compra en línea — entrega en recepción.'
    }));
  };

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => {
    const price = item.acquisitionType === 'renta' && item.product.rentalPriceMonthly 
      ? item.product.rentalPriceMonthly 
      : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  // Discount Calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage' || appliedCoupon.discountType === 'porcentaje') {
      discountAmount = Math.round((rawSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, rawSubtotal);
    }
  }

  const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);
  const tax = discountedSubtotal * 0.16;

  // Shipping Rules
  const shippingRules = paymentConfig?.shippingConfig || {
    freeShippingThreshold: 5000,
    standardShippingCost: 450,
    localCityFreeShipping: true,
    estimatedDays: '24 a 48 horas hábiles'
  };

  const isLocalSLP = formData.city.toLowerCase().includes('san luis potos') || formData.city.toLowerCase().includes('slp');
  const isFreeByThreshold = rawSubtotal >= shippingRules.freeShippingThreshold;
  const shipping = (isLocalSLP && shippingRules.localCityFreeShipping) || isFreeByThreshold ? 0 : shippingRules.standardShippingCost;
  const total = discountedSubtotal + tax + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCodeInput.trim().toUpperCase();
    if (!code) return;

    const found = coupons.find(c => c.code.toUpperCase() === code && c.active);
    if (!found) {
      setCouponError('Cupón inválido o inactivo.');
      return;
    }
    if (found.minPurchase && rawSubtotal < found.minPurchase) {
      setCouponError(`Requiere una compra mínima de $${found.minPurchase.toLocaleString('es-MX')} MXN.`);
      return;
    }
    if (found.maxUses && found.usesCount >= found.maxUses) {
      setCouponError('Este cupón ha alcanzado el límite máximo de usos.');
      return;
    }

    setAppliedCoupon(found);
    setCouponError(null);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
  };

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
        cfdiUse: formData.cfdiUse,
        taxRegime: formData.taxRegime,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        paymentMethod: formData.paymentMethod,
        items: [...items],
        subtotal: discountedSubtotal,
        tax,
        shipping,
        total,
        discountCoupon: appliedCoupon?.code,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        invoiceStatus: 'pendiente',
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
    const cleanPhone = (whatsappPhone || '524448123000').replace(/\D/g, '') || '524448123000';
    const message = `Hola LUMESA Kyocera México, he generado el pedido ${order.orderId} a nombre de ${order.customerName} (${order.companyName}) por un total de $${order.total.toLocaleString('es-MX')} MXN. Solicito seguimiento de entrega y factura CFDI.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Centered Modal Window */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header - Sticky/Pinned */}
        <div className="shrink-0 bg-slate-900 text-white px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base md:text-lg font-bold truncate">
                {confirmedOrder ? 'Confirmación de Pedido (Simulación Exitosa)' : 'Simulador de Compra y Facturación (CFDI 4.0)'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Distribuidor Autorizado Kyocera • Simulación de Compra Segura
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 ml-2"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {confirmedOrder ? (
          /* Confirmation Screen */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
              <div className="text-center py-2 sm:py-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-inner">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  ¡Pedido Generado con Éxito!
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Folio: <span className="text-blue-600 font-mono">{confirmedOrder.orderId}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Fecha de registro: {confirmedOrder.date}
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-xs sm:text-sm space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-slate-200 pb-3">
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
                <div className="space-y-2 py-1">
                  <span className="text-slate-500 text-xs block font-bold">Resumen de Equipos y Consumibles:</span>
                  {confirmedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-slate-800 pr-2 truncate">
                        <strong>{it.quantity}x</strong> {it.product.name} ({it.acquisitionType === 'renta' ? 'Renta' : 'Venta'})
                      </span>
                      <span className="font-mono font-semibold text-slate-900 shrink-0">
                        ${((it.acquisitionType === 'renta' && it.product.rentalPriceMonthly ? it.product.rentalPriceMonthly : it.product.price) * it.quantity).toLocaleString('es-MX')} MXN
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm sm:text-base font-black">
                  <span className="text-slate-900">Total a Pagar (IVA incluido):</span>
                  <span className="text-blue-600 text-base sm:text-lg font-mono">
                    ${confirmedOrder.total.toLocaleString('es-MX')} MXN
                  </span>
                </div>
              </div>

              {/* Payment instructions based on method */}
              {confirmedOrder.paymentMethod === 'mercadopago' ? (
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-800 space-y-2">
                  <div className="font-bold text-sky-900 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <CreditCard className="w-4 h-4 text-[#009EE3]" />
                      <span>Transacción Mercado Pago Oficial México</span>
                    </span>
                    <span className="text-[10px] bg-[#009EE3] text-white px-2 py-0.5 rounded font-bold">
                      {paymentConfig?.mercadoPago?.sandboxMode ? 'Modo Pruebas / Sandbox' : 'Producción'}
                    </span>
                  </div>
                  <p className="text-slate-700">
                    Su orden ha sido registrada para procesamiento con la pasarela de Mercado Pago. Si requiere liga de pago directo o terminal virtual Point, nuestro asesor LUMESA se contactará de inmediato con su folio <strong className="font-mono text-sky-800">{confirmedOrder.orderId}</strong>.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Clave Pública configurada: <code className="font-mono bg-sky-100 px-1 py-0.5 rounded">{paymentConfig?.mercadoPago?.publicKey ? `${paymentConfig.mercadoPago.publicKey.substring(0, 15)}...` : 'TEST-PUBLIC-KEY-LUMESA'}</code>
                  </p>
                </div>
              ) : confirmedOrder.paymentMethod === 'spei' ? (
                <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-blue-900 flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Instrucciones de Pago (Transferencia Bancaria SPEI Directa):</span>
                  </div>
                  <p>
                    Banco: <strong>{paymentConfig?.bankTransfer?.bankName || 'BBVA México'}</strong> | Beneficiario: <strong>{paymentConfig?.bankTransfer?.accountHolder || 'LUMESA SOLUCIONES S.A. DE C.V.'}</strong>
                  </p>
                  <p>
                    CLABE Interbancaria: <strong className="font-mono text-slate-900">{paymentConfig?.bankTransfer?.clabe || '012 700 00123456789 4'}</strong> | Referencia: <strong className="font-mono text-blue-700">{confirmedOrder.orderId}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Al realizar su transferencia SPEI, envíe el comprobante al correo de facturación o directamente al WhatsApp corporativo para despacho prioritario desde San Luis Potosí.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-100 border border-neutral-300 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Receipt className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>Orden de Renta / Crédito Empresarial Registrada:</span>
                  </div>
                  <p>
                    Un ejecutivo de cuentas corporativas LUMESA validará su línea de crédito o contrato de arrendamiento en un plazo menor a 2 horas hábiles.
                  </p>
                </div>
              )}
            </div>

            {/* Actions Sticky Footer */}
            <div className="shrink-0 p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <a
                href={getWhatsAppLink(confirmedOrder)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 sm:py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <Send className="w-4 h-4" />
                <span>Notificar Pedido por WhatsApp</span>
              </a>

              <button
                onClick={handlePrint}
                className="py-2.5 sm:py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border border-slate-300 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Comprobante</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 sm:py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable Fields */}
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
              {/* Simulation Banner + Product Summary */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="text-xs text-amber-900">
                  <div className="font-bold flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Simulación de Compra en Línea (Sin cargo bancario real)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {items.length > 0
                      ? `${items.reduce((acc, it) => acc + it.quantity, 0)} equipo(s) en orden: ${items.map((it) => `${it.quantity}x ${it.product.name}`).join(', ')}`
                      : 'Agregue un equipo para simular su pedido.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoData}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold transition shrink-0"
                >
                  Rellenar datos de prueba
                </button>
              </div>

              {/* Step 1: Contact and Billing CFDI 4.0 */}
              <div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>1. Datos Fiscales y de Contacto (Facturación CFDI 4.0)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre Completo o Titular *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Ing. Roberto Mendoza"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Empresa o Razón Social
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Soluciones Industriales del Centro S.A. de C.V."
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      RFC Fiscal (SAT) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. SIC080412XYZ o XAXX010101000"
                      value={formData.rfc}
                      onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 uppercase font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Uso de CFDI (SAT)
                    </label>
                    <select
                      value={formData.cfdiUse}
                      onChange={(e) => setFormData({ ...formData, cfdiUse: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="G03 Gastos en general">G03 - Gastos en general</option>
                      <option value="G01 Adquisición de mercancías">G01 - Adquisición de mercancías</option>
                      <option value="I08 Otra maquinaria y equipo">I08 - Otra maquinaria y equipo</option>
                      <option value="P01 Por definir">P01 - Por definir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Régimen Fiscal (SAT)
                    </label>
                    <select
                      value={formData.taxRegime}
                      onChange={(e) => setFormData({ ...formData, taxRegime: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="601 General de Ley Personas Morales">601 - General de Ley Personas Morales</option>
                      <option value="612 Personas Físicas con Actividades Empresariales y Profesionales">612 - Personas Físicas con Act. Empresariales</option>
                      <option value="626 Régimen Simplificado de Confianza (RESICO)">626 - RESICO</option>
                      <option value="605 Sueldos y Salarios">605 - Sueldos y Salarios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Correo Electrónico (Recepción Factura) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="facturacion@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
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
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address & Dynamic Shipping */}
              <div className="border-t border-slate-100 pt-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center space-x-1.5">
                    <Truck className="w-4 h-4" />
                    <span>2. Dirección de Entrega e Instalación</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {shipping === 0 ? '✓ Envío Gratis' : `Envío: $${shipping.toLocaleString('es-MX')} MXN`}
                  </span>
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
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
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
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 bg-white"
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
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 bg-white"
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
                      className="w-full text-xs sm:text-sm px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 font-mono bg-white"
                    />
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Logística LUMESA: Entrega estimada en <strong>{shippingRules.estimatedDays}</strong>.</span>
                  {isLocalSLP && <span className="font-bold text-blue-700">✓ Zona Metropolitana SLP (Flete local incluido)</span>}
                </div>
              </div>

              {/* Step 3: Cupones de Descuento */}
              <div className="border-t border-slate-100 pt-3.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  ¿Tiene un cupón de descuento o convenio institucional?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ej. KYOCERA5 o LUMESABENVENIDO"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 uppercase font-mono bg-white focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
                  >
                    Aplicar Cupón
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <span>
                      ✓ Cupón <strong>{appliedCoupon.code}</strong> aplicado: Descuento de <strong>-${discountAmount.toLocaleString('es-MX')} MXN</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-800 font-bold ml-2 underline"
                    >
                      Remover
                    </button>
                  </div>
                )}

                {couponError && (
                  <div className="mt-2 text-xs text-red-600">
                    {couponError}
                  </div>
                )}
              </div>

              {/* Step 4: Métodos de Pago con Mercado Pago Oficial */}
              <div className="border-t border-slate-100 pt-3.5">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>4. Método de Pago Corporativo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {/* Mercado Pago */}
                  <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${formData.paymentMethod === 'mercadopago' ? 'border-[#009EE3] bg-sky-50/70 ring-2 ring-[#009EE3]' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="mercadopago"
                            checked={formData.paymentMethod === 'mercadopago'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'mercadopago' })}
                            className="text-[#009EE3]"
                          />
                          <span className="text-xs font-black text-slate-900">Mercado Pago</span>
                        </div>
                        <span className="text-[10px] bg-[#009EE3]/15 text-[#009EE3] font-bold px-1.5 py-0.5 rounded">
                          {paymentConfig?.mercadoPago?.sandboxMode ? 'Sandbox' : 'Oficial'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 mt-1.5 block leading-tight">
                        Tarjetas Visa / Mastercard / Amex, OXXO en efectivo y SPEI.
                      </span>
                    </div>
                    <div className="pt-2 text-[10px] text-slate-400 font-medium">
                      Cifrado SSL y protección al comprador
                    </div>
                  </label>

                  {/* SPEI Bancario */}
                  <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${formData.paymentMethod === 'spei' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="spei"
                          checked={formData.paymentMethod === 'spei'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'spei' })}
                          className="text-blue-600"
                        />
                        <span className="text-xs font-bold text-slate-900">Transferencia SPEI</span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1.5 block leading-tight">
                        {paymentConfig?.bankTransfer?.bankName || 'BBVA México'}. Sin comisiones.
                      </span>
                    </div>
                    <div className="pt-2 text-[10px] text-slate-400 font-medium font-mono">
                      CLABE oficial LUMESA
                    </div>
                  </label>

                  {/* Crédito Corporativo */}
                  <label className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${formData.paymentMethod === 'credito-empresarial' ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credito-empresarial"
                          checked={formData.paymentMethod === 'credito-empresarial'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'credito-empresarial' })}
                          className="text-blue-600"
                        />
                        <span className="text-xs font-bold text-slate-900">Orden de Renta / Crédito</span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1.5 block leading-tight">
                        Para contratos de arrendamiento mensual o crédito 30 días.
                      </span>
                    </div>
                    <div className="pt-2 text-[10px] text-slate-400 font-medium">
                      Sujeto a validación de contrato
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instrucciones especiales para entrega o almacén:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Entregar en piso 3 área de sistemas, horario de 9am a 2pm..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="shrink-0 border-t border-slate-200 p-3.5 sm:p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span>Subtotal: ${rawSubtotal.toLocaleString('es-MX')}</span>
                  {discountAmount > 0 && <span className="text-emerald-600 font-bold">Desc: -${discountAmount.toLocaleString('es-MX')}</span>}
                  <span>IVA 16%: ${tax.toLocaleString('es-MX')}</span>
                  <span>Envío: {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-MX')}`}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  ${total.toLocaleString('es-MX')} <span className="text-xs font-sans text-slate-500">MXN Total Neto</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition text-center"
                >
                  Volver al Carrito
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-5 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-black hover:bg-neutral-900 active:bg-neutral-950 text-white text-xs sm:text-sm font-bold tracking-wide border border-neutral-700 hover:border-blue-500 shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span>
                    {isSubmitting 
                      ? 'Procesando Orden...' 
                      : formData.paymentMethod === 'mercadopago'
                        ? 'Confirmar y Pagar con Mercado Pago'
                        : 'Confirmar y Generar Pedido'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
