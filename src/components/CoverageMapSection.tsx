import React from 'react';
import { MapPin, Navigation, Truck, Building, Phone, Clock, Mail } from 'lucide-react';

export const CoverageMapSection: React.FC = () => {
  const regionalHubs = [
    { name: 'Sede Central & Taller Matriz', state: 'San Luis Potosí, S.L.P.', time: 'Atención Inmediata (<4h)', active: true },
    { name: 'Región Bajío & Centro', state: 'Querétaro, Guanajuato, Aguascalientes', time: 'Servicio en <24h', active: true },
    { name: 'Región Norte & Frontera', state: 'Monterrey, Saltillo, Chihuahua', time: 'Servicio en <24h', active: true },
    { name: 'Región Occidente', state: 'Guadalajara, Jalisco, Michoacán', time: 'Servicio en <24h', active: true },
    { name: 'Región Metropolitana', state: 'CDMX, Toluca, Puebla', time: 'Servicio en <24h', active: true }
  ];

  return (
    <section className="py-20 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Info */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Infraestructura y Logística</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Centro de Distribución en San Luis Potosí y Cobertura Nacional
            </h2>
            
            <p className="text-slate-600 text-base leading-relaxed mb-6 font-normal">
              Nuestra ubicación estratégica en el corazón de México nos permite despachar consumibles, tóner original, refacciones y cuadrillas de ingenieros certificados a cualquier punto del país con tiempos de respuesta inigualables.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Building className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Sede Corporativa & Centro de Distribución:</span>
                  <span className="text-slate-600">Av. Venustiano Carranza #1450, Col. Tequisquiapan, San Luis Potosí, S.L.P. C.P. 78230</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Horario de Taller y Atención a Clientes:</span>
                  <span className="text-slate-600">Lunes a Viernes de 09:00 a 18:00 hrs | Soporte Urgente 24/7 para pólizas Platinum</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Almacén Central de Refacciones:</span>
                  <span className="text-slate-600">Más de 5,000 unidades de tóner original y kits de mantenimiento en existencia inmediata.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Regional Hubs Card */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Red de Atención y Distribución en México</h3>
                <span className="text-xs text-slate-400">Monitoreo y despacho continuo</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                100% Activa
              </span>
            </div>

            <div className="space-y-3">
              {regionalHubs.map((hub, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 animate-ping" />
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">{hub.name}</div>
                      <div className="text-[11px] text-slate-400">{hub.state}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/50">
                    {hub.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <span className="flex items-center">
                <Navigation className="w-4 h-4 text-blue-400 mr-1.5" />
                Envíos garantizados con FedEx, Estafeta y flotilla propia local en SLP.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
