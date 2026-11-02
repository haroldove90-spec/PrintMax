import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // If already running as an installed PWA, hide install triggers
  if (isInstalled) {
    return null;
  }

  // Handle click: if browser provides prompt, call it; if iOS, show step-by-step; otherwise show PWA info modal
  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleAction}
          className="p-2.5 rounded-xl text-white transition bg-[#394B61] hover:bg-[#F27C36] shadow-sm border border-[#394B61] hover:border-[#F27C36] cursor-pointer flex items-center justify-center shrink-0"
          title="Instalar App LUMESA (PWA)"
          aria-label="Instalar App"
        >
          <Download className="w-5 h-5 text-white" />
        </button>
      )}

      {variant === 'floating' && showInstallBanner && (
        <aside aria-label="Instalación PWA" className="fixed bottom-24 left-4 z-40 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-2xl p-3.5 shadow-2xl border border-slate-200 flex items-center space-x-3 text-slate-900">
            <img 
              src="/lumesaicono.png" 
              alt="LUMESA App" 
              className="w-10 h-10 rounded-xl object-contain shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#182F4F] truncate">Instalar LUMESA App</div>
              <p className="text-[11px] text-[#394B61] leading-tight">Acceso rápido sin navegador</p>
            </div>
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={handleAction}
                className="px-2.5 py-1.5 rounded-lg bg-[#F27C36] hover:bg-[#d96624] text-white text-xs font-bold transition"
              >
                Instalar
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition"
                aria-label="Cerrar aviso de instalación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* iOS Safari & General Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-900 relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lumesaicono.png" 
                alt="LUMESA Icono" 
                className="w-12 h-12 rounded-2xl object-contain shadow-md"
              />
              <div>
                <h3 className="text-base font-bold text-[#182F4F]">Instalar App LUMESA</h3>
                <p className="text-xs text-[#394B61]">Compatible con Móvil y Escritorio</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#182F4F] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Presiona el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline text-[#182F4F]" /> en la barra inferior de Safari.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#182F4F] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Desplázate hacia abajo y selecciona <strong>"Agregar a pantalla de inicio"</strong>.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#F27C36] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Toca <strong>"Agregar"</strong> en la esquina superior derecha.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p>
                  Para instalar en Chrome, Edge o Android:
                </p>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Haz clic en el ícono de instalación <Download className="w-3.5 h-3.5 inline text-[#F27C36]" /> en la barra de direcciones o el menú del navegador.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Selecciona <strong>"Instalar LUMESA"</strong> para abrirla como app independiente en tu pantalla.</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#182F4F] hover:bg-[#394B61] text-white text-xs font-bold transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
