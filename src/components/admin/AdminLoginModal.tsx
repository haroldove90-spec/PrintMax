import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  Store, 
  Globe, 
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { AdminRole, AdminUser } from '../../types';
import { INITIAL_ADMIN_USERS } from '../../data/initialContent';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUser | null;
  onLogin: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin
}) => {
  const [selectedRole, setSelectedRole] = useState<AdminRole>(currentUser?.role || 'super_admin');
  const [email, setEmail] = useState('admin@printmax.mx');
  const [password, setPassword] = useState('••••••••');

  if (!isOpen) return null;

  const handleRoleSelect = (role: AdminRole) => {
    setSelectedRole(role);
    const found = INITIAL_ADMIN_USERS.find((u) => u.role === role);
    if (found) {
      setEmail(found.email);
    }
  };

  const handleConfirmLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userToLogin = INITIAL_ADMIN_USERS.find((u) => u.role === selectedRole) || INITIAL_ADMIN_USERS[0];
    onLogin(userToLogin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
      />

      {/* Centered Modal Window */}
      <div className="relative bg-black text-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden border border-neutral-800 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header - Sticky */}
        <div className="shrink-0 bg-neutral-950 px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-500 shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
                Acceso al Módulo Administrativo
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 truncate">
                Gestión Autoadministrable Printmax Kyocera
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

        {/* Form Body */}
        <form onSubmit={handleConfirmLogin} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 md:p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                1. Seleccione el Rol con el que desea ingresar:
              </label>

            <div className="space-y-2.5">
              {/* Super Admin */}
              <div
                onClick={() => handleRoleSelect('super_admin')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                  selectedRole === 'super_admin'
                    ? 'bg-neutral-900 border-blue-500/80 ring-1 ring-blue-500 shadow-md'
                    : 'bg-black border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="p-2 rounded-xl bg-black border border-neutral-800 text-blue-500 shrink-0 mt-0.5">
                  <KeyRound className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>Super Administrador Total</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                      Full Access
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Control total: editor de contenido de toda la web, subida de productos y recepción de pedidos.
                  </p>
                </div>
              </div>

              {/* Admin Tienda */}
              <div
                onClick={() => handleRoleSelect('admin_tienda')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                  selectedRole === 'admin_tienda'
                    ? 'bg-neutral-900 border-blue-500/80 ring-1 ring-blue-500 shadow-md'
                    : 'bg-black border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="p-2 rounded-xl bg-black border border-neutral-800 text-blue-500 shrink-0 mt-0.5">
                  <Store className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>Administrador de Tienda en Línea</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      E-commerce
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Subir nuevos productos, fijar precios de venta y renta, editar inventario y gestionar pedidos de clientes.
                  </p>
                </div>
              </div>

              {/* Admin Web */}
              <div
                onClick={() => handleRoleSelect('admin_web')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                  selectedRole === 'admin_web'
                    ? 'bg-neutral-900 border-blue-500/80 ring-1 ring-blue-500 shadow-md'
                    : 'bg-black border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="p-2 rounded-xl bg-black border border-neutral-800 text-blue-500 shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>Administrador Web (CMS Contenidos)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono">
                      CMS Web
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Editar el slider principal, textos de Qué Hacemos, Sobre Nosotros, teléfonos y datos de contacto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Contraseña de Seguridad
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          </div>

          {/* Sticky Actions Footer */}
          <div className="shrink-0 p-3.5 sm:p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-blue-500 text-xs sm:text-sm font-bold transition flex items-center space-x-2 shadow-lg"
            >
              <span>Ingresar al Panel</span>
              <ArrowRight className="w-4 h-4 text-blue-500" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
