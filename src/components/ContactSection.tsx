import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Building2,
  HelpCircle
} from 'lucide-react';

interface ContactSectionProps {
  prefilledSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  prefilledSubject = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    interest: 'renta', // 'renta', 'venta', 'soporte', 'consumibles'
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prefilledSubject) {
      setFormData((prev) => ({
        ...prev,
        message: `Solicito informes sobre: ${prefilledSubject}. `
      }));
    }
  }, [prefilledSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const getWhatsAppDirectLink = () => {
    const text = `Hola, mi nombre es ${formData.name || 'un cliente'} de la empresa ${formData.company || 'mi empresa'}. Me interesa información sobre ${formData.interest === 'renta' ? 'Renta de Equipos' : formData.interest === 'venta' ? 'Venta de Multifuncionales' : formData.interest === 'soporte' ? 'Soporte Técnico Especializado' : 'Consumibles y Tóner Original'}. ${formData.message}`;
    return `https://wa.me/524448123000?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="contacto" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Atención Personalizada Inmediata</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contacto: ¿En qué podemos ayudarte?
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Estamos listos para impulsar la productividad de su negocio. Si necesita asesoría para elegir el equipo ideal, cotizar un servicio de renta o venta, o requiere soporte técnico especializado, póngase en contacto con nosotros. Nuestro equipo le responderá a la brevedad para ofrecerle la solución perfecta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  KM Corporación / PrintMax
                </span>
                <h3 className="text-2xl font-black text-white">
                  Centro de Atención a Clientes y Empresas
                </h3>
                <p className="text-xs text-slate-300 mt-2 font-light">
                  Distribuidores autorizados de Kyocera Japón con soporte técnico en menos de 24 horas.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400 shrink-0 border border-slate-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Oficinas y Taller Central:</span>
                    <span className="text-slate-300">San Luis Potosí, S.L.P., México. Cobertura en toda la República Mexicana.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400 shrink-0 border border-slate-700">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Líneas Telefónicas Directas:</span>
                    <a href="tel:4448123000" className="text-blue-400 hover:underline block font-semibold">
                      (444) 812-3000
                    </a>
                    <span className="text-slate-400">Línea sin costo: 800 KYOCERA-MX</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400 shrink-0 border border-slate-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Correos Corporativos:</span>
                    <span className="text-slate-300 block">ventas@kmcorporacion.com.mx</span>
                    <span className="text-slate-400">soporte@printmax.com.mx</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400 shrink-0 border border-slate-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Horarios de Asistencia:</span>
                    <span className="text-slate-300">Lunes a Viernes: 09:00 a 18:00 hrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800">
              <a
                href="https://wa.me/524448123000?text=Hola,%20deseo%20asesoria%20sobre%20impresoras%20y%20multifuncionales%20Kyocera"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-600/30"
              >
                <span>Chatear por WhatsApp con un Asesor</span>
              </a>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-black text-slate-900">
                  ¡Mensaje Recibido Correctamente!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Un ingeniero o asesor comercial certificado de Kyocera México se pondrá en contacto con usted en un lapso no mayor a 2 horas hábiles.
                </p>
                <div className="pt-4 flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        interest: 'renta',
                        message: ''
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                  >
                    Enviar otra consulta
                  </button>
                  <a
                    href={getWhatsAppDirectLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center space-x-1.5"
                  >
                    <span>Enviar también por WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Ing. Laura Gómez"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Empresa / Institución
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Notaría Pública #12"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="laura@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Teléfono / WhatsApp *
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo de Solución que Requiere
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="renta">Renta de Multifuncionales (Deducible 100%)</option>
                    <option value="venta">Venta de Equipos A3 / A4 / Impresoras</option>
                    <option value="soporte">Soporte Técnico & Póliza Anual de Mantenimiento</option>
                    <option value="software">Software de Impresión & Control de Costos (MyQ / Net Manager)</option>
                    <option value="consumibles">Suministro de Tóner y Refacciones Originales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Detalles de su requerimiento o dudas
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Indique volumen aproximado de impresión, modelos de interés o tipo de falla técnica si requiere soporte..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500">
                    Sus datos están protegidos conforme a la Ley Federal de Protección de Datos.
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
