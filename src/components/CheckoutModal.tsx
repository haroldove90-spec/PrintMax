import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  User,
  Mail,
  MessageCircle,
  MapPin,
  FileText,
  ShoppingCart,
  CreditCard,
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  Trash2,
  Plus,
  Minus,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CartItem, OrderDetails, PaymentConfig, DiscountCoupon } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToCart?: () => void;
  items: CartItem[];
  onUpdateQuantity?: (productId: string, quantity: number, acquisitionType: 'compra' | 'renta') => void;
  onRemoveItem?: (productId: string, acquisitionType: 'compra' | 'renta') => void;
  onClearCart: () => void;
  onOrderCreated?: (order: OrderDetails) => void;
  paymentConfig?: PaymentConfig;
  coupons?: DiscountCoupon[];
  whatsappPhone?: string;
}

type CheckoutStage = 'datos' | 'resumen' | 'pago' | 'confirmacion';
type PaymentMethodKey = 'tarjeta' | 'paypal' | 'mercadopago' | 'spei';

const TAX_REGIMES = [
  '601 - General de Ley Personas Morales',
  '603 - Personas Morales con Fines no Lucrativos',
  '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios',
  '612 - Personas Físicas con Actividades Empresariales y Profesionales',
  '621 - Incorporación Fiscal',
  '626 - Régimen Simplificado de Confianza (RESICO)'
];

const CFDI_USES = [
  'G01 - Adquisición de mercancías',
  'G03 - Gastos en general',
  'I04 - Equipo de cómputo y accesorios',
  'I08 - Otra maquinaria y equipo',
  'S01 - Sin efectos fiscales'
];

function formatCurrencyMXN(amount: number): string {
  return `$${amount.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onBackToCart,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated
}) => {
  const [stage, setStage] = useState<CheckoutStage>('datos');

  // Collapsible sections inside Stage 1 ("Datos del pedido - una sola pantalla")
  const [openSections, setOpenSections] = useState({
    contacto: true,
    direccion: true,
    facturacion: true
  });

  // 05.4.1 Datos de contacto
  const [contactData, setContactData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  // 05.4.2 Dirección de entrega
  const [shippingData, setShippingData] = useState({
    street: '',
    extNumber: '',
    intNumber: '',
    neighborhood: '',
    postalCode: '',
    city: 'San Luis Potosí',
    state: 'San Luis Potosí',
    references: ''
  });

  // 05.4.3 Facturación opcional
  const [needsInvoice, setNeedsInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    rfc: '',
    razonSocial: '',
    taxRegime: '',
    cfdiUse: '',
    billingName: '',
    billingPhone: '',
    billingEmail: ''
  });

  // 05.4.5 Método de pago (referencial / simulación)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('tarjeta');
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStage('datos');
      setOpenSections({ contacto: true, direccion: true, facturacion: true });
      setErrors({});
      setIsSubmitting(false);
      setConfirmedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalUnits = items.reduce((acc, it) => acc + it.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const unitPrice =
      item.acquisitionType === 'renta' && item.product.rentalPriceMonthly
        ? item.product.rentalPriceMonthly
        : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const tax = subtotal * 0.16;
  const shippingCost = 0; // Pendiente de definir por el cliente
  const total = subtotal + tax + shippingCost;

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCopyContactToBilling = () => {
    setInvoiceData((prev) => ({
      ...prev,
      billingName: contactData.fullName || prev.billingName,
      billingPhone: contactData.phone || prev.billingPhone,
      billingEmail: contactData.email || prev.billingEmail
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.billingName;
      delete next.billingPhone;
      delete next.billingEmail;
      return next;
    });
  };

  const handleFillDemoData = () => {
    setContactData({
      fullName: 'Mariana López García',
      email: 'mariana@empresa.com',
      phone: '444 123 4567'
    });
    setShippingData({
      street: 'Av. Venustiano Carranza',
      extNumber: '1450',
      intNumber: '3B',
      neighborhood: 'Tequisquiapan',
      postalCode: '78230',
      city: 'San Luis Potosí',
      state: 'San Luis Potosí',
      references: 'Edificio corporativo, recepción piso 1'
    });
    if (needsInvoice) {
      setInvoiceData({
        rfc: 'SIC080412XYZ',
        razonSocial: 'Soluciones Industriales del Centro S.A. de C.V.',
        taxRegime: TAX_REGIMES[0],
        cfdiUse: CFDI_USES[1],
        billingName: 'Ana García',
        billingPhone: '444 123 4567',
        billingEmail: 'facturacion@empresa.com'
      });
    }
    setErrors({});
  };

  const handleFillDemoCard = () => {
    setCardData({
      number: '4152 3138 9012 3456',
      holder: contactData.fullName || 'Mariana López García',
      expiry: '08 / 29',
      cvv: '123'
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.cardNumber;
      delete next.cardHolder;
      delete next.cardExpiry;
      delete next.cardCvv;
      return next;
    });
  };

  const validateDatosStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Datos de contacto
    if (!contactData.fullName.trim()) {
      newErrors.fullName = 'Este campo es obligatorio.';
    }
    if (!contactData.email.trim()) {
      newErrors.email = 'Este campo es obligatorio.';
    } else if (!emailRegex.test(contactData.email.trim())) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }
    if (!contactData.phone.trim()) {
      newErrors.phone = 'Este campo es obligatorio.';
    }

    // 2. Dirección de entrega
    if (!shippingData.street.trim()) {
      newErrors.street = 'Este campo es obligatorio.';
    }
    if (!shippingData.extNumber.trim()) {
      newErrors.extNumber = 'Este campo es obligatorio.';
    }
    if (!shippingData.neighborhood.trim()) {
      newErrors.neighborhood = 'Este campo es obligatorio.';
    }
    if (!shippingData.postalCode.trim()) {
      newErrors.postalCode = 'Este campo es obligatorio.';
    }
    if (!shippingData.city.trim()) {
      newErrors.city = 'Este campo es obligatorio.';
    }
    if (!shippingData.state.trim()) {
      newErrors.state = 'Este campo es obligatorio.';
    }

    // 3. Facturación (solo si requiere factura)
    if (needsInvoice) {
      if (!invoiceData.rfc.trim()) {
        newErrors.rfc = 'Este campo es obligatorio.';
      }
      if (!invoiceData.razonSocial.trim()) {
        newErrors.razonSocial = 'Este campo es obligatorio.';
      }
      if (!invoiceData.taxRegime.trim()) {
        newErrors.taxRegime = 'Este campo es obligatorio.';
      }
      if (!invoiceData.cfdiUse.trim()) {
        newErrors.cfdiUse = 'Este campo es obligatorio.';
      }
      if (!invoiceData.billingName.trim()) {
        newErrors.billingName = 'Este campo es obligatorio.';
      }
      if (!invoiceData.billingPhone.trim()) {
        newErrors.billingPhone = 'Este campo es obligatorio.';
      }
      if (!invoiceData.billingEmail.trim()) {
        newErrors.billingEmail = 'Este campo es obligatorio.';
      } else if (!emailRegex.test(invoiceData.billingEmail.trim())) {
        newErrors.billingEmail = 'Ingresa un correo electrónico válido.';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setOpenSections({
        contacto:
          openSections.contacto ||
          Boolean(newErrors.fullName || newErrors.email || newErrors.phone),
        direccion:
          openSections.direccion ||
          Boolean(
            newErrors.street ||
              newErrors.extNumber ||
              newErrors.neighborhood ||
              newErrors.postalCode ||
              newErrors.city ||
              newErrors.state
          ),
        facturacion:
          openSections.facturacion ||
          Boolean(
            newErrors.rfc ||
              newErrors.razonSocial ||
              newErrors.taxRegime ||
              newErrors.cfdiUse ||
              newErrors.billingName ||
              newErrors.billingPhone ||
              newErrors.billingEmail
          )
      });
      return false;
    }

    return true;
  };

  const validatePaymentStep = (): boolean => {
    if (paymentMethod !== 'tarjeta') {
      setErrors({});
      return true;
    }
    const newErrors: Record<string, string> = {};
    if (!cardData.number.trim() || cardData.number.replace(/\D/g, '').length < 12) {
      newErrors.cardNumber = 'Ingresa un número de tarjeta referencial válido.';
    }
    if (!cardData.holder.trim()) {
      newErrors.cardHolder = 'Este campo es obligatorio.';
    }
    if (!cardData.expiry.trim()) {
      newErrors.cardExpiry = 'Este campo es obligatorio.';
    }
    if (!cardData.cvv.trim() || cardData.cvv.replace(/\D/g, '').length < 3) {
      newErrors.cardCvv = 'Este campo es obligatorio.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueFromDatos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDatosStep()) return;
    setStage('resumen');
  };

  const handleConfirmOrder = () => {
    if (items.length === 0) return;
    if (!validatePaymentStep()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `#LM-${Math.floor(10000 + Math.random() * 90000)}`;
      const fullAddress = [
        `${shippingData.street.trim()} #${shippingData.extNumber.trim()}`,
        shippingData.intNumber.trim() ? `Int. ${shippingData.intNumber.trim()}` : '',
        `Col. ${shippingData.neighborhood.trim()}`
      ]
        .filter(Boolean)
        .join(', ');

      const billingSummary = needsInvoice
        ? `Contacto facturación: ${invoiceData.billingName} | Tel: ${invoiceData.billingPhone} | Correo CFDI: ${invoiceData.billingEmail}`
        : 'Sin factura requerida';

      const combinedNotes = [
        shippingData.references.trim() ? `Referencias: ${shippingData.references.trim()}` : '',
        billingSummary
      ]
        .filter(Boolean)
        .join(' · ');

      const order: OrderDetails = {
        orderId: orderNumber,
        customerName: contactData.fullName.trim(),
        companyName: needsInvoice ? invoiceData.razonSocial.trim() : contactData.fullName.trim(),
        rfc: needsInvoice ? invoiceData.rfc.trim().toUpperCase() : '',
        cfdiUse: needsInvoice ? invoiceData.cfdiUse : undefined,
        taxRegime: needsInvoice ? invoiceData.taxRegime : undefined,
        email: contactData.email.trim(),
        phone: contactData.phone.trim(),
        address: fullAddress,
        city: shippingData.city.trim(),
        state: shippingData.state.trim(),
        postalCode: shippingData.postalCode.trim(),
        paymentMethod,
        items: [...items],
        subtotal,
        tax,
        shipping: shippingCost,
        total,
        invoiceStatus: needsInvoice ? 'pendiente' : 'no_requerida',
        date: new Date().toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        // Importante: nunca marcar como pagado hasta confirmación real de la pasarela
        status: 'pendiente',
        notes: combinedNotes
      };

      setConfirmedOrder(order);
      setIsSubmitting(false);
      setStage('confirmacion');
      onClearCart();
      if (onOrderCreated) {
        onOrderCreated(order);
      }
    }, 800);
  };

  const handleBackToCartClick = () => {
    if (onBackToCart) {
      onBackToCart();
    } else {
      onClose();
    }
  };

  const formatCardNumberInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
    }
    return digits;
  };

  const renderFieldError = (fieldKey: string) => {
    if (!errors[fieldKey]) return null;
    return (
      <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{errors[fieldKey]}</span>
      </p>
    );
  };

  const renderOrderSummaryCard = (cta?: React.ReactNode, orderSource?: OrderDetails) => {
    const summarySubtotal = orderSource ? orderSource.subtotal : subtotal;
    const summaryTax = orderSource ? orderSource.tax : tax;
    const summaryShipping = orderSource ? orderSource.shipping : shippingCost;
    const summaryTotal = orderSource ? orderSource.total : total;
    const summaryUnits = orderSource
      ? orderSource.items.reduce((acc, it) => acc + it.quantity, 0)
      : totalUnits;

    return (
      <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <h4 className="text-sm sm:text-base font-extrabold text-[#102540]">
          {orderSource ? 'Resumen de compra' : 'Resumen del pedido'}
        </h4>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
          <div className="flex items-center justify-between gap-2">
            <span>
              Subtotal ({summaryUnits} {summaryUnits === 1 ? 'producto' : 'productos'})
            </span>
            <span className="font-semibold text-[#102540] tabular-nums">
              {formatCurrencyMXN(summarySubtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span>IVA (16%)</span>
            <span className="font-semibold text-[#102540] tabular-nums">
              {formatCurrencyMXN(summaryTax)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1">
              <span>Costo de envío</span>
              <span
                title="Costo y cobertura de envío pendientes de definir según destino"
                className="text-slate-400 cursor-help"
              >
                <Info className="w-3.5 h-3.5" />
              </span>
            </span>
            <span className="font-semibold text-[#102540] tabular-nums">
              {formatCurrencyMXN(summaryShipping)}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3.5">
          <div className="text-xs font-bold text-[#102540]">
            {orderSource ? 'Total de la compra' : 'Total a pagar'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F27C36] tracking-tight tabular-nums mt-0.5">
            {formatCurrencyMXN(summaryTotal)}
          </div>
        </div>

        {cta && <div className="pt-1">{cta}</div>}
      </div>
    );
  };

  const renderProgressStepper = () => {
    const steps = [
      { key: 'carrito', label: 'Carrito', done: true, active: false },
      {
        key: 'contacto',
        label: 'Datos de contacto',
        done: stage !== 'datos',
        active: stage === 'datos'
      },
      {
        key: 'facturacion',
        label: 'Facturación',
        done: stage !== 'datos',
        active: false
      },
      {
        key: 'resumen',
        label: 'Resumen',
        done: stage === 'pago',
        active: stage === 'resumen',
        num: 4
      },
      {
        key: 'pago',
        label: 'Pago',
        done: false,
        active: stage === 'pago',
        num: 5
      }
    ];

    return (
      <div className="hidden sm:flex items-center justify-center gap-2 pb-4 mb-5 border-b border-slate-200 text-xs overflow-x-auto">
        {steps.map((s, idx) => (
          <React.Fragment key={s.key}>
            <div className="flex items-center gap-1.5 shrink-0">
              {s.done ? (
                <span className="w-5 h-5 rounded-full bg-[#102540] text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
              ) : s.active ? (
                <span className="w-5 h-5 rounded-full bg-[#F27C36] text-white font-extrabold text-[11px] flex items-center justify-center tabular-nums">
                  {s.num || idx + 1}
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 font-bold text-[11px] flex items-center justify-center tabular-nums">
                  {s.num || idx + 1}
                </span>
              )}
              <span
                className={
                  s.active
                    ? 'font-bold text-[#F27C36]'
                    : s.done
                      ? 'font-semibold text-[#102540]'
                      : 'text-slate-400 font-medium'
                }
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <span aria-hidden="true" className="w-6 h-px bg-slate-300 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
      role="dialog"
      aria-modal="true"
      aria-label="Proceso de compra"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
      />

      {/* Centered Modal Container */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[94vh] sm:max-h-[92vh] overflow-hidden border border-slate-200 z-10">
        {/* Top Navy Modal Header */}
        <div className="shrink-0 bg-[#102540] text-white px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-[#1E3A5F]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F27C36] flex items-center justify-center text-white shrink-0">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold truncate">
                {stage === 'datos' && 'Datos del pedido'}
                {stage === 'resumen' && '4. Resumen de compra'}
                {stage === 'pago' && '5. Método de pago'}
                {stage === 'confirmacion' && 'Confirmación de compra'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                {stage === 'datos' && 'Completa tus datos de contacto, dirección y facturación.'}
                {stage === 'resumen' && 'Revisa tu pedido y procede al pago.'}
                {stage === 'pago' && 'Selecciona tu método de pago y completa la información.'}
                {stage === 'confirmacion' && 'Hemos recibido tu pedido correctamente.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0 ml-2 cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* STAGE 1: DATOS DEL PEDIDO (05.4.1, 05.4.2, 05.4.3 EN 1 PANTALLA) */}
        {/* ============================================================ */}
        {stage === 'datos' && (
          <form
            onSubmit={handleContinueFromDatos}
            noValidate
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 space-y-4">
              {/* Quick Demo Autofill Notice */}
              <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Simulación de compra activa ({totalUnits}{' '}
                    {totalUnits === 1 ? 'equipo' : 'equipos'} en tu carrito).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoData}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer"
                >
                  Rellenar datos de prueba
                </button>
              </div>

              {/* 1. DATOS DE CONTACTO (05.4.1) */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, contacto: !prev.contacto }))
                  }
                  className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between bg-[#F8FAFC] hover:bg-slate-100/80 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#102540] shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#102540]">
                        1. Datos de contacto
                      </h4>
                      <p className="text-xs text-slate-500">
                        Ingresa la información principal para tu pedido.
                      </p>
                    </div>
                  </div>
                  {openSections.contacto ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {openSections.contacto && (
                  <div className="p-4 sm:p-5 space-y-4 border-t border-slate-100">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                        Nombre completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Mariana López García"
                        value={contactData.fullName}
                        onChange={(e) => {
                          setContactData({ ...contactData, fullName: e.target.value });
                          clearFieldError('fullName');
                        }}
                        className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                          errors.fullName
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-slate-300 focus:border-[#102540]'
                        }`}
                      />
                      {renderFieldError('fullName')}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                          Correo electrónico <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            placeholder="Ej. mariana@empresa.com"
                            value={contactData.email}
                            onChange={(e) => {
                              setContactData({ ...contactData, email: e.target.value });
                              clearFieldError('email');
                            }}
                            className={`w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                              errors.email
                                ? 'border-red-500 focus:border-red-600'
                                : 'border-slate-300 focus:border-[#102540]'
                            }`}
                          />
                        </div>
                        {renderFieldError('email')}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                          Teléfono / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="tel"
                            placeholder="Ej. 444 123 4567"
                            value={contactData.phone}
                            onChange={(e) => {
                              setContactData({ ...contactData, phone: e.target.value });
                              clearFieldError('phone');
                            }}
                            className={`w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                              errors.phone
                                ? 'border-red-500 focus:border-red-600'
                                : 'border-slate-300 focus:border-[#102540]'
                            }`}
                          />
                        </div>
                        {renderFieldError('phone')}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#EEF5FF] border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-[#1D63D6] shrink-0 mt-0.5" />
                      <span>
                        Más adelante podrás agregar tus datos de facturación si requieres CFDI.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. DIRECCIÓN DE ENTREGA (05.4.2) */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, direccion: !prev.direccion }))
                  }
                  className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between bg-[#F8FAFC] hover:bg-slate-100/80 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#102540] shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#102540]">
                        2. Dirección de entrega
                      </h4>
                      <p className="text-xs text-slate-500">
                        Indica la dirección donde deseas recibir tu pedido.
                      </p>
                    </div>
                  </div>
                  {openSections.direccion ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {openSections.direccion && (
                  <div className="p-4 sm:p-5 space-y-4 border-t border-slate-100">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                        Calle <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Av. Venustiano Carranza"
                        value={shippingData.street}
                        onChange={(e) => {
                          setShippingData({ ...shippingData, street: e.target.value });
                          clearFieldError('street');
                        }}
                        className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                          errors.street
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-slate-300 focus:border-[#102540]'
                        }`}
                      />
                      {renderFieldError('street')}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                          Número exterior <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. 1450"
                          value={shippingData.extNumber}
                          onChange={(e) => {
                            setShippingData({ ...shippingData, extNumber: e.target.value });
                            clearFieldError('extNumber');
                          }}
                          className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                            errors.extNumber
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-slate-300 focus:border-[#102540]'
                          }`}
                        />
                        {renderFieldError('extNumber')}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                          Número interior
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. 3B (opcional)"
                          value={shippingData.intNumber}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, intNumber: e.target.value })
                          }
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#102540] transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                          Colonia <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Tequisquiapan"
                          value={shippingData.neighborhood}
                          onChange={(e) => {
                            setShippingData({ ...shippingData, neighborhood: e.target.value });
                            clearFieldError('neighborhood');
                          }}
                          className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                            errors.neighborhood
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-slate-300 focus:border-[#102540]'
                          }`}
                        />
                        {renderFieldError('neighborhood')}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                          Código postal <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. 78230"
                          value={shippingData.postalCode}
                          onChange={(e) => {
                            setShippingData({ ...shippingData, postalCode: e.target.value });
                            clearFieldError('postalCode');
                          }}
                          className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white font-mono focus:outline-none transition ${
                            errors.postalCode
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-slate-300 focus:border-[#102540]'
                          }`}
                        />
                        {renderFieldError('postalCode')}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                          Ciudad / Municipio <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. San Luis Potosí"
                          value={shippingData.city}
                          onChange={(e) => {
                            setShippingData({ ...shippingData, city: e.target.value });
                            clearFieldError('city');
                          }}
                          className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                            errors.city
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-slate-300 focus:border-[#102540]'
                          }`}
                        />
                        {renderFieldError('city')}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                          Estado <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. San Luis Potosí"
                          value={shippingData.state}
                          onChange={(e) => {
                            setShippingData({ ...shippingData, state: e.target.value });
                            clearFieldError('state');
                          }}
                          className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                            errors.state
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-slate-300 focus:border-[#102540]'
                          }`}
                        />
                        {renderFieldError('state')}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                        Referencias de entrega (opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Entre calles, horario o indicaciones para recepción"
                        value={shippingData.references}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, references: e.target.value })
                        }
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#102540] transition"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. FACTURACIÓN OPCIONAL (05.4.3) */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, facturacion: !prev.facturacion }))
                  }
                  className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between bg-[#F8FAFC] hover:bg-slate-100/80 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#102540] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#102540]">
                        3. Facturación
                      </h4>
                      <p className="text-xs text-slate-500">
                        Ingresa tus datos fiscales si necesitas factura.
                      </p>
                    </div>
                  </div>
                  {openSections.facturacion ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {openSections.facturacion && (
                  <div className="p-4 sm:p-5 space-y-5 border-t border-slate-100">
                    {/* Inline Radio Selector: ¿Necesitas factura? */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#F4F6FA] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold text-[#102540]">
                          ¿Necesitas factura?
                        </div>
                        <div className="text-xs text-slate-500">Selecciona una opción.</div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setNeedsInvoice(true)}
                          className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 transition cursor-pointer ${
                            needsInvoice
                              ? 'bg-[#FFF7F2] border-[#F27C36] text-[#102540] ring-1 ring-[#F27C36]'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              needsInvoice ? 'border-[#F27C36]' : 'border-slate-400'
                            }`}
                          >
                            {needsInvoice && (
                              <span className="w-2 h-2 rounded-full bg-[#F27C36]" />
                            )}
                          </span>
                          <span>Sí, requiero factura</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setNeedsInvoice(false);
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.rfc;
                              delete next.razonSocial;
                              delete next.taxRegime;
                              delete next.cfdiUse;
                              delete next.billingName;
                              delete next.billingPhone;
                              delete next.billingEmail;
                              return next;
                            });
                          }}
                          className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 transition cursor-pointer ${
                            !needsInvoice
                              ? 'bg-[#FFF7F2] border-[#F27C36] text-[#102540] ring-1 ring-[#F27C36]'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              !needsInvoice ? 'border-[#F27C36]' : 'border-slate-400'
                            }`}
                          >
                            {!needsInvoice && (
                              <span className="w-2 h-2 rounded-full bg-[#F27C36]" />
                            )}
                          </span>
                          <span>No, no requiero factura</span>
                        </button>
                      </div>
                    </div>

                    {/* Conditional Fiscal & Billing Contact Fields */}
                    {needsInvoice && (
                      <div className="space-y-5 pt-1">
                        {/* Datos fiscales */}
                        <div className="space-y-3.5">
                          <h5 className="text-sm font-extrabold text-[#102540]">Datos fiscales</h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                                RFC <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Ej. XAXX010101000"
                                value={invoiceData.rfc}
                                onChange={(e) => {
                                  setInvoiceData({
                                    ...invoiceData,
                                    rfc: e.target.value.toUpperCase()
                                  });
                                  clearFieldError('rfc');
                                }}
                                className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white uppercase font-mono focus:outline-none transition ${
                                  errors.rfc
                                    ? 'border-red-500 focus:border-red-600'
                                    : 'border-slate-300 focus:border-[#102540]'
                                }`}
                              />
                              {renderFieldError('rfc')}
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                                Razón social <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Ej. Empresa S.A. de C.V."
                                value={invoiceData.razonSocial}
                                onChange={(e) => {
                                  setInvoiceData({
                                    ...invoiceData,
                                    razonSocial: e.target.value
                                  });
                                  clearFieldError('razonSocial');
                                }}
                                className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                                  errors.razonSocial
                                    ? 'border-red-500 focus:border-red-600'
                                    : 'border-slate-300 focus:border-[#102540]'
                                }`}
                              />
                              {renderFieldError('razonSocial')}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                              Régimen fiscal <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={invoiceData.taxRegime}
                              onChange={(e) => {
                                setInvoiceData({ ...invoiceData, taxRegime: e.target.value });
                                clearFieldError('taxRegime');
                              }}
                              className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                                errors.taxRegime
                                  ? 'border-red-500 focus:border-red-600'
                                  : 'border-slate-300 focus:border-[#102540]'
                              }`}
                            >
                              <option value="">Selecciona una opción</option>
                              {TAX_REGIMES.map((regime) => (
                                <option key={regime} value={regime}>
                                  {regime}
                                </option>
                              ))}
                            </select>
                            {renderFieldError('taxRegime')}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                              Uso de CFDI <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={invoiceData.cfdiUse}
                              onChange={(e) => {
                                setInvoiceData({ ...invoiceData, cfdiUse: e.target.value });
                                clearFieldError('cfdiUse');
                              }}
                              className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                                errors.cfdiUse
                                  ? 'border-red-500 focus:border-red-600'
                                  : 'border-slate-300 focus:border-[#102540]'
                              }`}
                            >
                              <option value="">Selecciona una opción</option>
                              {CFDI_USES.map((use) => (
                                <option key={use} value={use}>
                                  {use}
                                </option>
                              ))}
                            </select>
                            {renderFieldError('cfdiUse')}
                          </div>
                        </div>

                        {/* Contacto para temas de facturación */}
                        <div className="border-t border-slate-200 pt-4 space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div>
                              <h5 className="text-sm font-extrabold text-[#102540]">
                                Contacto para temas de facturación
                              </h5>
                              <p className="text-xs text-slate-500">
                                Persona con quien podemos coordinar dudas y envío de la factura.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyContactToBilling}
                              className="text-xs font-bold text-[#1D63D6] hover:underline self-start sm:self-center cursor-pointer"
                            >
                              Usar mismos datos de contacto
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                                Nombre completo <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Ej. Ana García"
                                value={invoiceData.billingName}
                                onChange={(e) => {
                                  setInvoiceData({
                                    ...invoiceData,
                                    billingName: e.target.value
                                  });
                                  clearFieldError('billingName');
                                }}
                                className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                                  errors.billingName
                                    ? 'border-red-500 focus:border-red-600'
                                    : 'border-slate-300 focus:border-[#102540]'
                                }`}
                              />
                              {renderFieldError('billingName')}
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                                Teléfono / WhatsApp <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="tel"
                                  placeholder="Ej. 444 123 4567"
                                  value={invoiceData.billingPhone}
                                  onChange={(e) => {
                                    setInvoiceData({
                                      ...invoiceData,
                                      billingPhone: e.target.value
                                    });
                                    clearFieldError('billingPhone');
                                  }}
                                  className={`w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                                    errors.billingPhone
                                      ? 'border-red-500 focus:border-red-600'
                                      : 'border-slate-300 focus:border-[#102540]'
                                  }`}
                                />
                              </div>
                              {renderFieldError('billingPhone')}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-[#102540] mb-1">
                              Correo electrónico para recibir la factura{' '}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="email"
                                placeholder="Ej. facturacion@empresa.com"
                                value={invoiceData.billingEmail}
                                onChange={(e) => {
                                  setInvoiceData({
                                    ...invoiceData,
                                    billingEmail: e.target.value
                                  });
                                  clearFieldError('billingEmail');
                                }}
                                className={`w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                                  errors.billingEmail
                                    ? 'border-red-500 focus:border-red-600'
                                    : 'border-slate-300 focus:border-[#102540]'
                                }`}
                              />
                            </div>
                            {renderFieldError('billingEmail')}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#EEF5FF] border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-[#1D63D6] shrink-0 mt-0.5" />
                          <span>
                            La factura se enviará en formato CFDI al correo indicado, una vez
                            confirmado tu pago.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Bottom Footer for Stage 1 */}
            <div className="shrink-0 px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBackToCartClick}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al carrito</span>
              </button>

              <button
                type="submit"
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white text-xs sm:text-sm font-extrabold transition inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* STAGE 2: 4. RESUMEN DE COMPRA (05.4.4) */}
        {/* ============================================================ */}
        {stage === 'resumen' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6">
              {renderProgressStepper()}

              {items.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <p className="text-sm font-bold text-[#102540]">
                    No hay productos en tu pedido.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-[#102540] text-white text-xs font-bold cursor-pointer"
                  >
                    Explorar equipos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left: Productos en tu pedido */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
                    <h4 className="text-sm sm:text-base font-extrabold text-[#102540]">
                      Productos en tu pedido
                    </h4>

                    <div className="divide-y divide-slate-100">
                      {items.map((item) => {
                        const unitPrice =
                          item.acquisitionType === 'renta' && item.product.rentalPriceMonthly
                            ? item.product.rentalPriceMonthly
                            : item.product.price;
                        const lineTotal = unitPrice * item.quantity;

                        return (
                          <div
                            key={`${item.product.id}-${item.acquisitionType}`}
                            className="py-4 first:pt-1 last:pb-1 flex items-start gap-3.5"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1.5 shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h5 className="text-sm font-extrabold text-[#102540] truncate">
                                    {item.product.name}
                                  </h5>
                                  <p className="text-xs text-slate-500 truncate">
                                    {item.product.categoryLabel}
                                  </p>
                                </div>

                                {onRemoveItem && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onRemoveItem(item.product.id, item.acquisitionType)
                                    }
                                    className="p-1 text-slate-400 hover:text-red-500 transition cursor-pointer shrink-0"
                                    aria-label={`Eliminar ${item.product.name}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                {/* Quantity Stepper */}
                                <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                                  <button
                                    type="button"
                                    disabled={!onUpdateQuantity || item.quantity <= 1}
                                    onClick={() =>
                                      onUpdateQuantity &&
                                      onUpdateQuantity(
                                        item.product.id,
                                        Math.max(1, item.quantity - 1),
                                        item.acquisitionType
                                      )
                                    }
                                    className="p-1 rounded bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition cursor-pointer"
                                    aria-label="Disminuir cantidad"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-bold px-2 text-[#102540] tabular-nums">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={!onUpdateQuantity}
                                    onClick={() =>
                                      onUpdateQuantity &&
                                      onUpdateQuantity(
                                        item.product.id,
                                        item.quantity + 1,
                                        item.acquisitionType
                                      )
                                    }
                                    className="p-1 rounded bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition cursor-pointer"
                                    aria-label="Aumentar cantidad"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="flex items-center gap-4 text-right">
                                  <div>
                                    <span className="block text-[10px] text-slate-400">
                                      Precio unitario
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700 tabular-nums">
                                      {formatCurrencyMXN(unitPrice)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="block text-[10px] text-slate-400">
                                      Importe
                                    </span>
                                    <span className="text-sm font-extrabold text-[#102540] tabular-nums">
                                      {formatCurrencyMXN(lineTotal)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 rounded-xl bg-[#EEF5FF] border border-blue-100 text-xs text-slate-700 flex items-start gap-2">
                      <Info className="w-4 h-4 text-[#1D63D6] shrink-0 mt-0.5" />
                      <span>
                        Precios en MXN. Los impuestos se calculan en el resumen del pedido.
                      </span>
                    </div>
                  </div>

                  {/* Right: Resumen del pedido */}
                  <div className="lg:col-span-5">
                    {renderOrderSummaryCard(
                      <button
                        type="button"
                        onClick={() => {
                          setErrors({});
                          setStage('pago');
                        }}
                        className="w-full py-3 px-5 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white text-sm font-extrabold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <span>Continuar al pago</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="shrink-0 px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToCartClick}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al carrito</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage('datos')}
                  className="px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-[#102540] hover:bg-slate-200/60 text-xs sm:text-sm font-semibold transition cursor-pointer"
                >
                  Editar datos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 3: 5. MÉTODO DE PAGO (05.4.5) */}
        {/* ============================================================ */}
        {stage === 'pago' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6">
              {renderProgressStepper()}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: Métodos de pago + Detalles de tarjeta */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#102540]">
                    Selecciona un método de pago
                  </h4>

                  <div className="space-y-2.5">
                    {/* Tarjeta de crédito o débito */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('tarjeta');
                        setErrors({});
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                        paymentMethod === 'tarjeta'
                          ? 'bg-[#FFF7F2] border-[#F27C36] ring-1 ring-[#F27C36]'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            paymentMethod === 'tarjeta' ? 'border-[#F27C36]' : 'border-slate-400'
                          }`}
                        >
                          {paymentMethod === 'tarjeta' && (
                            <span className="w-2 h-2 rounded-full bg-[#F27C36]" />
                          )}
                        </span>
                        <CreditCard className="w-5 h-5 text-[#102540] shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-[#102540]">
                          Tarjeta de crédito o débito
                        </span>
                      </div>
                      <span className="text-[11px] font-black tracking-tight text-[#1A1F71] shrink-0">
                        VISA / MC
                      </span>
                    </button>

                    {/* PayPal */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('paypal');
                        setErrors({});
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                        paymentMethod === 'paypal'
                          ? 'bg-[#FFF7F2] border-[#F27C36] ring-1 ring-[#F27C36]'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            paymentMethod === 'paypal' ? 'border-[#F27C36]' : 'border-slate-400'
                          }`}
                        >
                          {paymentMethod === 'paypal' && (
                            <span className="w-2 h-2 rounded-full bg-[#F27C36]" />
                          )}
                        </span>
                        <span className="w-5 h-5 rounded bg-[#003087] text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          P
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#102540]">
                          PayPal
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-[#003087] shrink-0">
                        PayPal
                      </span>
                    </button>

                    {/* Mercado Pago */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('mercadopago');
                        setErrors({});
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                        paymentMethod === 'mercadopago'
                          ? 'bg-[#FFF7F2] border-[#F27C36] ring-1 ring-[#F27C36]'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            paymentMethod === 'mercadopago'
                              ? 'border-[#F27C36]'
                              : 'border-slate-400'
                          }`}
                        >
                          {paymentMethod === 'mercadopago' && (
                            <span className="w-2 h-2 rounded-full bg-[#F27C36]" />
                          )}
                        </span>
                        <span className="w-5 h-5 rounded-full bg-[#009EE3] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                          MP
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#102540]">
                          Mercado Pago
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-[#009EE3] shrink-0">
                        mercado pago
                      </span>
                    </button>

                    {/* Transferencia bancaria */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('spei');
                        setErrors({});
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                        paymentMethod === 'spei'
                          ? 'bg-[#FFF7F2] border-[#F27C36] ring-1 ring-[#F27C36]'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            paymentMethod === 'spei' ? 'border-[#F27C36]' : 'border-slate-400'
                          }`}
                        >
                          {paymentMethod === 'spei' && (
                            <span className="w-2 h-2 rounded-full bg-[#F27C36]" />
                          )}
                        </span>
                        <Building2 className="w-5 h-5 text-[#102540] shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-[#102540]">
                          Transferencia bancaria
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                        Por definir
                      </span>
                    </button>
                  </div>

                  {/* Detalles de la tarjeta (cuando Tarjeta está seleccionada) */}
                  {paymentMethod === 'tarjeta' ? (
                    <div className="pt-3 border-t border-slate-200 space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-sm font-extrabold text-[#102540]">
                          Detalles de la tarjeta
                        </h5>
                        <button
                          type="button"
                          onClick={handleFillDemoCard}
                          className="text-xs font-bold text-[#1D63D6] hover:underline cursor-pointer"
                        >
                          Rellenar tarjeta de prueba
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#102540] mb-1">
                          Número de tarjeta <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="1234 5678 9012 3456"
                            value={cardData.number}
                            onChange={(e) => {
                              setCardData({
                                ...cardData,
                                number: formatCardNumberInput(e.target.value)
                              });
                              clearFieldError('cardNumber');
                            }}
                            className={`w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border bg-white font-mono focus:outline-none transition ${
                              errors.cardNumber
                                ? 'border-red-500 focus:border-red-600'
                                : 'border-slate-300 focus:border-[#102540]'
                            }`}
                          />
                        </div>
                        {renderFieldError('cardNumber')}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-[#102540] mb-1">
                            Nombre del titular <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              placeholder="Ej. Ana García"
                              value={cardData.holder}
                              onChange={(e) => {
                                setCardData({ ...cardData, holder: e.target.value });
                                clearFieldError('cardHolder');
                              }}
                              className={`w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border bg-white focus:outline-none transition ${
                                errors.cardHolder
                                  ? 'border-red-500 focus:border-red-600'
                                  : 'border-slate-300 focus:border-[#102540]'
                              }`}
                            />
                          </div>
                          {renderFieldError('cardHolder')}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#102540] mb-1">
                            Fecha de expiración <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="MM / AA"
                              value={cardData.expiry}
                              onChange={(e) => {
                                setCardData({
                                  ...cardData,
                                  expiry: formatExpiryInput(e.target.value)
                                });
                                clearFieldError('cardExpiry');
                              }}
                              className={`w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border bg-white font-mono focus:outline-none transition ${
                                errors.cardExpiry
                                  ? 'border-red-500 focus:border-red-600'
                                  : 'border-slate-300 focus:border-[#102540]'
                              }`}
                            />
                          </div>
                          {renderFieldError('cardExpiry')}
                        </div>
                      </div>

                      <div className="max-w-[160px]">
                        <label className="block text-xs font-bold text-[#102540] mb-1">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => {
                              setCardData({
                                ...cardData,
                                cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                              });
                              clearFieldError('cardCvv');
                            }}
                            className={`w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border bg-white font-mono focus:outline-none transition ${
                              errors.cardCvv
                                ? 'border-red-500 focus:border-red-600'
                                : 'border-slate-300 focus:border-[#102540]'
                            }`}
                          />
                        </div>
                        {renderFieldError('cardCvv')}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-600">
                      Al continuar, registraremos tu pedido en modo simulación con{' '}
                      <strong className="text-[#102540]">
                        {paymentMethod === 'paypal'
                          ? 'PayPal'
                          : paymentMethod === 'mercadopago'
                            ? 'Mercado Pago'
                            : 'Transferencia bancaria'}
                      </strong>{' '}
                      pendiente de verificación de pago.
                    </div>
                  )}
                </div>

                {/* Right: Resumen del pedido + Aviso métodos por definir */}
                <div className="lg:col-span-5 space-y-4">
                  {renderOrderSummaryCard()}

                  <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#F27C36] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-extrabold text-[#102540] mb-0.5">
                        Métodos de pago pendientes por definir
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Los métodos de pago mostrados son referenciales. Se confirmarán en la
                        siguiente etapa del proyecto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="shrink-0 px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setStage('resumen');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al resumen</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting || items.length === 0}
                onClick={handleConfirmOrder}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-[#F27C36] hover:bg-[#d96624] disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold transition inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Registrando pedido...' : 'Pagar ahora'}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 4: 6. CONFIRMACIÓN DE COMPRA (05.4.6) */}
        {/* ============================================================ */}
        {stage === 'confirmacion' && confirmedOrder && (
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-5 sm:p-8 space-y-6">
            {/* Centered Greeting & Order Number */}
            <div className="text-center space-y-2.5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-9 h-9 stroke-[2.75]" />
              </div>

              <h4 className="text-2xl sm:text-3xl font-black text-[#102540] tracking-tight">
                ¡Gracias por tu pedido!
              </h4>
              <p className="text-sm text-slate-600">
                Hemos recibido tu compra correctamente.
              </p>

              <div className="inline-block px-5 py-2 rounded-full bg-[#EEF2F7] text-[#102540] text-sm font-extrabold tabular-nums">
                Número de pedido: {confirmedOrder.orderId}
              </div>
            </div>

            {/* 2-Column Order Recap */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left: Tu pedido */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
                <h5 className="text-sm sm:text-base font-extrabold text-[#102540]">Tu pedido</h5>

                <div className="divide-y divide-slate-100">
                  {confirmedOrder.items.map((it, idx) => {
                    const unitPrice =
                      it.acquisitionType === 'renta' && it.product.rentalPriceMonthly
                        ? it.product.rentalPriceMonthly
                        : it.product.price;
                    return (
                      <div key={idx} className="py-3 first:pt-1 last:pb-1 flex items-center gap-3.5">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-extrabold text-[#102540] truncate">
                            {it.product.name}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {it.product.categoryLabel}
                          </div>
                          <div className="text-xs font-semibold text-slate-600 mt-1 tabular-nums">
                            Cantidad: {it.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-extrabold text-[#102540] tabular-nums shrink-0">
                          {formatCurrencyMXN(unitPrice * it.quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Resumen de compra */}
              <div className="md:col-span-5">
                {renderOrderSummaryCard(undefined, confirmedOrder)}
              </div>
            </div>

            {/* Email Confirmation Pending Payment Verification Notice */}
            <div className="p-4 rounded-2xl bg-[#EEF5FF] border border-blue-100 flex items-center justify-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-white border border-blue-200/80 flex items-center justify-center text-[#102540] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#102540]">
                  Te enviaremos un correo electrónico
                </div>
                <div className="text-xs sm:text-sm text-slate-600">
                  cuando tu pago haya sido confirmado.
                </div>
              </div>
            </div>

            {/* Continue Shopping CTA */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-10 py-3.5 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white text-sm font-extrabold transition inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Seguir comprando</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
