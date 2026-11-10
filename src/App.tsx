import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { TrustStats } from './components/TrustStats';
import { AboutSection } from './components/AboutSection';
import { HardwareCatalog } from './components/HardwareCatalog';
import { OnlineStoreSection } from './components/OnlineStoreSection';
import { SoftwareSolutionsSection } from './components/SoftwareSolutionsSection';
import { CoverageMapSection } from './components/CoverageMapSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductComparatorModal } from './components/ProductComparatorModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ProductFormModal } from './components/admin/ProductFormModal';
import { OrderDetailModal } from './components/admin/OrderDetailModal';
import { SplashScreen } from './components/SplashScreen';
import { PWAInstallButton } from './components/PWAInstallButton';
import { PRODUCTS } from './data/mockData';
import { INITIAL_SITE_CONTENT, INITIAL_ADMIN_USERS, INITIAL_ORDERS, normalizeHeroSlides } from './data/initialContent';
import { 
  fetchSiteContentFromSupabase, 
  saveSiteContentToSupabase,
  fetchProductsFromSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchOrdersFromSupabase,
  saveOrderToSupabase,
  updateOrderStatusInSupabase
} from './lib/supabase';
import { 
  AppSection, 
  CartItem, 
  Product, 
  SiteContent, 
  AdminUser, 
  AdminRole, 
  OrderDetails, 
  OrderStatus,
  ContentVisibility,
  FooterConfig
} from './types';
import { 
  MessageCircle, 
  Store, 
  Printer, 
  Calculator, 
  Cpu, 
  Clock, 
  Building2, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck,
  ShoppingCart
} from 'lucide-react';

export default function App() {
  // Navigation: SEPARATE INDEPENDENT SECTIONS with reload persistence
  const [activeSection, setActiveSection] = useState<AppSection>(() => {
    const validSections: AppSection[] = [
      'inicio', 
      'nosotros', 
      'renta_venta', 
      'hardware', 
      'software', 
      'tienda', 
      'contacto',
      'admin'
    ];
    try {
      const hash = window.location.hash.replace('#', '') as AppSection;
      if (validSections.includes(hash)) return hash;
      const saved = localStorage.getItem('lumesa_active_section') as AppSection;
      if (saved && validSections.includes(saved)) return saved;
    } catch {}
    return 'inicio';
  });

  // ==========================================
  // AUTO-ADMINISTRABLE PERSISTENT STATE
  // ==========================================
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lumesa_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return PRODUCTS;
  });

  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const saved = localStorage.getItem('lumesa_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('lumesa_site_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        const visibility: ContentVisibility = {
          ...INITIAL_SITE_CONTENT.visibility,
          ...(parsed.visibility || {})
        };
        const updatedContent: SiteContent = {
          ...INITIAL_SITE_CONTENT,
          ...parsed,
          slides: normalizeHeroSlides(parsed.slides),
          trustMetrics: parsed.trustMetrics && Array.isArray(parsed.trustMetrics) && parsed.trustMetrics.length > 0 
            ? parsed.trustMetrics 
            : INITIAL_SITE_CONTENT.trustMetrics,
          about: {
            ...INITIAL_SITE_CONTENT.about,
            ...(parsed.about || {})
          },
          coverage: {
            ...INITIAL_SITE_CONTENT.coverage,
            ...(parsed.coverage || {})
          },
          hardwareSection: {
            ...INITIAL_SITE_CONTENT.hardwareSection,
            ...(parsed.hardwareSection || {})
          },
          softwareSection: {
            ...INITIAL_SITE_CONTENT.softwareSection,
            ...(parsed.softwareSection || {})
          },
          whatsappButton: {
            ...INITIAL_SITE_CONTENT.whatsappButton,
            ...(parsed.whatsappButton || {})
          },
          contact: {
            ...INITIAL_SITE_CONTENT.contact,
            ...(parsed.contact || {})
          },
          footer: {
            ...INITIAL_SITE_CONTENT.footer,
            ...(parsed.footer || {})
          } as FooterConfig,
          storeCategories: parsed.storeCategories || INITIAL_SITE_CONTENT.storeCategories,
          paymentConfig: parsed.paymentConfig || INITIAL_SITE_CONTENT.paymentConfig,
          coupons: parsed.coupons || INITIAL_SITE_CONTENT.coupons,
          showTrustMetrics: parsed.showTrustMetrics ?? visibility.showTrustMetrics,
          visibility,
          _lastUpdated: parsed._lastUpdated || Date.now()
        };
        return updatedContent;
      }
    } catch {
      // fallback
    }
    return INITIAL_SITE_CONTENT;
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('lumesa_current_admin');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ADMIN_USERS[0]; // Default to Super Admin so user can test immediately
  });

  // Sync state changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumesa_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('lumesa_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('lumesa_site_content', JSON.stringify(siteContent));
    } catch {}
  }, [siteContent]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('lumesa_current_admin', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('lumesa_current_admin');
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('lumesa_active_section', activeSection);
    } catch {}
  }, [activeSection]);

  // Initial Sync from Supabase Cloud (with intelligent timestamp conflict resolution)
  useEffect(() => {
    let isMounted = true;
    async function loadCloudData() {
      try {
        const [cloudContent, cloudProducts, cloudOrders] = await Promise.all([
          fetchSiteContentFromSupabase(),
          fetchProductsFromSupabase(),
          fetchOrdersFromSupabase()
        ]);
        if (!isMounted) return;

        if (cloudContent) {
          // Check local timestamp
          let localTs = 0;
          let localParsed: SiteContent | null = null;
          try {
            const rawLocal = localStorage.getItem('lumesa_site_content');
            if (rawLocal) {
              localParsed = JSON.parse(rawLocal);
              localTs = Number(localParsed?._lastUpdated || 0);
            }
          } catch {}

          const cloudTs = Number((cloudContent as any)._lastUpdated || 0);

          // If local has newer modifications, do NOT overwrite them! Instead, sync local UP to Supabase.
          if (localTs > cloudTs && localTs > 0 && localParsed) {
            console.log('Local CMS content is newer than cloud. Pushing local to Supabase...');
            saveSiteContentToSupabase(localParsed).catch(console.warn);
          } else {
            // Cloud has newer or equal content: merge carefully into state and localStorage
            const mergedVisibility = {
              ...INITIAL_SITE_CONTENT.visibility,
              ...(cloudContent.visibility || {}),
              showTrustMetrics: cloudContent.showTrustMetrics ?? cloudContent.visibility?.showTrustMetrics ?? true
            };
            const updatedContent: SiteContent = {
              ...INITIAL_SITE_CONTENT,
              ...cloudContent,
              slides: normalizeHeroSlides(cloudContent.slides),
              trustMetrics: cloudContent.trustMetrics && cloudContent.trustMetrics.length > 0 ? cloudContent.trustMetrics : INITIAL_SITE_CONTENT.trustMetrics,
              about: {
                ...INITIAL_SITE_CONTENT.about,
                ...(cloudContent.about || {})
              },
              coverage: {
                ...INITIAL_SITE_CONTENT.coverage,
                ...(cloudContent.coverage || {})
              },
              hardwareSection: {
                ...INITIAL_SITE_CONTENT.hardwareSection,
                ...(cloudContent.hardwareSection || {})
              },
              softwareSection: {
                ...INITIAL_SITE_CONTENT.softwareSection,
                ...(cloudContent.softwareSection || {})
              },
              whatsappButton: {
                ...INITIAL_SITE_CONTENT.whatsappButton,
                ...(cloudContent.whatsappButton || {})
              },
              contact: {
                ...INITIAL_SITE_CONTENT.contact,
                ...(cloudContent.contact || {})
              },
              footer: {
                ...INITIAL_SITE_CONTENT.footer,
                ...(cloudContent.footer || {})
              } as FooterConfig,
              storeCategories: cloudContent.storeCategories || INITIAL_SITE_CONTENT.storeCategories,
              paymentConfig: cloudContent.paymentConfig || INITIAL_SITE_CONTENT.paymentConfig,
              coupons: cloudContent.coupons || INITIAL_SITE_CONTENT.coupons,
              showTrustMetrics: mergedVisibility.showTrustMetrics,
              visibility: mergedVisibility,
              _lastUpdated: cloudTs || Date.now()
            };
            setSiteContent(updatedContent);
            try {
              localStorage.setItem('lumesa_site_content', JSON.stringify(updatedContent));
            } catch {}
          }
        }
        if (cloudProducts && cloudProducts.length > 0) {
          setProducts(cloudProducts);
        }
        if (cloudOrders && cloudOrders.length > 0) {
          setOrders(cloudOrders);
        }
      } catch (err) {
        console.warn('Supabase initial fetch skipped:', err);
      }
    }
    loadCloudData();
    return () => { isMounted = false; };
  }, []);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: products[0] || PRODUCTS[0],
      quantity: 1,
      acquisitionType: 'renta'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Public modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([
    products[0] || PRODUCTS[0],
    products[2] || PRODUCTS[2]
  ]);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);

  // Admin modals
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [orderToInspect, setOrderToInspect] = useState<OrderDetails | null>(null);

  // Global search and prefill
  const [searchQuery, setSearchQuery] = useState('');
  const [prefilledContactSubject, setPrefilledContactSubject] = useState('');

  // Sync section with browser history / hash
  const navigateToSection = (section: AppSection) => {
    setActiveSection(section);
    window.location.hash = section;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppSection;
      const validSections: AppSection[] = [
        'inicio', 
        'nosotros', 
        'renta_venta', 
        'hardware', 
        'software', 
        'tienda', 
        'contacto',
        'admin'
      ];
      if (validSections.includes(hash)) {
        setActiveSection(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Cart Handlers
  const handleAddToCart = (product: Product, acquisitionType: 'compra' | 'renta' = 'compra') => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.acquisitionType === acquisitionType
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevItems, { product, quantity: 1, acquisitionType }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number, acquisitionType: 'compra' | 'renta') => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId && item.acquisitionType === acquisitionType) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string, acquisitionType: 'compra' | 'renta') => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.acquisitionType === acquisitionType)
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // When customer completes checkout, register order into Admin Dashboard & Supabase
  const handleOrderCreated = (newOrder: OrderDetails) => {
    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToSupabase(newOrder).catch((e) => console.warn('Supabase saveOrder error:', e));
  };

  // Comparator Handlers
  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveCompared = (productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearAllCompared = () => {
    setComparedProducts([]);
  };

  // Cross-navigation triggers
  const handleConsultation = (subject: string) => {
    setPrefilledContactSubject(subject);
    navigateToSection('contacto');
  };

  const handleQuoteRentalCalculation = (details: { format: string; mode: string; volume: number; estimatedPrice: number }) => {
    setPrefilledContactSubject(
      `Cotización formal de Renta: ${details.format}, ${details.mode}, ${details.volume.toLocaleString()} págs/mes (Estimado $${details.estimatedPrice.toLocaleString()} MXN)`
    );
    navigateToSection('contacto');
  };

  // ==========================================
  // ADMIN DASHBOARD CRUD ACTIONS (SYNCED TO LOCAL + SUPABASE)
  // ==========================================
  const handleSaveProduct = (product: Product) => {
    setProducts((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === product.id);
      if (existsIndex > -1) {
        const copy = [...prev];
        copy[existsIndex] = product;
        return copy;
      }
      return [product, ...prev];
    });
    setIsProductFormOpen(false);
    setProductToEdit(null);
    saveProductToSupabase(product).catch((e) => console.warn('Supabase saveProduct error:', e));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromSupabase(productId).catch((e) => console.warn('Supabase deleteProduct error:', e));
  };

  const handleUpdateOrderStatus = (
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string,
    invoiceStatus?: 'pendiente' | 'emitida' | 'no_requerida',
    invoicePdfUrl?: string,
    invoiceXmlUrl?: string,
    internalNotes?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          return {
            ...ord,
            status,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : ord.trackingNumber,
            invoiceStatus: invoiceStatus !== undefined ? invoiceStatus : ord.invoiceStatus,
            invoicePdfUrl: invoicePdfUrl !== undefined ? invoicePdfUrl : ord.invoicePdfUrl,
            invoiceXmlUrl: invoiceXmlUrl !== undefined ? invoiceXmlUrl : ord.invoiceXmlUrl,
            internalNotes: internalNotes !== undefined ? internalNotes : ord.internalNotes
          };
        }
        return ord;
      })
    );
    updateOrderStatusInSupabase(orderId, status, trackingNumber, invoiceStatus, invoicePdfUrl, invoiceXmlUrl, internalNotes).catch((e) => console.warn('Supabase updateOrderStatus error:', e));
  };

  const handleSaveSiteContent = async (newContent: SiteContent): Promise<boolean> => {
    const withTimestamp: SiteContent = {
      ...newContent,
      _lastUpdated: Date.now()
    };
    setSiteContent(withTimestamp);
    try {
      localStorage.setItem('lumesa_site_content', JSON.stringify(withTimestamp));
    } catch (e) {
      console.warn('localStorage saveSiteContent error:', e);
    }
    try {
      const ok = await saveSiteContentToSupabase(withTimestamp);
      return ok;
    } catch (e) {
      console.warn('Supabase saveSiteContent error:', e);
      return false;
    }
  };

  const handleResetFactoryData = () => {
    setProducts(PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setSiteContent(INITIAL_SITE_CONTENT);
    setCurrentUser(INITIAL_ADMIN_USERS[0]);
    localStorage.removeItem('lumesa_products');
    localStorage.removeItem('lumesa_orders');
    localStorage.removeItem('lumesa_site_content');
    localStorage.removeItem('lumesa_current_admin');
  };

  const handleChangeAdminRole = (role: AdminRole) => {
    const userForRole = INITIAL_ADMIN_USERS.find((u) => u.role === role) || INITIAL_ADMIN_USERS[0];
    setCurrentUser(userForRole);
  };

  const sectionTitles: Record<AppSection, string> = {
    inicio: 'Inicio',
    nosotros: 'Sobre Nosotros & Qué Hacemos',
    renta_venta: 'Renta / Venta de Equipos',
    hardware: 'Renta / Venta de Equipos',
    software: 'Software Kyocera',
    tienda: 'Tienda en Línea',
    contacto: 'Contacto & Asesoría Directa',
    admin: 'Panel de Control (Admin Autoadministrable)'
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#F27C36] selection:text-white">
      {/* LUMESA Splash Screen with clean un-encapsulated logo */}
      <SplashScreen />

      {/* Header (LUMESA Corporate Deep Navy #182F4F with #F27C36 accents and PWA button) - Only visible on public site */}
      {activeSection !== 'admin' && (
        <Header
          activeSection={activeSection}
          onSelectSection={navigateToSection}
          cartItems={cartItems}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenQuickQuote={() => navigateToSection('contacto')}
          onOpenAdmin={() => {
            navigateToSection('admin');
          }}
          onSelectRoleAndOpenAdmin={(role) => {
            handleChangeAdminRole(role);
            navigateToSection('admin');
          }}
          currentUser={currentUser}
          showSoftware={siteContent.visibility?.showSoftwareSection ?? false}
        />
      )}

      {/* Breadcrumb Navigation when viewing an internal separate section (hidden on Home / Tienda) */}
      {activeSection !== 'tienda' && activeSection !== 'inicio' && activeSection !== 'admin' && (
        <div className="bg-[#182F4F] text-white border-b border-[#394B61] py-2.5 sm:py-3 px-3 sm:px-6 lg:px-8 shadow-sm overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs gap-2 min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-slate-300 min-w-0 truncate">
              <button 
                onClick={() => navigateToSection('tienda')}
                className="hover:text-white transition shrink-0"
              >
                Tienda
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#F27C36] shrink-0" />
              <span className="text-[#F27C36] font-bold truncate">
                {sectionTitles[activeSection]}
              </span>
            </div>

            <button
              onClick={() => navigateToSection('tienda')}
              className="text-slate-300 hover:text-white flex items-center space-x-1 shrink-0 text-[11px] sm:text-xs"
            >
              <span>← Volver</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEW: RENDERS ONLY THE ACTIVE INDEPENDENT SECTION */}
      <main className="flex-1">
        {/* ========================================================= */}
        {/* 1. SECCIÓN INDEPENDIENTE: INICIO CON SLIDER Y CMS VIVO */}
        {/* ========================================================= */}
        {activeSection === 'inicio' && (
          <div>
            {/* Slider Principal con textos dinámicos del CMS */}
            <HeroSlider 
              onNavigate={navigateToSection} 
              slides={siteContent.slides}
              showImages={siteContent.visibility?.showSlideImages ?? true}
            />

            {/* Métricas de Experiencia dinámicas (activables/desactivables desde el CMS) */}
            {(siteContent.visibility?.showTrustMetrics ?? siteContent.showTrustMetrics ?? false) && (
              <TrustStats metrics={siteContent.trustMetrics} />
            )}

            {/* Portales Rápidos a las Secciones Separadas (Activable/Desactivable desde CMS) */}
            {(siteContent.visibility?.showQuickPortals ?? true) && (
              <section className="py-16 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F27C36] block mb-1">
                      Plataforma Integral LUMESA
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#182F4F] tracking-tight">
                      Explora Nuestras Soluciones Documentales
                    </h3>
                    <p className="text-xs sm:text-sm text-[#394B61] mt-2">
                      Accede de forma directa e independiente a cada área de nuestro catálogo y servicios especializados.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Tienda en Línea */}
                    <div 
                      onClick={() => navigateToSection('tienda')}
                      className="p-6 rounded-3xl bg-[#182F4F] text-white border border-[#394B61] hover:border-[#F27C36] hover:shadow-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#000000]/50 border border-[#394B61] flex items-center justify-center mb-4">
                          <Store className="w-6 h-6 text-[#F27C36]" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#F27C36] transition">
                          Tienda en Línea
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Compra tu equipo en línea o solicita una cotización de renta.
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-[#394B61] flex items-center justify-between text-xs font-bold text-[#F27C36]">
                        <span>Ir a la Tienda</span>
                        <ArrowRight className="w-4 h-4 text-[#F27C36] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 2: Renta / Venta */}
                    <div 
                      onClick={() => navigateToSection('renta_venta')}
                      className="p-6 rounded-3xl bg-[#182F4F] text-white border border-[#394B61] hover:border-[#F27C36] hover:shadow-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#000000]/50 border border-[#394B61] flex items-center justify-center mb-4">
                          <Printer className="w-6 h-6 text-[#F27C36]" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#F27C36] transition">
                          Renta / Venta
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Multifuncionales e impresoras láser para cada tamaño de oficina, en renta o en venta.
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-[#394B61] flex items-center justify-between text-xs font-bold text-[#F27C36]">
                        <span>Ver Equipos</span>
                        <ArrowRight className="w-4 h-4 text-[#F27C36] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 3: Nosotros */}
                    <div 
                      onClick={() => navigateToSection('nosotros')}
                      className="p-6 rounded-3xl bg-[#182F4F] text-white border border-[#394B61] hover:border-[#F27C36] hover:shadow-2xl transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-[#000000]/50 border border-[#394B61] flex items-center justify-center mb-4">
                          <Building2 className="w-6 h-6 text-[#F27C36]" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#F27C36] transition">
                          Nosotros
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          LUMESA: Asesoría personalizada, soporte técnico y soluciones de impresión a tu medida.
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-[#394B61] flex items-center justify-between text-xs font-bold text-[#F27C36]">
                        <span>Conocer Más</span>
                        <ArrowRight className="w-4 h-4 text-[#F27C36] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. SECCIÓN INDEPENDIENTE: TIENDA EN LÍNEA */}
        {/* ========================================================= */}
        {activeSection === 'tienda' && (
          <OnlineStoreSection
            products={products}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={(prod) => setSelectedProduct(prod)}
            initialSearchQuery={searchQuery}
            categories={siteContent.storeCategories}
          />
        )}

        {/* ========================================================= */}
        {/* 3. SECCIÓN INDEPENDIENTE: RENTA / VENTA (HARDWARE & EQUIPOS) */}
        {/* ========================================================= */}
        {(activeSection === 'renta_venta' || activeSection === 'hardware') && (
          <HardwareCatalog
            products={products}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={(prod) => setSelectedProduct(prod)}
            comparedProducts={comparedProducts}
            onToggleCompare={handleToggleCompare}
            onOpenComparator={() => setIsComparatorOpen(true)}
            content={siteContent.hardwareSection}
          />
        )}

        {/* ========================================================= */}
        {/* 4. SECCIÓN INDEPENDIENTE: SOFTWARE KYOCERA */}
        {/* ========================================================= */}
        {activeSection === 'software' && (
          (siteContent.visibility?.showSoftwareSection ?? false) ? (
            <SoftwareSolutionsSection
              onOpenConsultation={handleConsultation}
              content={siteContent.softwareSection}
            />
          ) : (
            <div className="py-24 px-4 text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-[#182F4F] text-[#F27C36] flex items-center justify-center mx-auto mb-6 border border-[#394B61] shadow-xl">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#182F4F] mb-3">
                Módulo de Software Kyocera Temporalmente Inactivo
              </h3>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Esta sección se encuentra temporalmente en pausa por la administración. Puede explorar nuestro catálogo de multifuncionales en renta/venta o visitar la tienda en línea.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigateToSection('tienda')}
                  className="px-6 py-3 bg-[#F27C36] hover:bg-[#d96726] text-white rounded-xl font-bold text-sm shadow-md transition"
                >
                  Ir a la Tienda en Línea
                </button>
                <button
                  onClick={() => navigateToSection('renta_venta')}
                  className="px-6 py-3 bg-[#182F4F] hover:bg-[#000000] text-white rounded-xl font-bold text-sm shadow-md transition"
                >
                  Ver Renta y Venta
                </button>
              </div>
            </div>
          )
        )}

        {/* ========================================================= */}
        {/* 7. SECCIÓN INDEPENDIENTE: SOBRE NOSOTROS & QUÉ HACEMOS */}
        {/* ========================================================= */}
        {activeSection === 'nosotros' && (
          <div>
            <AboutSection 
              content={siteContent.about} 
              visibility={siteContent.visibility}
              onNavigate={navigateToSection}
            />
            {(siteContent.visibility?.showCoverageMap ?? true) && (
              <CoverageMapSection 
                content={siteContent.coverage}
                onContact={() => navigateToSection('contacto')}
              />
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 8. SECCIÓN INDEPENDIENTE: CONTACTO & COTIZACIONES */}
        {/* ========================================================= */}
        {activeSection === 'contacto' && (
          <div>
            <ContactSection 
              prefilledSubject={prefilledContactSubject} 
              contactInfo={siteContent.contact}
            />
            {(siteContent.visibility?.showCoverageMap ?? true) && (
              <CoverageMapSection 
                content={siteContent.coverage}
                onContact={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 9. SECCIÓN INDEPENDIENTE: PANEL DE CONTROL ADMINISTRATIVO */}
        {/* ========================================================= */}
        {activeSection === 'admin' && (
          <AdminDashboard
            currentUser={currentUser || INITIAL_ADMIN_USERS[0]}
            onLogout={() => {
              setCurrentUser(null);
              setIsAdminLoginOpen(true);
            }}
            onExitToPublicSite={() => navigateToSection('tienda')}
            products={products}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            siteContent={siteContent}
            onSaveSiteContent={handleSaveSiteContent}
            onResetFactoryData={handleResetFactoryData}
            onOpenNewProductModal={() => {
              setProductToEdit(null);
              setIsProductFormOpen(true);
            }}
            onOpenEditProductModal={(prod) => {
              setProductToEdit(prod);
              setIsProductFormOpen(true);
            }}
            onOpenOrderDetailModal={(ord) => {
              setOrderToInspect(ord);
              setIsOrderDetailOpen(true);
            }}
            onChangeRole={handleChangeAdminRole}
          />
        )}
      </main>

      {/* Footer Corporativo */}
      {activeSection !== 'admin' && (
        <Footer 
          onSelectSection={navigateToSection} 
          showSoftware={siteContent.visibility?.showSoftwareSection ?? false}
          footerContent={siteContent.footer}
        />
      )}

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
        paymentConfig={siteContent.paymentConfig}
        coupons={siteContent.coupons}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isCompared={selectedProduct ? comparedProducts.some((p) => p.id === selectedProduct.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      <ProductComparatorModal
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        comparedProducts={comparedProducts}
        onRemoveProduct={handleRemoveCompared}
        onClearAll={handleClearAllCompared}
        onAddToCart={handleAddToCart}
      />

      {/* Admin Specific Modals */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          navigateToSection('admin');
        }}
      />

      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSave={handleSaveProduct}
        categories={siteContent.storeCategories}
      />

      <OrderDetailModal
        isOpen={isOrderDetailOpen}
        onClose={() => {
          setIsOrderDetailOpen(false);
          setOrderToInspect(null);
        }}
        order={orderToInspect}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* Floating PWA Installation prompt on bottom-left for visitors */}
      {activeSection !== 'admin' && (
        <PWAInstallButton variant="floating" />
      )}

      {/* Floating Shopping Cart Button (Always accessible on public sections) */}
      {activeSection !== 'admin' && (
        <aside aria-label="Carrito flotante" className="fixed bottom-22 right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="group relative flex items-center space-x-2 bg-[#182F4F] hover:bg-[#394B61] active:bg-[#000000] text-white p-3.5 sm:px-4 sm:py-3 rounded-full border border-[#394B61] hover:border-[#F27C36] shadow-2xl transition transform hover:scale-105"
            title="Ver Carrito de Compras LUMESA"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#F27C36] shrink-0" />
            <span className="hidden sm:inline text-xs font-bold tracking-wide">
              Carrito ({cartItems.reduce((acc, it) => acc + it.quantity, 0)})
            </span>
            {cartItems.reduce((acc, it) => acc + it.quantity, 0) > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-[#F27C36] text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-[#F27C36]/50 animate-bounce">
                {cartItems.reduce((acc, it) => acc + it.quantity, 0)}
              </span>
            )}
          </button>
        </aside>
      )}

      {/* Floating WhatsApp Action Button */}
      {activeSection !== 'admin' && siteContent.whatsappButton?.enabled !== false && (
        <aside aria-label="Contacto rápido" className="fixed bottom-6 right-6 z-40">
          <a
            href={`https://wa.me/${(siteContent.whatsappButton?.phone || siteContent.contact.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(siteContent.whatsappButton?.defaultMessage || 'Hola LUMESA, me comunico desde la página web para solicitar cotización y asesoría.')}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-600/40 transition transform hover:scale-105 cursor-pointer"
            title="Atención directa por WhatsApp LUMESA"
          >
            <MessageCircle className="w-6 h-6 shrink-0" />
            <span className="hidden sm:inline text-xs font-bold tracking-wide">
              {siteContent.whatsappButton?.label || 'WhatsApp Asesor LUMESA'}
            </span>
          </a>
        </aside>
      )}
    </div>
  );
}
