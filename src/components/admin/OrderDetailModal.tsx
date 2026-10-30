import React, { useState } from 'react';
import { 
  X, 
  Receipt, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Send, 
  Printer, 
  Building2, 
  Save, 
  AlertCircle
} from 'lucide-react';
import { OrderDetails, OrderStatus } from '../../types';

interface OrderDetailModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || 'pendiente');
  const [tracking, setTracking] = useState<string>(order?.trackingNumber || '');

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setTracking(order.trackingNumber || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(order.orderId, selectedStatus, tracking);
    onClose();
  };

  const getWhatsAppUpdateLink = () => {
    const statusTextMap: Record<OrderStatus, string> = {
      pendiente: 'está pendiente de pago.',
      confirmado: 'ha sido confirmado.',
      en_proceso: 'está siendo preparado en nuestro almacén de San Luis Potosí.',
      enviado: `ha sido enviado con número de guía: ${tracking || 'Por asignar'}.`,
      entregado: 'ha sido entregado con éxito.',
      cancelado: 'ha sido cancelado.'
    };

    const text = `Hola ${order.customerName}, le informamos de Printmax Kyocera México que su pedido con folio ${order.orderId} ${statusTextMap[selectedStatus]} Total: $${order.total.toLocaleString('es-MX')} MXN. Estamos a sus órdenes.`;
    return `https://wa.me/52${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
    pendiente: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    confirmado: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    en_proceso: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    enviado: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    entregado: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    cancelado: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
      />

      {/* Centered Modal Window */}
      <div className="relative bg-black text-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden border border-neutral-800 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Sticky */}
        <div className="shrink-0 bg-neutral-950 px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-500 shrink-0">
              <Receipt className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
                Gestión de Pedido: <span className="font-mono text-blue-400">{order.orderId}</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 truncate">
                Registrado el {order.date}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 md:p-8 space-y-5">
          
          {/* Customer & Billing Info */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Datos del Cliente y Facturación (CFDI 4.0)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[order.status].bg} ${statusColors[order.status].text} ${statusColors[order.status].border}`}>
                Estado: {order.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-neutral-500 block">Cliente:</span>
                <span className="font-bold text-white">{order.customerName}</span>
                <div className="text-neutral-400">{order.companyName}</div>
              </div>

              <div>
                <span className="text-neutral-500 block">RFC:</span>
                <span className="font-mono text-white font-bold">{order.rfc}</span>
              </div>

              <div>
                <span className="text-neutral-500 block">Contacto:</span>
                <span className="text-neutral-300">{order.phone}</span>
                <div className="text-neutral-400">{order.email}</div>
              </div>

              <div>
                <span className="text-neutral-500 block">Dirección de Entrega:</span>
                <span className="text-neutral-300">{order.address}, {order.city}, {order.state} CP {order.postalCode}</span>
              </div>
            </div>

            {order.notes && (
              <div className="pt-2 border-t border-neutral-800/80">
                <span className="text-neutral-500 block">Notas del cliente:</span>
                <p className="text-neutral-300 italic">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Items List */}
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Artículos del Pedido
            </h4>
            <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-950">
              {order.items.map((item, index) => {
                const itemPrice = item.acquisitionType === 'renta' && item.product.rentalPriceMonthly 
                  ? item.product.rentalPriceMonthly 
                  : item.product.price;

                return (
                  <div key={index} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-contain rounded-lg bg-neutral-900 p-1 border border-neutral-800 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white block">{item.product.name}</span>
                        <span className="text-[11px] text-blue-400">
                          {item.acquisitionType === 'renta' ? 'Modalidad Renta Mensual' : 'Compra Venta'} • Cantidad: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="font-mono text-right font-bold text-white">
                      ${(itemPrice * item.quantity).toLocaleString('es-MX')} MXN
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-between items-center text-sm font-black text-white">
              <span>Total Liquidación con IVA:</span>
              <span className="font-mono text-blue-400 text-lg">${order.total.toLocaleString('es-MX')} MXN</span>
            </div>
          </div>

          {/* Status Update Form */}
          <form onSubmit={handleSave} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-blue-500" />
              <span>Actualizar Estado de Envío / Pedido</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Nuevo Estado del Pedido:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full text-xs sm:text-sm bg-black text-white px-3 py-2.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="pendiente">Pendiente de Pago</option>
                  <option value="confirmado">Pago Confirmado</option>
                  <option value="en_proceso">En Almacén / Preparación</option>
                  <option value="enviado">Enviado con Guía</option>
                  <option value="entregado">Entregado al Cliente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Número de Guía / Paquetería:
                </label>
                <input
                  type="text"
                  placeholder="Ej. FEDEX-839210"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-black text-white px-3 py-2.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={getWhatsAppUpdateLink()}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700 text-xs font-bold flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Notificar al Cliente por WhatsApp</span>
              </a>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-blue-500 text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5 text-blue-500" />
                <span>Guardar Estado</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
