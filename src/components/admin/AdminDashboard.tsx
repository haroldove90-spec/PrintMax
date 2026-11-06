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
  EyeOff,
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
  CheckCircle2,
  Database,
  Code2,
  Download,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ListPlus,
  Sliders,
  Award,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { LUMESA_SUPABASE_SQL } from '../../data/supabaseSql';
import { 
  testSupabaseConnection, 
  saveSiteContentToSupabase, 
  saveProductToSupabase, 
  saveOrderToSupabase, 
  SUPABASE_PROJECT_ID, 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY 
} from '../../lib/supabase';
import { 
  AdminUser, 
  AdminRole, 
  Product, 
  OrderDetails, 
  SiteContent, 
  OrderStatus,
  ContentVisibility
} from '../../types';
import { DEFAULT_VISIBILITY } from '../../data/initialContent';
import { FormattedText } from '../FormattedText';

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
    ...(currentUser.role === 'super_admin'
      ? [
          { id: 'supabase', label: 'Supabase & Base de Datos', icon: Database }
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
  const [newBulletInput, setNewBulletInput] = useState('');

  // Supabase state
  const [supabaseStatus, setSupabaseStatus] = useState<{
    tested: boolean;
    loading: boolean;
    success: boolean;
    message: string;
    tables: string[];
  }>({
    tested: false,
    loading: false,
    success: false,
    message: '',
    tables: []
  });
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);

  // Sync if prop updates
  React.useEffect(() => {
    setEditableContent(siteContent);
  }, [siteContent]);

  const handleAddFeatureToSlide = () => {
    if (!newBulletInput.trim()) return;
    const currentSlide = editableContent.slides[activeSlideEditor];
    const currentFeatures = currentSlide.features || [];
    const updatedSlides = [...editableContent.slides];
    updatedSlides[activeSlideEditor] = {
      ...currentSlide,
      features: [...currentFeatures, newBulletInput.trim()]
    };
    setEditableContent({ ...editableContent, slides: updatedSlides });
    setNewBulletInput('');
  };

  const handleRemoveFeatureFromSlide = (index: number) => {
    const currentSlide = editableContent.slides[activeSlideEditor];
    const updatedFeatures = (currentSlide.features || []).filter((_, i) => i !== index);
    const updatedSlides = [...editableContent.slides];
    updatedSlides[activeSlideEditor] = {
      ...currentSlide,
      features: updatedFeatures
    };
    setEditableContent({ ...editableContent, slides: updatedSlides });
  };

  const handleSetImageFeaturesPreset = () => {
    const currentSlide = editableContent.slides[activeSlideEditor];
    const updatedSlides = [...editableContent.slides];
    updatedSlides[activeSlideEditor] = {
      ...currentSlide,
      features: [
        'Multifuncionales A3 (hasta 11" x 17") y A4 compactos',
        'Renta 100% deducible de impuestos',
        'Mantenimiento y tóner original incluidos'
      ],
      ctaPrimaryText: 'Ver Catálogo de Equipos',
      ctaPrimaryAction: 'hardware',
      ctaSecondaryText: 'Calculadora de Renta',
      ctaSecondaryAction: 'contacto'
    };
    setEditableContent({ ...editableContent, slides: updatedSlides });
  };

  const handleTestSupabase = async () => {
    setSupabaseStatus({ tested: true, loading: true, success: false, message: 'Probando conexión con Supabase Cloud...', tables: [] });
    const res = await testSupabaseConnection();
    setSupabaseStatus({ tested: true, loading: false, success: res.success, message: res.message, tables: res.tables });
  };

  const handleSyncAllToSupabase = async () => {
    setSyncingSupabase(true);
    setSyncNotice('Iniciando sincronización con Supabase Cloud...');
    try {
      const contentOk = await saveSiteContentToSupabase(editableContent);
      let productsCount = 0;
      for (const p of products) {
        const ok = await saveProductToSupabase(p);
        if (ok) productsCount++;
      }
      let ordersCount = 0;
      for (const ord of orders) {
        const ok = await saveOrderToSupabase(ord);
        if (ok) ordersCount++;
      }
      if (contentOk || productsCount > 0) {
        setSyncNotice(`¡Sincronización exitosa! Se subieron ${productsCount} productos, ${ordersCount} pedidos y el contenido CMS completo a Supabase.`);
      } else {
        setSyncNotice('Las tablas aún no existen en Supabase. Primero copia el script SQL y córrelo en el editor SQL de Supabase.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncNotice(`Error al sincronizar: ${msg}`);
    } finally {
      setSyncingSupabase(false);
      setTimeout(() => setSyncNotice(null), 6000);
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(LUMESA_SUPABASE_SQL);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 3000);
  };

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

  const currentVisibility: ContentVisibility = {
    ...DEFAULT_VISIBILITY,
    ...(editableContent.visibility || {}),
    showTrustMetrics: editableContent.showTrustMetrics ?? editableContent.visibility?.showTrustMetrics ?? false
  };

  const handleToggleVisibility = (key: keyof ContentVisibility) => {
    const updatedVal = !currentVisibility[key];
    const updatedVis: ContentVisibility = {
      ...currentVisibility,
      [key]: updatedVal
    };
    setEditableContent({
      ...editableContent,
      showTrustMetrics: key === 'showTrustMetrics' ? updatedVal : (editableContent.showTrustMetrics ?? false),
      visibility: updatedVis
    });
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVis: ContentVisibility = {
      ...DEFAULT_VISIBILITY,
      ...(editableContent.visibility || {}),
      showTrustMetrics: editableContent.showTrustMetrics ?? editableContent.visibility?.showTrustMetrics ?? false
    };
    const contentToSave: SiteContent = {
      ...editableContent,
      showTrustMetrics: finalVis.showTrustMetrics,
      visibility: finalVis
    };
    onSaveSiteContent(contentToSave);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Admin Navigation Bar */}
      <div className="bg-[#182F4F] text-white border-b border-[#394B61] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Left: Branding & Role badge (Clean, completely un-encapsulated logo) */}
            <div className="flex items-center space-x-4">
              <img
                src="/lumesalogo.png"
                alt="LUMESA"
                className="h-10 sm:h-12 w-auto object-contain cursor-pointer select-none"
                onClick={onExitToPublicSite}
                onError={(e) => {
                  e.currentTarget.src = "https://appdesignproyectos.com/lumesalogo.png";
                }}
              />
              <div className="hidden sm:block border-l border-[#394B61] pl-4">
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span>Panel LUMESA</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    currentUser.role === 'super_admin' 
                      ? 'bg-[#F27C36]/20 text-[#F27C36] border border-[#F27C36]/40'
                      : currentUser.role === 'admin_tienda'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  }`}>
                    {currentUser.roleLabel}
                  </span>
                </div>
                <span className="text-[11px] text-slate-300">{currentUser.name}</span>
              </div>
            </div>

            {/* Right: Exit to Website and Logout */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onExitToPublicSite}
                className="px-3.5 py-2 rounded-xl bg-[#394B61] hover:bg-[#000000] text-white text-xs font-bold border border-[#394B61] transition flex items-center space-x-1.5 shadow-sm"
                title="Ver la tienda y el sitio web público"
              >
                <Eye className="w-3.5 h-3.5 text-[#F27C36]" />
                <span>Ver Sitio Web</span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-[#394B61] hover:bg-rose-900/60 text-slate-300 hover:text-white border border-[#394B61] transition"
                title="Cerrar Sesión Administrativa"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 1-Click Role Switcher Bar in #000000 */}
        <div className="bg-[#000000] border-t border-b border-[#394B61] px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#F27C36]">
                Cambiar Rol en 1 Clic:
              </span>
              <span className="text-slate-400 hidden lg:inline">
                (Prueba directamente el panel LUMESA con cada rol)
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
                    ? 'bg-[#F27C36] text-white border-[#F27C36] shadow-md ring-1 ring-[#F27C36]/50'
                    : 'bg-[#182F4F] hover:bg-[#394B61] text-slate-200 border-[#394B61] hover:border-[#F27C36]'
                }`}
                title="Cambiar a Super Administrador (Acceso Maestro Total)"
              >
                <div className="flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Super Administrador</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 text-white font-mono">
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
              <strong>Rol Activo: Administrador Página Web (CMS LUMESA)</strong> — Tienes permisos para cambiar el contenido de toda la web: slider de 3 imágenes, Qué Hacemos, Sobre Nosotros, teléfonos y WhatsApp de contacto.
            </span>
          </div>
        )}

        {currentUser.role === 'admin_tienda' && (
          <div className="bg-emerald-950/40 border-b border-emerald-900/50 py-2.5 px-4 text-xs text-emerald-200 text-center flex items-center justify-center space-x-2">
            <Store className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Rol Activo: Administrador de Tienda en Línea LUMESA</strong> — Tienes permisos para subir y editar productos, actualizar precios de venta y renta, stock y gestionar pedidos de clientes con facturación CFDI 4.0.
            </span>
          </div>
        )}

        {currentUser.role === 'super_admin' && (
          <div className="bg-[#182F4F] border-b border-[#394B61] py-2.5 px-4 text-xs text-white text-center flex items-center justify-center space-x-2">
            <KeyRound className="w-4 h-4 text-[#F27C36] shrink-0" />
            <span>
              <strong>Rol Activo: Super Administrador Total LUMESA</strong> — Control total unificado sobre la Tienda en Línea (productos y pedidos), el Editor Web (CMS de contenidos) y la configuración de roles.
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-[#182F4F] border-t border-[#394B61]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
            {allowedTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition ${
                    isActive
                      ? 'bg-[#F27C36] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-[#394B61]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#F27C36]'}`} />
                  <span>{tab.label}</span>
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
                  Editor de Contenido Web (CMS LUMESA)
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

            {/* Control Maestro de Visibilidad de Secciones (Activar / Desactivar Contenido de Toda la Web) */}
            <div className="p-6 rounded-3xl bg-[#000000] border-2 border-[#394B61] shadow-2xl space-y-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#394B61] pb-4 gap-3">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#182F4F] text-[#F27C36] text-[10px] font-bold uppercase tracking-wider mb-2 border border-[#394B61]">
                    <Layers className="w-3.5 h-3.5 text-[#F27C36]" />
                    <span>Control Maestro de Secciones</span>
                  </div>
                  <h3 className="text-lg font-black text-white flex items-center space-x-2">
                    <span>Activar / Desactivar Secciones de la Página Web</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Encienda o apague bloques de contenido en tiempo real según las necesidades de la empresa (métricas, tarjetas, imágenes, mapas, etc.).
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs bg-[#182F4F] px-3.5 py-2 rounded-xl border border-[#394B61] text-slate-300 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">Control en Tiempo Real</span>
                </div>
              </div>

              {/* Grid de Controles de Visibilidad */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Métricas de Confianza (4 KPIs) */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  currentVisibility.showTrustMetrics 
                    ? 'bg-[#182F4F]/80 border-emerald-500/60 shadow-lg' 
                    : 'bg-[#182F4F]/30 border-slate-700/80'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-[#000000] border border-[#394B61]">
                        <Award className="w-4 h-4 text-[#F27C36]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Métricas de Confianza (4 KPIs)</h4>
                        <span className="text-[10px] text-slate-400">+30 Años, +2,000 Clientes, &lt;24h</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={currentVisibility.showTrustMetrics}
                      onClick={() => handleToggleVisibility('showTrustMetrics')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        currentVisibility.showTrustMetrics ? 'bg-[#F27C36]' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        currentVisibility.showTrustMetrics ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`font-bold ${currentVisibility.showTrustMetrics ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {currentVisibility.showTrustMetrics ? 'Visible en Inicio' : 'Desactivado (Oculto)'}
                    </span>
                  </div>
                </div>

                {/* 2. Portales Rápidos en Inicio */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  currentVisibility.showQuickPortals 
                    ? 'bg-[#182F4F]/80 border-emerald-500/60 shadow-lg' 
                    : 'bg-[#182F4F]/30 border-slate-700/80'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-[#000000] border border-[#394B61]">
                        <LayoutGrid className="w-4 h-4 text-[#F27C36]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Tarjetas Soluciones (Inicio)</h4>
                        <span className="text-[10px] text-slate-400">Portales a Tienda, Renta, Software</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={currentVisibility.showQuickPortals}
                      onClick={() => handleToggleVisibility('showQuickPortals')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        currentVisibility.showQuickPortals ? 'bg-[#F27C36]' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        currentVisibility.showQuickPortals ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`font-bold ${currentVisibility.showQuickPortals ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {currentVisibility.showQuickPortals ? 'Visible en Inicio' : 'Desactivado (Oculto)'}
                    </span>
                  </div>
                </div>

                {/* 3. Tarjeta Qué Hacemos */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  currentVisibility.showQueHacemos 
                    ? 'bg-[#182F4F]/80 border-emerald-500/60 shadow-lg' 
                    : 'bg-[#182F4F]/30 border-slate-700/80'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-[#000000] border border-[#394B61]">
                        <FileText className="w-4 h-4 text-[#F27C36]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Tarjeta "Qué Hacemos"</h4>
                        <span className="text-[10px] text-slate-400">Propuesta de valor y técnicos Kyocera</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={currentVisibility.showQueHacemos}
                      onClick={() => handleToggleVisibility('showQueHacemos')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        currentVisibility.showQueHacemos ? 'bg-[#F27C36]' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        currentVisibility.showQueHacemos ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`font-bold ${currentVisibility.showQueHacemos ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {currentVisibility.showQueHacemos ? 'Visible en Nosotros' : 'Desactivado (Oculto)'}
                    </span>
                  </div>
                </div>

                {/* 4. Tarjeta Sobre Nosotros */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  currentVisibility.showSobreNosotros 
                    ? 'bg-[#182F4F]/80 border-emerald-500/60 shadow-lg' 
                    : 'bg-[#182F4F]/30 border-slate-700/80'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-[#000000] border border-[#394B61]">
                        <Users className="w-4 h-4 text-[#F27C36]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Tarjeta "Sobre Nosotros"</h4>
                        <span className="text-[10px] text-slate-400">Trayectoria, sede y alcance</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={currentVisibility.showSobreNosotros}
                      onClick={() => handleToggleVisibility('showSobreNosotros')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        currentVisibility.showSobreNosotros ? 'bg-[#F27C36]' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        currentVisibility.showSobreNosotros ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`font-bold ${currentVisibility.showSobreNosotros ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {currentVisibility.showSobreNosotros ? 'Visible en Nosotros' : 'Desactivado (Oculto)'}
                    </span>
                  </div>
                </div>

                {/* 5. Cifras y Estadísticas en Nosotros */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  currentVisibility.showAboutStats 
                    ? 'bg-[#182F4F]/80 border-emerald-500/60 shadow-lg' 
                    : 'bg-[#182F4F]/30 border-slate-700/80'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-[#000000] border border-[#394B61]">
                        <TrendingUp className="w-4 h-4 text-[#F27C36]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Cifras (+2,000 Clientes)</h4>
                        <span className="text-[10px] text-slate-400">Bloques numéricos en Sobre Nosotros</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={currentVisibility.showAboutStats}
                      onClick={() => handleToggleVisibility('showAboutStats')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        currentVisibility.showAboutStats ? 'bg-[#F27C36]' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        currentVisibility.showAboutStats ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`font-bold ${currentVisibility.showAboutStats ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {currentVisibility.showAboutStats ? 'Visible en Tarjeta' : 'Desactivado (Oculto)'}
                    </span>
                  </div>
                </div>

                {/* 6. Fotografías del Slider Principal */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  currentVisibility.showSlideImages 
                    ? 'bg-[#182F4F]/80 border-emerald-500/60 shadow-lg' 
                    : 'bg-[#182F4F]/30 border-slate-700/80'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-[#000000] border border-[#394B61]">
                        <ImageIcon className="w-4 h-4 text-[#F27C36]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Imágenes de Fondo Slider</h4>
                        <span className="text-[10px] text-slate-400">Fotos de equipos vs fondo minimalista</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={currentVisibility.showSlideImages}
                      onClick={() => handleToggleVisibility('showSlideImages')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        currentVisibility.showSlideImages ? 'bg-[#F27C36]' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        currentVisibility.showSlideImages ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`font-bold ${currentVisibility.showSlideImages ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {currentVisibility.showSlideImages ? 'Fotos Activas' : 'Fondo Corporativo'}
                    </span>
                  </div>
                </div>

                {/* 7. Mapa de Cobertura Nacional */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  currentVisibility.showCoverageMap 
                    ? 'bg-[#182F4F]/80 border-emerald-500/60 shadow-lg' 
                    : 'bg-[#182F4F]/30 border-slate-700/80'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-[#000000] border border-[#394B61]">
                        <MapPin className="w-4 h-4 text-[#F27C36]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Mapa Cobertura Nacional</h4>
                        <span className="text-[10px] text-slate-400">Sede San Luis Potosí y estados</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={currentVisibility.showCoverageMap}
                      onClick={() => handleToggleVisibility('showCoverageMap')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        currentVisibility.showCoverageMap ? 'bg-[#F27C36]' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        currentVisibility.showCoverageMap ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                    <span className="text-slate-400">Estado:</span>
                    <span className={`font-bold ${currentVisibility.showCoverageMap ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {currentVisibility.showCoverageMap ? 'Visible en Nosotros y Contacto' : 'Desactivado (Oculto)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider CMS Section */}
            <div className="p-6 rounded-3xl bg-[#182F4F] border border-[#394B61] shadow-xl space-y-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#394B61] pb-4 gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-[#F27C36]" />
                    <span>Editor del Slider Principal (3 Diapositivas Oficiales)</span>
                  </h3>
                  <span className="text-xs text-slate-300">
                    Edite textos, títulos, viñetas con palomita y los botones de acción ("Ver catálogo", "Calculadora de renta", etc.)
                  </span>
                </div>

                <div className="flex space-x-2">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlideEditor(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        activeSlideEditor === idx
                          ? 'bg-[#F27C36] text-white border-[#F27C36] shadow-sm'
                          : 'bg-[#000000] text-slate-300 border-[#394B61] hover:border-slate-300'
                      }`}
                    >
                      Diapositiva {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slide Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Badge / Resaltado
                  </label>
                  <input
                    type="text"
                    value={editableContent.slides[activeSlideEditor].badgeText || ''}
                    onChange={(e) => {
                      const updatedSlides = [...editableContent.slides];
                      updatedSlides[activeSlideEditor].badgeText = e.target.value;
                      setEditableContent({ ...editableContent, slides: updatedSlides });
                    }}
                    placeholder="Ej: Tecnología ECOSYS y TASKalfa"
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Título Principal de la Diapositiva
                  </label>
                  <input
                    type="text"
                    value={editableContent.slides[activeSlideEditor].title}
                    onChange={(e) => {
                      const updatedSlides = [...editableContent.slides];
                      updatedSlides[activeSlideEditor].title = e.target.value;
                      setEditableContent({ ...editableContent, slides: updatedSlides });
                    }}
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Subtítulo / Descripción
                  </label>
                  <textarea
                    rows={2}
                    value={editableContent.slides[activeSlideEditor].subtitle}
                    onChange={(e) => {
                      const updatedSlides = [...editableContent.slides];
                      updatedSlides[activeSlideEditor].subtitle = e.target.value;
                      setEditableContent({ ...editableContent, slides: updatedSlides });
                    }}
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36]"
                  />
                </div>

                {/* BOTONES DE ACCIÓN (CTA 1 & CTA 2) */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-[#000000]/70 border border-[#394B61] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#F27C36] flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-[#F27C36]" />
                      <span>Configurar Botones del Slider (Acciones y Textos)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">Edite el texto y la sección a la que dirigen</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Botón 1 (Principal - Naranja) */}
                    <div className="space-y-2 p-3 rounded-xl bg-[#182F4F]/60 border border-[#394B61]">
                      <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F27C36]" />
                        <span>Botón Principal (Ej. Ver Catálogo de Equipos)</span>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">Texto del Botón:</label>
                        <input
                          type="text"
                          value={editableContent.slides[activeSlideEditor].ctaPrimaryText || ''}
                          onChange={(e) => {
                            const updatedSlides = [...editableContent.slides];
                            updatedSlides[activeSlideEditor].ctaPrimaryText = e.target.value;
                            setEditableContent({ ...editableContent, slides: updatedSlides });
                          }}
                          placeholder="Ver Catálogo de Equipos"
                          className="w-full text-xs bg-[#000000] text-white px-3 py-2 rounded-lg border border-[#394B61]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">Destino al hacer clic:</label>
                        <select
                          value={editableContent.slides[activeSlideEditor].ctaPrimaryAction || 'hardware'}
                          onChange={(e) => {
                            const updatedSlides = [...editableContent.slides];
                            updatedSlides[activeSlideEditor].ctaPrimaryAction = e.target.value;
                            setEditableContent({ ...editableContent, slides: updatedSlides });
                          }}
                          className="w-full text-xs bg-[#000000] text-white px-3 py-2 rounded-lg border border-[#394B61]"
                        >
                          <option value="hardware">Renta / Venta de Equipos Kyocera</option>
                          <option value="tienda">Tienda en Línea</option>
                          <option value="software">Software y Soluciones Documentales</option>
                          <option value="contacto">Contacto & Cotización Inmediata</option>
                        </select>
                      </div>
                    </div>

                    {/* Botón 2 (Secundario - Azul Marino) */}
                    <div className="space-y-2 p-3 rounded-xl bg-[#182F4F]/60 border border-[#394B61]">
                      <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        <span>Botón Secundario (Ej. Calculadora de Renta)</span>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">Texto del Botón:</label>
                        <input
                          type="text"
                          value={editableContent.slides[activeSlideEditor].ctaSecondaryText || ''}
                          onChange={(e) => {
                            const updatedSlides = [...editableContent.slides];
                            updatedSlides[activeSlideEditor].ctaSecondaryText = e.target.value;
                            setEditableContent({ ...editableContent, slides: updatedSlides });
                          }}
                          placeholder="Calculadora de Renta"
                          className="w-full text-xs bg-[#000000] text-white px-3 py-2 rounded-lg border border-[#394B61]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">Destino al hacer clic:</label>
                        <select
                          value={editableContent.slides[activeSlideEditor].ctaSecondaryAction || 'contacto'}
                          onChange={(e) => {
                            const updatedSlides = [...editableContent.slides];
                            updatedSlides[activeSlideEditor].ctaSecondaryAction = e.target.value;
                            setEditableContent({ ...editableContent, slides: updatedSlides });
                          }}
                          className="w-full text-xs bg-[#000000] text-white px-3 py-2 rounded-lg border border-[#394B61]"
                        >
                          <option value="contacto">Contacto & Calculadora de Renta</option>
                          <option value="hardware">Renta / Venta de Equipos</option>
                          <option value="tienda">Tienda en Línea</option>
                          <option value="software">Software Kyocera</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VIÑETAS / PUNTOS DESTACADOS (FEATURES CON PALOMITA) */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-[#000000]/70 border border-[#394B61] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#F27C36] flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#F27C36]" />
                        <span>Puntos Destacados / Viñetas con Palomita (Features)</span>
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Aquí puede editar o agregar viñetas como: "Multifuncionales A3", "Renta 100% deducible", "Mantenimiento y tóner original incluidos".
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSetImageFeaturesPreset}
                      className="px-3 py-1.5 rounded-lg bg-[#394B61] hover:bg-[#F27C36] text-white text-[11px] font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0"
                      title="Cargar las viñetas oficiales de la imagen compartida"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F27C36]" />
                      <span>Cargar Viñetas de la Imagen</span>
                    </button>
                  </div>

                  {/* List of existing features */}
                  <div className="space-y-2">
                    {editableContent.slides[activeSlideEditor].features && editableContent.slides[activeSlideEditor].features.length > 0 ? (
                      editableContent.slides[activeSlideEditor].features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-2 bg-[#182F4F] p-2 rounded-xl border border-[#394B61]">
                          <CheckCircle2 className="w-4 h-4 text-[#F27C36] shrink-0" />
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const updatedFeatures = [...(editableContent.slides[activeSlideEditor].features || [])];
                              updatedFeatures[fIdx] = e.target.value;
                              const updatedSlides = [...editableContent.slides];
                              updatedSlides[activeSlideEditor].features = updatedFeatures;
                              setEditableContent({ ...editableContent, slides: updatedSlides });
                            }}
                            className="flex-1 text-xs bg-transparent text-white focus:outline-none font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeatureFromSlide(fIdx)}
                            className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950 transition cursor-pointer"
                            title="Eliminar esta viñeta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No hay viñetas registradas para esta diapositiva.</p>
                    )}
                  </div>

                  {/* Add new feature input */}
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      value={newBulletInput}
                      onChange={(e) => setNewBulletInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeatureToSlide();
                        }
                      }}
                      placeholder="Escribir nueva viñeta (ej: Multifuncionales A3 compactos)..."
                      className="flex-1 text-xs bg-[#000000] text-white px-3 py-2 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36]"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeatureToSlide}
                      className="px-3.5 py-2 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Viñeta</span>
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Trust Metrics CMS Section (4 KPIs) - Con función de Activar / Desactivar */}
            <div className="p-6 rounded-3xl bg-[#182F4F] border border-[#394B61] shadow-xl space-y-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#394B61] pb-4 gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Award className="w-5 h-5 text-[#F27C36]" />
                    <h3 className="text-base font-bold text-white">
                      Tarjetas de Métricas de Confianza (4 KPIs del Inicio)
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      editableContent.showTrustMetrics
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-700/60 text-slate-300 border-slate-600'
                    }`}>
                      {editableContent.showTrustMetrics ? 'Visibles en la Web' : 'Inactivas / Ocultas'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Active o desactive la visualización de las 4 tarjetas (+30 Años, +2,000 Clientes, &lt; 24h Soporte, 100% Kyocera) en la página web.
                  </p>
                </div>

                {/* Switch de Activación / Desactivación */}
                <div className="flex items-center space-x-3 bg-[#000000]/70 px-4 py-2.5 rounded-2xl border border-[#394B61] shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">
                      {editableContent.showTrustMetrics ? 'Métricas Activas' : 'Métricas Inactivas'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {editableContent.showTrustMetrics ? 'Mostrándose en el sitio' : 'Ocultas para los usuarios'}
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(editableContent.showTrustMetrics)}
                    onClick={() => setEditableContent({
                      ...editableContent,
                      showTrustMetrics: !editableContent.showTrustMetrics
                    })}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      editableContent.showTrustMetrics ? 'bg-[#F27C36]' : 'bg-slate-700'
                    }`}
                    title={editableContent.showTrustMetrics ? 'Desactivar visualización de métricas' : 'Activar visualización de métricas'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        editableContent.showTrustMetrics ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Banner Informativo cuando están Inactivas */}
              {!editableContent.showTrustMetrics && (
                <div className="p-4 rounded-2xl bg-[#000000]/80 border border-[#F27C36]/50 text-slate-200 text-xs flex items-center space-x-3 animate-in fade-in">
                  <EyeOff className="w-5 h-5 text-[#F27C36] shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Tarjetas de métricas desactivadas en la página web</span>
                    <span className="text-slate-300">
                      Por el momento las métricas están ocultas en la página web pública. Puedes editar los valores aquí abajo y se guardarán para cuando decidas reactivarlas.
                    </span>
                  </div>
                </div>
              )}

              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity ${
                !editableContent.showTrustMetrics ? 'opacity-70' : 'opacity-100'
              }`}>
                {editableContent.trustMetrics && editableContent.trustMetrics.map((metric, mIdx) => (
                  <div key={mIdx} className="p-3.5 rounded-2xl bg-[#000000]/60 border border-[#394B61] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F27C36]">
                      Métrica {mIdx + 1}
                    </span>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Cifra Destacada:</label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => {
                          const updated = [...editableContent.trustMetrics];
                          updated[mIdx].value = e.target.value;
                          setEditableContent({ ...editableContent, trustMetrics: updated });
                        }}
                        className="w-full text-xs font-bold bg-[#000000] text-white px-2.5 py-1.5 rounded-lg border border-[#394B61]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Título / Etiqueta:</label>
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => {
                          const updated = [...editableContent.trustMetrics];
                          updated[mIdx].label = e.target.value;
                          setEditableContent({ ...editableContent, trustMetrics: updated });
                        }}
                        className="w-full text-xs bg-[#000000] text-white px-2.5 py-1.5 rounded-lg border border-[#394B61]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Descripción Breve:</label>
                      <textarea
                        rows={2}
                        value={metric.description}
                        onChange={(e) => {
                          const updated = [...editableContent.trustMetrics];
                          updated[mIdx].description = e.target.value;
                          setEditableContent({ ...editableContent, trustMetrics: updated });
                        }}
                        className="w-full text-[11px] bg-[#000000] text-slate-200 px-2.5 py-1.5 rounded-lg border border-[#394B61]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About & Qué Hacemos CMS Section */}
            <div className="p-6 rounded-3xl bg-[#182F4F] border border-[#394B61] shadow-xl space-y-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#394B61] pb-3 gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#F27C36]" />
                    <span>Editor de Contenido: Qué Hacemos & Sobre Nosotros</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Edite las tarjetas de propuesta de valor y trayectoria. Respeta saltos de línea con <strong className="text-white">Enter</strong> o etiquetas <code className="bg-[#000000] px-1 py-0.5 rounded text-[#F27C36]">&lt;br&gt;</code> sin mostrar código en pantalla.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility('showQueHacemos')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition cursor-pointer ${
                      currentVisibility.showQueHacemos 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Activar / Desactivar tarjeta Qué Hacemos"
                  >
                    {currentVisibility.showQueHacemos ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>Qué Hacemos: {currentVisibility.showQueHacemos ? 'Activo' : 'Oculto'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleVisibility('showSobreNosotros')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition cursor-pointer ${
                      currentVisibility.showSobreNosotros 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Activar / Desactivar tarjeta Sobre Nosotros"
                  >
                    {currentVisibility.showSobreNosotros ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>Sobre Nosotros: {currentVisibility.showSobreNosotros ? 'Activo' : 'Oculto'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Campo 1: Qué Hacemos */}
                <div className="p-4 rounded-2xl bg-[#000000]/60 border border-[#394B61] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#F27C36]" />
                      <span>Texto Oficial "Qué Hacemos"</span>
                    </label>
                    <span className="text-[11px] text-[#F27C36] font-medium bg-[#182F4F] px-2 py-0.5 rounded-md border border-[#394B61]">
                      ⏎ Presiona Enter para renglón nuevo
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={editableContent.about.queHacemosText}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      about: { ...editableContent.about, queHacemosText: e.target.value }
                    })}
                    placeholder="Escribe el texto de Qué Hacemos..."
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36] leading-relaxed"
                  />
                  {/* Vista Previa en Vivo Formateada */}
                  {editableContent.about.queHacemosText && (
                    <div className="p-3 rounded-xl bg-[#182F4F]/40 border border-[#394B61]/80 text-xs">
                      <span className="text-[10px] uppercase font-bold text-[#F27C36] block mb-1">
                        Vista Previa Formateada (así se verá en la web pública):
                      </span>
                      <div className="text-slate-200">
                        <FormattedText text={editableContent.about.queHacemosText} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Campo 2: Sobre Nosotros - Párrafo 1 */}
                <div className="p-4 rounded-2xl bg-[#000000]/60 border border-[#394B61] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#F27C36]" />
                      <span>Texto Oficial "Sobre Nosotros" (Párrafo 1)</span>
                    </label>
                    <span className="text-[11px] text-[#F27C36] font-medium bg-[#182F4F] px-2 py-0.5 rounded-md border border-[#394B61]">
                      ⏎ Presiona Enter para renglón nuevo
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editableContent.about.sobreNosotrosText1}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      about: { ...editableContent.about, sobreNosotrosText1: e.target.value }
                    })}
                    placeholder="Escribe el párrafo 1..."
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36] leading-relaxed"
                  />
                  {editableContent.about.sobreNosotrosText1 && (
                    <div className="p-3 rounded-xl bg-[#182F4F]/40 border border-[#394B61]/80 text-xs">
                      <span className="text-[10px] uppercase font-bold text-[#F27C36] block mb-1">
                        Vista Previa Formateada:
                      </span>
                      <div className="text-slate-200">
                        <FormattedText text={editableContent.about.sobreNosotrosText1} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Campo 3: Sobre Nosotros - Párrafo 2 */}
                <div className="p-4 rounded-2xl bg-[#000000]/60 border border-[#394B61] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#F27C36]" />
                      <span>Texto Oficial "Sobre Nosotros" (Párrafo 2)</span>
                    </label>
                    <span className="text-[11px] text-[#F27C36] font-medium bg-[#182F4F] px-2 py-0.5 rounded-md border border-[#394B61]">
                      ⏎ Presiona Enter para renglón nuevo
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editableContent.about.sobreNosotrosText2}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      about: { ...editableContent.about, sobreNosotrosText2: e.target.value }
                    })}
                    placeholder="Escribe el párrafo 2..."
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36] leading-relaxed"
                  />
                  {editableContent.about.sobreNosotrosText2 && (
                    <div className="p-3 rounded-xl bg-[#182F4F]/40 border border-[#394B61]/80 text-xs">
                      <span className="text-[10px] uppercase font-bold text-[#F27C36] block mb-1">
                        Vista Previa Formateada:
                      </span>
                      <div className="text-slate-200">
                        <FormattedText text={editableContent.about.sobreNosotrosText2} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cifras y Estadísticas con switch propio */}
                <div className="p-4 rounded-2xl bg-[#000000]/60 border border-[#394B61] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#394B61] pb-2">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Cifras Numéricas en Sobre Nosotros
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility('showAboutStats')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 border transition cursor-pointer ${
                        currentVisibility.showAboutStats 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {currentVisibility.showAboutStats ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{currentVisibility.showAboutStats ? 'Cifras Visibles' : 'Cifras Ocultas'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Cifra de Clientes Satisfechos:
                      </label>
                      <input
                        type="text"
                        value={editableContent.about.clientsCount}
                        onChange={(e) => setEditableContent({
                          ...editableContent,
                          about: { ...editableContent.about, clientsCount: e.target.value }
                        })}
                        className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Años de Trayectoria:
                      </label>
                      <input
                        type="text"
                        value={editableContent.about.experienceYears}
                        onChange={(e) => setEditableContent({
                          ...editableContent,
                          about: { ...editableContent.about, experienceYears: e.target.value }
                        })}
                        className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information CMS */}
            <div className="p-6 rounded-3xl bg-[#182F4F] border border-[#394B61] shadow-xl space-y-4 text-white">
              <h3 className="text-base font-bold text-white border-b border-[#394B61] pb-3 flex items-center space-x-2">
                <Phone className="w-5 h-5 text-[#F27C36]" />
                <span>Datos Corporativos de Contacto & San Luis Potosí</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teléfono Local Taller (SLP)
                  </label>
                  <input
                    type="text"
                    value={editableContent.contact.phone}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, phone: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Oficial (sin signos, con código 52)
                  </label>
                  <input
                    type="text"
                    value={editableContent.contact.whatsapp}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, whatsapp: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Línea Gratuita 01 800
                  </label>
                  <input
                    type="text"
                    value={editableContent.contact.tollFree || '01 800 KYOCERA'}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, tollFree: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo de Ventas
                  </label>
                  <input
                    type="email"
                    value={editableContent.contact.salesEmail}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, salesEmail: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo de Soporte Técnico
                  </label>
                  <input
                    type="email"
                    value={editableContent.contact.supportEmail}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, supportEmail: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dirección Física Sede Central
                  </label>
                  <input
                    type="text"
                    value={editableContent.contact.address}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      contact: { ...editableContent.contact, address: e.target.value }
                    })}
                    className="w-full text-xs sm:text-sm bg-[#000000] text-white px-3.5 py-2.5 rounded-xl border border-[#394B61]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition cursor-pointer"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>Guardar y Aplicar Cambios</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB: SUPABASE & BASE DE DATOS EN LA NUBE */}
        {/* ========================================================= */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center space-x-2">
                  <Database className="w-6 h-6 text-[#F27C36]" />
                  <span>Configuración & Conexión Supabase</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Base de datos en la nube PostgreSQL para persistencia de contenidos del sitio web, productos, inventario y pedidos.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTestSupabase}
                  disabled={supabaseStatus.loading}
                  className="px-4 py-2.5 rounded-xl bg-[#182F4F] hover:bg-[#000000] text-white border border-[#394B61] hover:border-[#F27C36] font-bold text-xs flex items-center space-x-2 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#F27C36] ${supabaseStatus.loading ? 'animate-spin' : ''}`} />
                  <span>{supabaseStatus.loading ? 'Probando...' : 'Probar Conexión'}</span>
                </button>

                <button
                  onClick={handleSyncAllToSupabase}
                  disabled={syncingSupabase}
                  className="px-4 py-2.5 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white font-bold text-xs flex items-center space-x-2 transition shadow-md cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingSupabase ? 'animate-spin' : ''}`} />
                  <span>{syncingSupabase ? 'Sincronizando...' : 'Sincronizar a Supabase Ahora'}</span>
                </button>
              </div>
            </div>

            {syncNotice && (
              <div className="p-4 rounded-2xl bg-[#000000] border border-[#F27C36] text-white text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-[#F27C36] shrink-0" />
                <span>{syncNotice}</span>
              </div>
            )}

            {/* Supabase Project Credentials Summary */}
            <div className="p-6 rounded-3xl bg-[#182F4F] border border-[#394B61] shadow-xl text-white space-y-4">
              <div className="flex items-center justify-between border-b border-[#394B61] pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Credenciales del Proyecto Supabase
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  API REST v1 Activa
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#000000]/60 border border-[#394B61]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nombre del Proyecto:</span>
                  <div className="font-mono text-white break-all">lumesa@appdesign.appdesignproyectos.com's Project</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#000000]/60 border border-[#394B61]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Project ID:</span>
                  <div className="font-mono text-[#F27C36] font-bold">{SUPABASE_PROJECT_ID}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#000000]/60 border border-[#394B61]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">URL Endpoint:</span>
                  <div className="font-mono text-slate-200 break-all">{SUPABASE_URL}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#000000]/60 border border-[#394B61]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">API Publishable Key (Anon):</span>
                  <div className="font-mono text-slate-300 break-all">{SUPABASE_ANON_KEY.substring(0, 20)}...</div>
                </div>
              </div>

              {/* Status report */}
              {supabaseStatus.tested && (
                <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-start space-x-2.5 ${
                  supabaseStatus.success 
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                    : 'bg-amber-950/80 border-amber-600 text-amber-200'
                }`}>
                  {supabaseStatus.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p>{supabaseStatus.message}</p>
                    {!supabaseStatus.success && (
                      <p className="mt-1 text-[11px] text-amber-300">
                        Paso necesario: copia el código SQL de abajo y pégalo en el editor SQL de tu panel Supabase para crear las tablas con 1 clic.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SQL Script Viewer and One-Click Copy */}
            <div className="p-6 rounded-3xl bg-[#182F4F] border border-[#394B61] shadow-xl text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#394B61] pb-3 gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Code2 className="w-5 h-5 text-[#F27C36]" />
                    <span>Script SQL Oficial para Supabase (Creación de Tablas & RLS)</span>
                  </h3>
                  <span className="text-xs text-slate-300">
                    Copia y ejecuta este script en el Editor SQL de Supabase para inicializar las tablas public.site_content, public.products y public.orders.
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleCopySQL}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer ${
                      copiedSQL 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-[#F27C36] hover:bg-[#d96624] text-white shadow-md'
                    }`}
                  >
                    {copiedSQL ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSQL ? '¡Copiado al Portapapeles!' : 'Copiar Código SQL'}</span>
                  </button>

                  <a
                    href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#000000] hover:bg-[#394B61] text-white border border-[#394B61] font-bold text-xs flex items-center space-x-1.5 transition"
                  >
                    <span>Abrir Supabase SQL Editor</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#F27C36]" />
                  </a>
                </div>
              </div>

              {/* Instructions steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#000000]/60 border border-[#394B61]">
                  <span className="w-5 h-5 rounded-full bg-[#F27C36] text-white font-bold text-[10px] inline-flex items-center justify-center mr-1.5">1</span>
                  <span className="font-bold">Copia el SQL:</span> Presiona el botón naranja "Copiar Código SQL".
                </div>
                <div className="p-3 rounded-xl bg-[#000000]/60 border border-[#394B61]">
                  <span className="w-5 h-5 rounded-full bg-[#F27C36] text-white font-bold text-[10px] inline-flex items-center justify-center mr-1.5">2</span>
                  <span className="font-bold">Ve al SQL Editor:</span> Abre tu panel en Supabase en la sección SQL Editor.
                </div>
                <div className="p-3 rounded-xl bg-[#000000]/60 border border-[#394B61]">
                  <span className="w-5 h-5 rounded-full bg-[#F27C36] text-white font-bold text-[10px] inline-flex items-center justify-center mr-1.5">3</span>
                  <span className="font-bold">Haz clic en Run:</span> Pega el código y presiona "Run" para crear las 3 tablas y políticas.
                </div>
              </div>

              {/* Code Pre Block */}
              <div className="relative">
                <pre className="p-4 rounded-2xl bg-[#000000] border border-[#394B61] text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-96 select-all">
                  {LUMESA_SUPABASE_SQL}
                </pre>
              </div>
            </div>
          </div>
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
