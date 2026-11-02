import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash for 1 second, then fade out smoothly
    const timer = setTimeout(() => {
      setFading(true);
      const closeTimer = setTimeout(() => {
        setVisible(false);
        if (onFinish) onFinish();
      }, 500);
      return () => clearTimeout(closeTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="flex flex-col items-center px-6 max-w-md w-full text-center">
        {/* Clean, un-encapsulated LUMESA logo */}
        <img
          src="/lumesalogo.png"
          alt="LUMESA"
          className="w-auto h-16 sm:h-20 object-contain drop-shadow-sm select-none animate-in zoom-in-95 duration-500"
        />

        {/* Brand progress bar in #182F4F and #F27C36 */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-8">
          <div
            className="h-full rounded-full animate-pulse"
            style={{
              background: 'linear-gradient(90deg, #182F4F 0%, #F27C36 100%)',
              width: '100%'
            }}
          />
        </div>

        <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-[#394B61]">
          Soluciones de Impresión & Multifuncionales
        </p>
      </div>
    </div>
  );
};
