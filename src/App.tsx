import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { TrustStats } from './components/TrustStats';
import { AboutSection } from './components/AboutSection';
import { HardwareCatalog } from './components/HardwareCatalog';
import { OnlineStoreSection } from './components/OnlineStoreSection';
import { SoftwareSolutionsSection } from './components/SoftwareSolutionsSection';
import { RentalCalculatorSection } from './components/RentalCalculatorSection';
import { TechnicalSupportSection } from './components/TechnicalSupportSection';
import { CoverageMapSection } from './components/CoverageMapSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductComparatorModal } from './components/ProductComparatorModal';
import { PRODUCTS } from './data/mockData';
import { AppSection, CartItem, Product } from './types';
import { 
  MessageCircle, 
  Store, 
  Printer, 
  Calculator, 
  Cpu, 
  Clock, 
  Building2, 
  PhoneCall, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck,
  ShoppingCart
} from 'lucide-react';

export default function App() {
  // Navigation: SEPARATE INDEPENDENT SECTIONS
  const [activeSection, setActiveSection] = useState<AppSection>(() => {
    const hash = window.location.hash.replace('#', '') as AppSection;
    const validSections: AppSection[] = ['inicio', 'tienda', 'hardware', 'renta', 'software', 'soporte', 'nosotros', 'contacto'];
    return validSections.includes(hash) ? hash : 'inicio';
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // TASKalfa 3554ci
      quantity: 1,
      acquisitionType: 'renta'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([
    PRODUCTS[0],
    PRODUCTS[2]
  ]);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);

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
      const validSections: AppSection[] = ['inicio', 'tienda', 'hardware', 'renta', 'software', 'soporte', 'nosotros', 'contacto'];
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

  // Comparator Handlers
  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 5) {
        alert('Puede comparar un máximo de 5 productos simultáneamente.');
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

  const sectionTitles: Record<AppSection, string> = {
    inicio: 'Inicio',
    tienda: 'Tienda en Línea',
    hardware: 'Hardware & Equipos',
    renta: 'Renta de Equipos',
    software: 'Software Kyocera',
    soporte: 'Soporte Técnico Especializado < 24h',
    nosotros: 'Sobre Nosotros & Qué Hacemos',
    contacto: 'Contacto & Asesoría Directa'
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-black selection:text-white">
      {/* Header (Black, responsive with logo and section navigation) */}
      <Header
        activeSection={activeSection}
        onSelectSection={navigateToSection}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuickQuote={() => navigateToSection('renta')}
      />

      {/* Breadcrumb Navigation when viewing an internal separate section */}
      {activeSection !== 'inicio' && (
        <div className="bg-neutral-950 text-white border-b border-neutral-800 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-neutral-400">
              <button 
                onClick={() => navigateToSection('inicio')}
                className="hover:text-white transition"
              >
                Inicio
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              <span className="text-white font-bold">
                {sectionTitles[activeSection]}
              </span>
            </div>

            <button
              onClick={() => navigateToSection('inicio')}
              className="text-neutral-400 hover:text-white flex items-center space-x-1"
            >
              <span>← Volver al Menú Principal</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEW: RENDERS ONLY THE ACTIVE INDEPENDENT SECTION */}
      <main className="flex-1">
        {activeSection === 'inicio' && (
          <div>
            {/* 1. Slider Principal (3 slides) */}
            <HeroSlider onNavigate={navigateToSection} />

            {/* 2. Métricas de Experiencia */}
            <TrustStats />

            {/* 3. Portales Rápidos a las Secciones Separadas */}
            <section className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-500 block mb-1">
                    Plataforma Integral Printmax
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                    Explora Nuestras Soluciones Documentales
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2">
                    Accede de forma directa e independiente a cada área de nuestro catálogo y servicios especializados.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1: Tienda */}
                  <div 
                    onClick={() => navigateToSection('tienda')}
                    className="p-6 rounded-3xl bg-black text-white border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                        <Store className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
                        Tienda en Línea
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Compra directa de multifuncionales, cartuchos de tóner genuino y kits con facturación CFDI 4.0 inmediata.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-bold text-blue-400">
                      <span>Ver Tienda</span>
                      <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: Hardware */}
                  <div 
                    onClick={() => navigateToSection('hardware')}
                    className="p-6 rounded-3xl bg-black text-white border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                        <Printer className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
                        Hardware & Equipos
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Multifuncionales A3, A4, impresoras láser ECOSYS y prensas de producción TASKalfa con comparador técnico.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-bold text-blue-400">
                      <span>Ver Catálogo</span>
                      <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3: Renta */}
                  <div 
                    onClick={() => navigateToSection('renta')}
                    className="p-6 rounded-3xl bg-black text-white border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                        <Calculator className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
                        Renta de Equipos
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Arrendamiento 100% deducible de impuestos con tóner original, refacciones y soporte en menos de 24h incluidos.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-bold text-blue-400">
                      <span>Simulador de Renta</span>
                      <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 4: Software */}
                  <div 
                    onClick={() => navigateToSection('software')}
                    className="p-6 rounded-3xl bg-black text-white border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                        <Cpu className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
                        Software Kyocera
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Control de costos MyQ, Net Manager, automatización DMConnect y monitoreo proactivo Fleet Services.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-bold text-blue-400">
                      <span>Ver Software</span>
                      <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 5: Soporte Técnico */}
                  <div 
                    onClick={() => navigateToSection('soporte')}
                    className="p-6 rounded-3xl bg-black text-white border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
                        Soporte & Pólizas
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Asistencia en sitio en &lt; 24h, ingenieros certificados y pólizas anuales con 15% de descuento en refacciones.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-bold text-blue-400">
                      <span>Planes de Soporte</span>
                      <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 6: Nosotros */}
                  <div 
                    onClick={() => navigateToSection('nosotros')}
                    className="p-6 rounded-3xl bg-black text-white border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
                        Sobre Nosotros
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Centro de distribución oficial de Kyocera Japón con sede en San Luis Potosí y cobertura en todo México.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-bold text-blue-400">
                      <span>Conocer Más</span>
                      <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. SECCIÓN INDEPENDIENTE: TIENDA EN LÍNEA */}
        {activeSection === 'tienda' && (
          <OnlineStoreSection
            products={PRODUCTS}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={(prod) => setSelectedProduct(prod)}
            initialSearchQuery={searchQuery}
          />
        )}

        {/* 3. SECCIÓN INDEPENDIENTE: HARDWARE & EQUIPOS */}
        {activeSection === 'hardware' && (
          <HardwareCatalog
            products={PRODUCTS}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={(prod) => setSelectedProduct(prod)}
            comparedProducts={comparedProducts}
            onToggleCompare={handleToggleCompare}
            onOpenComparator={() => setIsComparatorOpen(true)}
          />
        )}

        {/* 4. SECCIÓN INDEPENDIENTE: RENTA DE EQUIPOS */}
        {activeSection === 'renta' && (
          <RentalCalculatorSection
            onQuoteRental={handleQuoteRentalCalculation}
          />
        )}

        {/* 5. SECCIÓN INDEPENDIENTE: SOFTWARE KYOCERA */}
        {activeSection === 'software' && (
          <SoftwareSolutionsSection
            onOpenConsultation={handleConsultation}
          />
        )}

        {/* 6. SECCIÓN INDEPENDIENTE: SOPORTE TÉCNICO Y PÓLIZAS */}
        {activeSection === 'soporte' && (
          <TechnicalSupportSection
            onSelectPolicy={(policyName) => handleConsultation(`Contratación de: ${policyName}`)}
          />
        )}

        {/* 7. SECCIÓN INDEPENDIENTE: SOBRE NOSOTROS & QUÉ HACEMOS */}
        {activeSection === 'nosotros' && (
          <div>
            <AboutSection />
            <CoverageMapSection />
          </div>
        )}

        {/* 8. SECCIÓN INDEPENDIENTE: CONTACTO & COTIZACIONES */}
        {activeSection === 'contacto' && (
          <div>
            <ContactSection prefilledSubject={prefilledContactSubject} />
            <CoverageMapSection />
          </div>
        )}
      </main>

      {/* Footer Corporativo */}
      <Footer onSelectSection={navigateToSection} />

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

      {/* Floating Shopping Cart Button (Always accessible) */}
      <aside aria-label="Carrito flotante" className="fixed bottom-22 right-6 z-40">
        <button
          onClick={() => setIsCartOpen(true)}
          className="group relative flex items-center space-x-2 bg-black hover:bg-neutral-900 active:bg-neutral-950 text-white p-3.5 sm:px-4 sm:py-3 rounded-full border border-neutral-700 hover:border-blue-500 shadow-2xl transition transform hover:scale-105"
          title="Ver Carrito de Compras"
        >
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 shrink-0" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Carrito ({cartItems.reduce((acc, it) => acc + it.quantity, 0)})
          </span>
          {cartItems.reduce((acc, it) => acc + it.quantity, 0) > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-600/50 animate-bounce">
              {cartItems.reduce((acc, it) => acc + it.quantity, 0)}
            </span>
          )}
        </button>
      </aside>

      {/* Floating WhatsApp Action Button */}
      <aside aria-label="Contacto rápido" className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/524448123000?text=Hola,%20me%20comunico%20desde%20la%20pagina%20web%20de%20PrintMax%20Kyocera%20para%20solicitar%20asesoria."
          target="_blank"
          rel="noreferrer"
          className="group flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-600/40 transition transform hover:scale-105"
          title="Atención directa por WhatsApp"
        >
          <MessageCircle className="w-6 h-6 shrink-0" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            WhatsApp Asesor Kyocera
          </span>
        </a>
      </aside>
    </div>
  );
}
