import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
}

const SPLASH_SESSION_KEY = 'lumesa_splash_shown_v2';
const WINDOW_NAME_TOKEN = '__LUMESA_SPLASH_SHOWN__';

// Module-level guard so even re-mounts within the same runtime never re-trigger the splash
let splashAlreadyShownInMemory = false;

function hasShownSplashThisSession(): boolean {
  if (splashAlreadyShownInMemory) return true;
  try {
    if (sessionStorage.getItem(SPLASH_SESSION_KEY) === 'true') {
      splashAlreadyShownInMemory = true;
      return true;
    }
  } catch {
    // Fallback to window.name when sessionStorage is unavailable (e.g. restricted webviews)
  }
  try {
    if (typeof window !== 'undefined' && window.name.includes(WINDOW_NAME_TOKEN)) {
      splashAlreadyShownInMemory = true;
      return true;
    }
  } catch {
    // Ignore window.name access issues
  }
  return false;
}

function markSplashShownThisSession(): void {
  splashAlreadyShownInMemory = true;
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
  } catch {
    // Ignore storage quota / security errors
  }
  try {
    if (typeof window !== 'undefined' && !window.name.includes(WINDOW_NAME_TOKEN)) {
      window.name = `${window.name}${WINDOW_NAME_TOKEN}`;
    }
  } catch {
    // Ignore window.name access issues
  }
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState<boolean>(() => {
    if (hasShownSplashThisSession()) {
      return false;
    }
    // Mark synchronously immediately on first session render so refreshing mid-splash never repeats it
    markSplashShownThisSession();
    return true;
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) {
      if (onFinish) onFinish();
      return;
    }

    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const fadeTimer = setTimeout(() => {
      setFading(true);
      closeTimer = setTimeout(() => {
        setVisible(false);
        if (onFinish) onFinish();
      }, 280);
    }, 650);

    return () => {
      clearTimeout(fadeTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [visible, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center px-6 max-w-md w-full text-center">
        <img
          src="/lumesalogo.png"
          alt="LUMESA"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="w-auto max-w-[260px] sm:max-w-xs h-16 sm:h-20 object-contain select-none drop-shadow-sm"
          onError={(e) => {
            e.currentTarget.src = 'https://appdesignproyectos.com/lumesalogo.png';
          }}
        />

        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-7">
          <div className="h-full w-full rounded-full animate-pulse bg-gradient-to-r from-[#182F4F] to-[#F27C36]" />
        </div>

        <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-[#394B61]">
          Soluciones de Impresión & Multifuncionales
        </p>
      </div>
    </div>
  );
};
