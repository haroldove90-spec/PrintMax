import React, { useState } from 'react';
import { 
  Store, 
  Globe, 
  Package, 
  ShoppingBag, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  Search, 
  TrendingUp, 
  Users, 
  Clock, 
  ShieldCheck, 
  Check, 
  Save, 
  ArrowLeft, 
  LogOut, 
  FileText, 
  Image as ImageIcon,
  KeyRound,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { 
  AdminUser, 
  AdminRole, 
  Product, 
  OrderDetails, 
  SiteContent, 
  OrderStatus 
} from '../../types';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onExitToPublicSite: () => void;
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  orders: OrderDetails[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  siteContent: SiteContent;
  onSaveSiteContent: (content: SiteContent) => void;
  onResetFactoryData: () => void;
  onOpenNewProductModal: () => void;
  onOpenEditProductModal: (product: Product) => void;
  onOpenOrderDetailModal: (order: OrderDetails) => void;
  onChangeRole: (role: AdminRole) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onExitToPublicSite,
  products,
  onSaveProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  siteContent,
  onSaveSiteContent,
  onResetFactoryData,
  onOpenNewProductModal,
  onOpenEditProductModal,
  onOpenOrderDetailModal,
  onChangeRole
}) => {
  // Navigation tabs within Admin based on role
  const allowedTabs: { id: string; label: string; icon: React.ElementType }[] = [
    { id: 'resumen', label: 'Resumen & KPIs', icon: TrendingUp },
    ...(currentUser.role === 'super_admin' || currentUser.role === 'admin_tienda'
      ? [
          { id: 'productos', label: 'Catálogo de Productos', icon: Package },
          { id: 'pedidos', label: 'Pedidos Recibidos', icon: ShoppingBag }
        ]
      : []),
    ...(currentUser.role === 'super_admin' || currentUser.role === 'admin_web'
      ? [
          { id: 'cms', label: 'Editor Web (CMS)', icon: Globe }
        ]
      : []),
    { id: 'roles', label: 'Roles y Configuración', icon: KeyRound }
  ];

  const [activeTab, setActiveTab] = useState<string>(allowedTabs[0]?.id || 'resumen');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('todos');

  // CMS state for web editing
  const [editableContent, setEditableContent] = useState<SiteContent>(siteContent);
  const [cmsSaveNotice, setCmsSaveNotice] = useState(false);
  const [activeSlideEditor, setActiveSlideEditor] = useState<number>(0);

  // Sync if prop updates
  React.useEffect(() => {
    setEditableContent(siteContent);
  }, [siteContent]);

  // Statistics
  const totalSalesRevenue = orders.reduce((sum, o) => o.status !== 'cancelado' ? sum + o.total : sum, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pendiente' || o.status === 'en_proceso').length;
  const inStockProductsCount = products.filter((p) => p.inStock).length;

  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'todos' && p.category !== productCategoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteContent(editableContent);
    setCmsSaveNotice(true);
    setTimeout(() => setCmsSaveNotice(false), 2500);
  };

  const handleToggleProductStock = (product: Product) => {
    onSaveProduct({
      ...product,
      inStock: !product.inStock
    });
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-copy-${Date.now()}`,
      name: `${product.name} (Copia)`,
      code: `${product.code}-COPY`,
      reviewsCount: 0
    };
    onSaveProduct(duplicated);
  };

  // Synchronize active tab when switching roles
  React.useEffect(() => {
    const isTabAllowed = allowedTabs.some((t) => t.id === activeTab);
    if (!isTabAllowed) {
      if (currentUser.role === 'admin_web') {
        setActiveTab('cms');
      } else if (currentUser.role === 'admin_tienda') {
        setActiveTab('productos');
      } else {
        setActiveTab('resumen');
      }
    }
  }, [currentUser.role, allowedTabs, activeTab]);

  return (
    <div className="min-h-screen bg-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Admin Navigation Bar */}
      <div className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Left: Branding & Role badge */}
            <div className="flex items-center space-x-4">
              <img
                src="/printmaxlogo.png"
                alt="Printmax"
                className="h-9 w-auto object-contain cursor-pointer"
                onClick={onExitToPublicSite}
              />
              <div className="hidden sm:block border-l border-neutral-800 pl-4">
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span>Panel de Control</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    currentUser.role === 'super_admin' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : currentUser.role === 'admin_tienda'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {currentUser.roleLabel}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400">{currentUser.name}</span>
              </div>
            </div>

            {/* Right: Exit to Website and Logout */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onExitToPublicSite}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-neutral-700 transition flex items-center space-x-1.5"
                title="Ver la tienda y el sitio web público"
              >
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>Ver Sitio Web</span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 border border-neutral-800 transition"
                title="Cerrar Sesión Administrativa"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 1-Click Role Switcher Bar */}
        <div className="bg-neutral-900/90 border-t border-b border-neutral-800/80 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-neutral-400">
                Cambiar Rol en 1 Clic:
              </span>
              <span className="text-neutral-500 hidden lg:inline">
                (Prueba directamente el panel con cada rol)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Rol 1: Admin Página Web */}
              <button
                onClick={() => {
                  onChangeRole('admin_web');
                  setActiveTab('cms');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between sm:justify-center space-x-2 border ${
                  currentUser.role === 'admin_web'
                    ? 'bg-purple-950 text-purple-200 border-purple-500 shadow-md ring-1 ring-purple-500/50'
                    : 'bg-black hover:bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-purple-500/50'
                }`}
                title="Cambiar a Rol Administrador Página Web (CMS)"
              >
                <div className="flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Admin Página Web</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                  CMS
                </span>
              </button>

              {/* Rol 2: Admin Tienda en Línea */}
              <button
                onClick={() => {
                  onChangeRole('admin_tienda');
                  setActiveTab('productos');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between sm:justify-center space-x-2 border ${
                  currentUser.role === 'admin_tienda'
                    ? 'bg-emerald-950 text-emerald-200 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-black hover:bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-emerald-500/50'
                }`}
                title="Cambiar a Rol Administrador Tienda en Línea (Catálogo y Pedidos)"
              >
                <div className="flex items-center space-x-1.5">
                  <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Admin Tienda en Línea</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Tienda
                </span>
              </button>

              {/* Rol 3: Super Administrador */}
              <button
                onClick={() => {
                  onChangeRole('super_admin');
                  setActiveTab('resumen');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between sm:justify-center space-x-2 border ${
                  currentUser.role === 'super_admin'
                    ? 'bg-blue-950 text-blue-200 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                    : 'bg-black hover:bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-blue-500/50'
                }`}
                title="Cambiar a Super Administrador (Acceso Maestro Total)"
              >
                <div className="flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Super Administrador</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                  Full
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Context Role Guidance Banner */}
        {currentUser.role === 'admin_web' && (
          <div className="bg-purple-950/40 border-b border-purple-900/50 py-2.5 px-4 text-xs text-purple-200 text-center flex items-center justify-center space-x-2">
            <Globe className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Rol Activo: Administrador Página Web (CMS)</strong> — Tienes permisos para cambiar el contenido de toda la web: slider de 3 imágenes, Qué Hacemos, Sobre Nosotros, teléfonos y WhatsApp de contacto.
            </span>
          </div>
        )}

        {currentUser.role === 'admin_tienda' && (
          <div className="bg-emerald-950/40 border-b border-emerald-900/50 py-2.5 px-4 text-xs text-emerald-200 text-center flex items-center justify-center space-x-2">
            <Store className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Rol Activo: Administrador de Tienda en Línea</strong> — Tienes permisos para subir y editar productos, actualizar precios de venta y renta, stock y gestionar pedidos de clientes con facturación CFDI 4.0.
            </span>
          </div>
        )}

        {currentUser.role === 'super_admin' && (
          <div className="bg-blue-950/40 border-b border-blue-900/50 py-2.5 px-4 text-xs text-blue-200 text-center flex items-center justify-center space-x-2">
            <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Rol Activo: Super Administrador Total</strong> — Control total unificado sobre la Tienda en Línea (productos y pedidos), el Editor Web (CMS de contenidos) y la configuración de roles.
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-black border-t border-neutral-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-3 overflow-x-auto py-2">
            {allowedTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition ${
                    isActive
                      ? 'bg-neutral-900 text-white border border-neutral-700 shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-neutral-500'}`} />
                  <span className={isActive ? 'text-blue-400' : ''}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Admin Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========================================================= */}
        {/* TAB 1: RESUMEN / KPIS */}
        {/* ========================================================= */}
        {activeTab === 'resumen' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">
                Dashboard General de Administración
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Monitoreo de tienda en línea, estado de pedidos e inventario Kyocera México.
              </p>
            </div>

            {/* KPI Cards (Black background, blue icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Ventas Totales Tienda
                  </span>
                  <div className="text-2xl font-black text-white mt-1 font-mono">
                    ${totalSalesRevenue.toLocaleString('es-MX')} <span className="text-xs font-normal text-neutral-400">MXN</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">
                    ● Facturación CFDI 4.0
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-500">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Pedidos Recibidos
                  </span>
                  <div className="text-2xl font-black text-white mt-1">
                    {orders.length} <span className="text-xs font-normal text-neutral-400">órdenes</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-semibold mt-1 inline-block">
                    {pendingOrdersCount} pendientes de envío
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-500">
                  <ShoppingBag className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Productos en Catálogo
                  </span>
                  <div className="text-2xl font-black text-white mt-1">
                    {products.length} <span className="text-xs font-normal text-neutral-400">modelos</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">
                    {inStockProductsCount} con stock activo en SLP
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-500">
                  <Package className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Rol Autenticado
                  </span>
                  <div className="text-lg font-black text-white mt-1 capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </div>
                  <span className="text-[10px] text-blue-400 font-semibold mt-1 inline-block">
                    Modo Autoadministrable Activo
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-blue-500">
                  <KeyRound className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions Portal */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">
                Acciones Rápidas de Administración
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(currentUser.role === 'super_admin' || currentUser.role === 'admin_tienda') && (
                  <>
                    <button
                      onClick={onOpenNewProductModal}
                      className="p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 transition flex items-center space-x-3 text-left"
                    >
                      <div className="p-2.5 rounded-xl bg-black border border-neutral-800 text-blue-500">
                        <Plus className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Subir Nuevo Producto</div>
                        <div className="text-[11px] text-neutral-400">Añadir multifuncional, tóner o póliza</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('pedidos')}
                      className="p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 transition flex items-center space-x-3 text-left"
                    >
                      <div className="p-2.5 rounded-xl bg-black border border-neutral-800 text-blue-500">
                        <ShoppingBag className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Revisar Pedidos ({pendingOrdersCount})</div>
                        <div className="text-[11px] text-neutral-400">Ver guías, comprobantes y clientes</div>
                      </div>
                    </button>
                  </>
                )}

                {(currentUser.role === 'super_admin' || currentUser.role === 'admin_web') && (
                  <button
                    onClick={() => setActiveTab('cms')}
                    className="p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 transition flex items-center space-x-3 text-left"
                  >
                    <div className="p-2.5 rounded-xl bg-black border border-neutral-800 text-blue-500">
                      <Globe className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Editar Contenido Web</div>
                      <div className="text-[11px] text-neutral-400">Modificar slider, textos y contacto</div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Últimos Pedidos Registrados
                  </h3>
                  <span className="text-xs text-neutral-400">Actualizado en tiempo real</span>
                </div>
                {(currentUser.role === 'super_admin' || currentUser.role === 'admin_tienda') && (
                  <button
                    onClick={() => setActiveTab('pedidos')}
                    className="text-xs font-bold text-blue-400 hover:text-white"
                  >
                    Ver todos los pedidos →
                  </button>
                )}
              </div>

              <div className="divide-y divide-neutral-800">
                {orders.slice(0, 3).map((o) => (
                  <div 
                    key={o.orderId}
                    onClick={() => onOpenOrderDetailModal(o)}
                    className="py-3 flex items-center justify-between cursor-pointer hover:bg-neutral-900/50 px-2 rounded-xl transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center space-x-2">
                        <span className="font-mono text-blue-400">{o.orderId}</span>
                        <span>• {o.customerName}</span>
                        <span className="text-[10px] font-normal text-neutral-400">({o.companyName})</span>
                      </div>
                      <span className="text-[11px] text-neutral-400">{o.date} • {o.items.length} artículos</span>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-white font-mono">
                        ${o.total.toLocaleString('es-MX')} MXN
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CATÁLOGO DE PRODUCTOS (ADMIN TIENDA) */}
        {/* ========================================================= */}
        {activeTab === 'productos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Catálogo de Productos de la Tienda en Línea
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Suba nuevos equipos, modifique precios con IVA, cuotas de renta y disponibilidad de stock.
                </p>
              </div>

              <button
                onClick={onOpenNewProductModal}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white border border-neutral-700 hover:border-blue-500 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition"
              >
                <Plus className="w-4 h-4 text-blue-500" />
                <span>+ Subir Nuevo Producto</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Filtrar por nombre o SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs bg-neutral-900 text-white pl-8 pr-3 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-blue-500 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="w-full sm:w-56 text-xs bg-neutral-900 text-white px-3 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
              >
                <option value="todos">Todas las Categorías</option>
                <option value="multifuncionales-a3">Multifuncionales A3</option>
                <option value="multifuncionales-a4">Multifuncionales A4</option>
                <option value="impresoras">Impresoras</option>
                <option value="produccion">Producción</option>
                <option value="consumibles">Tóner y Consumibles</option>
                <option value="polizas">Pólizas de Servicio</option>
              </select>
            </div>

            {/* Products Table */}
            <div className="rounded-3xl border border-neutral-800 overflow-hidden bg-neutral-950 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Producto / Modelo</th>
                      <th className="py-3.5 px-4">Categoría</th>
                      <th className="py-3.5 px-4">Precio Venta</th>
                      <th className="py-3.5 px-4">Renta Mensual</th>
                      <th className="py-3.5 px-4 text-center">Stock SLP</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-900/50 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-11 h-11 object-contain rounded-xl bg-black border border-neutral-800 p-1 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white">{p.name}</div>
                              <div className="font-mono text-[10px] text-blue-400">{p.code}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 text-neutral-300 border border-neutral-800">
                            {p.categoryLabel}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-white">
                          ${p.price.toLocaleString('es-MX')} MXN
                        </td>

                        <td className="py-3 px-4 font-mono text-neutral-300">
                          {p.rentalPriceMonthly 
                            ? `$${p.rentalPriceMonthly.toLocaleString('es-MX')}/mes`
                            : <span className="text-neutral-500">—</span>}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleProductStock(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                              p.inStock
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                                : 'bg-red-950 text-red-400 border border-red-700'
                            }`}
                            title="Clic para cambiar estado de stock"
                          >
                            {p.inStock ? 'En Existencia' : 'Agotado'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => onOpenEditProductModal(p)}
                              className="p-1.5 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-blue-500 transition"
                              title="Editar producto"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                            </button>

                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-1.5 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 transition"
                              title="Duplicar producto"
                            >
                              <Copy className="w-3.5 h-3.5 text-blue-400" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar definitivamente el producto ${p.name}?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-red-400 border border-neutral-800 transition"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GESTIÓN DE PEDIDOS RECIBIDOS (ADMIN TIENDA) */}
        {/* ========================================================= */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Bandeja de Pedidos de la Tienda en Línea
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Revise pedidos confirmados en checkout, asigne guías de paquetería y actualice estatus para sus clientes.
                </p>
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-3xl border border-neutral-800 overflow-hidden bg-neutral-950 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Folio / Fecha</th>
                      <th className="py-3.5 px-4">Cliente / Razón Social</th>
                      <th className="py-3.5 px-4">Método de Pago</th>
                      <th className="py-3.5 px-4">Artículos</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4 text-center">Estado</th>
                      <th className="py-3.5 px-4 text-right">Detalle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {orders.map((order) => (
                      <tr 
                        key={order.orderId}
                        className="hover:bg-neutral-900/50 transition cursor-pointer"
                        onClick={() => onOpenOrderDetailModal(order)}
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-blue-400 block">{order.orderId}</span>
                          <span className="text-[10px] text-neutral-500">{order.date}</span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{order.customerName}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">RFC: {order.rfc}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-900 text-neutral-300 border border-neutral-800">
                            {order.paymentMethod === 'spei' ? 'SPEI' : order.paymentMethod === 'tarjeta' ? 'Tarjeta' : 'Crédito'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-neutral-300">
                          {order.items.length} {order.items.length === 1 ? 'equipo' : 'equipos'}
                        </td>

                        <td className="py-3 px-4 font-mono font-black text-white">
                          ${order.total.toLocaleString('es-MX')} MXN
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-blue-400 border border-neutral-800">
                            {order.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenOrderDetailModal(order);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-blue-500 text-[11px] font-bold transition"
                          >
                            Gestionar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: EDITOR DE CONTENIDO WEB / CMS (ADMIN WEB) */}
        {/* ========================================================= */}
        {activeTab === 'cms' && (
          <form onSubmit={handleSaveCMS} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Editor de Contenido Web (CMS Printmax)
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Modifique en tiempo real el slider principal de 3 imágenes, los textos corporativos y la información de contacto.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white border border-neutral-700 hover:border-blue-500 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition"
              >
                <Save className="w-4 h-4 text-blue-500" />
                <span>Guardar Cambios de la Web</span>
              </button>
            </div>

            {cmsSaveNotice && (
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>¡Contenido web actualizado y guardado con éxito! Se refleja en vivo en todo el sitio web.</span>
              </div>
            )}

            {/* Slider CMS Section */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    <span>Editor del Slider Principal (3 Imágenes)</span>
                  </h3>
                  <span className="text-xs text-neutral-400">Edite los textos de cada una de las 3 diapositivas oficiales</span>
                </div>

                <div className="flex space-x-2">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlideEditor(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        activeSlideEditor === idx
                          ? 'bg-neutral-900 text-white border-blue-500/80 shadow-sm'
                          : 'bg-black text-neutral-400 border-neutral-800'
                      }`}
                    >
                      Diapositiva {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slide Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Etiqueta / Tag Superior
                  </label>
                  <input
                    type="text"
                    value={editableContent.slides[activeSlideEditor].tag}
                    onChange={(e) => {
                      const updatedSlides = [...editableContent.slides];
                      updatedSlides[activeSlideEditor].tag = e.target.value;
                      setEditableContent({ ...editableContent, slides: updatedSlides });
                    }}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Título de la Diapositiva
                  </label>
                  <input
                    type="text"
                    value={editableContent.slides[activeSlideEditor].title}
                    onChange={(e) => {
                      const updatedSlides = [...editableContent.slides];
                      updatedSlides[activeSlideEditor].title = e.target.value;
                      setEditableContent({ ...editableContent, slides: updatedSlides });
                    }}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Subtítulo de la Diapositiva
                  </label>
                  <textarea
                    rows={2}
                    value={editableContent.slides[activeSlideEditor].subtitle}
                    onChange={(e) => {
                      const updatedSlides = [...editableContent.slides];
                      updatedSlides[activeSlideEditor].subtitle = e.target.value;
                      setEditableContent({ ...editableContent, slides: updatedSlides });
                    }}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    URL de la Imagen de Fondo
                  </label>
                  <input
                    type="url"
                    value={editableContent.slides[activeSlideEditor].imageUrl}
                    onChange={(e) => {
                      const updatedSlides = [...editableContent.slides];
                      updatedSlides[activeSlideEditor].imageUrl = e.target.value;
                      setEditableContent({ ...editableContent, slides: updatedSlides });
                    }}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* About & Qué Hacemos CMS Section */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-6">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Editor de Contenido: Qué Hacemos & Sobre Nosotros</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Texto Oficial "Qué Hacemos"
                  </label>
                  <textarea
                    rows={3}
                    value={editableContent.about.queHacemosText}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      about: { ...editableContent.about, queHacemosText: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Texto Oficial "Sobre Nosotros" (Párrafo 1)
                  </label>
                  <textarea
                    rows={2}
                    value={editableContent.about.sobreNosotrosText1}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      about: { ...editableContent.about, sobreNosotrosText1: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Texto Oficial "Sobre Nosotros" (Párrafo 2)
                  </label>
                  <textarea
                    rows={2}
                    value={editableContent.about.sobreNosotrosText2}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      about: { ...editableContent.about, sobreNosotrosText2: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Cifra de Clientes Satisfechos
                    </label>
                    <input
                      type="text"
                      value={editableContent.about.clientsCount}
                      onChange={(e) => setEditableContent({
                        ...editableContent,
                        about: { ...editableContent.about, clientsCount: e.target.value }
                      })}
                      className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Años de Trayectoria
                    </label>
                    <input
                      type="text"
                      value={editableContent.about.experienceYears}
                      onChange={(e) => setEditableContent({
                        ...editableContent,
                        about: { ...editableContent.about, experienceYears: e.target.value }
                      })}
                      className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information CMS */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-neutral-800 pb-3 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>Datos Corporativos de Contacto & San Luis Potosí</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Teléfono Local Taller (SLP)
                  </label>
                  <input
                    type="text"
                    value={editableContent.contact.phone}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, phone: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    WhatsApp Oficial (sin signos, con código 52)
                  </label>
                  <input
                    type="text"
                    value={editableContent.contact.whatsapp}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, whatsapp: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Correo de Ventas
                  </label>
                  <input
                    type="email"
                    value={editableContent.contact.salesEmail}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, salesEmail: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Correo de Soporte Técnico
                  </label>
                  <input
                    type="email"
                    value={editableContent.contact.supportEmail}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, supportEmail: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Dirección Física Sede Central
                  </label>
                  <input
                    type="text"
                    value={editableContent.contact.address}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, address: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-neutral-900 text-white px-3.5 py-2.5 rounded-xl border border-neutral-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white border border-neutral-700 hover:border-blue-500 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition"
                >
                  <Save className="w-4 h-4 text-blue-500" />
                  <span>Guardar y Aplicar Cambios</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ROLES Y CONFIGURACIÓN */}
        {/* ========================================================= */}
        {activeTab === 'roles' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-2xl font-black text-white">
                Roles y Permisos de Administración
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Cambie al instante entre roles para probar permisos o delegar acceso a operadores.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Cambiar Rol Activo en Sesión:
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => onChangeRole('super_admin')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                    currentUser.role === 'super_admin'
                      ? 'bg-neutral-900 border-blue-500 text-white shadow-md'
                      : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">Super Administrador</div>
                    <div className="text-xs text-neutral-400">Acceso integral a tienda, productos, pedidos y CMS de la web.</div>
                  </div>
                  {currentUser.role === 'super_admin' && <Check className="w-5 h-5 text-blue-500" />}
                </button>

                <button
                  onClick={() => onChangeRole('admin_tienda')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                    currentUser.role === 'admin_tienda'
                      ? 'bg-neutral-900 border-blue-500 text-white shadow-md'
                      : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">Administrador de Tienda en Línea</div>
                    <div className="text-xs text-neutral-400">Gestión de productos, catálogo, precios e inventario, y control de pedidos.</div>
                  </div>
                  {currentUser.role === 'admin_tienda' && <Check className="w-5 h-5 text-blue-500" />}
                </button>

                <button
                  onClick={() => onChangeRole('admin_web')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                    currentUser.role === 'admin_web'
                      ? 'bg-neutral-900 border-blue-500 text-white shadow-md'
                      : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">Administrador Web (CMS de Contenidos)</div>
                    <div className="text-xs text-neutral-400">Modificación del slider, textos institucionales y datos de contacto.</div>
                  </div>
                  {currentUser.role === 'admin_web' && <Check className="w-5 h-5 text-blue-500" />}
                </button>
              </div>
            </div>

            {/* Factory Reset */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Restablecer Datos de Demostración
              </h3>
              <p className="text-xs text-neutral-400">
                Si desea reiniciar todo el catálogo de productos y contenidos a los valores iniciales oficiales de Kyocera:
              </p>
              <button
                onClick={() => {
                  if (confirm('¿Restablecer todos los datos del sitio web y productos a los valores iniciales?')) {
                    onResetFactoryData();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-red-950 text-neutral-300 hover:text-red-300 border border-neutral-800 hover:border-red-800 text-xs font-bold transition flex items-center space-x-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Datos de Fábrica</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
