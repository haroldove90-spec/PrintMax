import React, { useState } from 'react';
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
import { CartItem, Product } from './types';
import { MessageCircle } from 'lucide-react';

export default function App() {
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Starter sample item so user immediately sees active cart capability
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
    PRODUCTS[0], // TASKalfa 3554ci
    PRODUCTS[2]  // ECOSYS M3655idn
  ]);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);

  // Global search and prefill
  const [searchQuery, setSearchQuery] = useState('');
  const [prefilledContactSubject, setPrefilledContactSubject] = useState('');

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

  // Navigation helpers for inter-section triggers
  const handleQuickQuote = () => {
    const el = document.getElementById('renta');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConsultation = (subject: string) => {
    setPrefilledContactSubject(subject);
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuoteRentalCalculation = (details: { format: string; mode: string; volume: number; estimatedPrice: number }) => {
    setPrefilledContactSubject(
      `Cotización formal de Renta: ${details.format}, ${details.mode}, ${details.volume.toLocaleString()} págs/mes (Estimado $${details.estimatedPrice.toLocaleString()} MXN)`
    );
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header (Black header matching logo) */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        comparedProducts={comparedProducts}
        onOpenComparator={() => setIsComparatorOpen(true)}
        onOpenQuickQuote={handleQuickQuote}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* Main Content Sections (Independientes y Separadas) */}
      <main className="flex-1">
        {/* 2. Hero Slider Principal (3 slides as requested) */}
        <HeroSlider />

        {/* 3. Indicadores de Confianza y Experiencia */}
        <TrustStats />

        {/* 4. Sección 1 & 2 & 3: Inicio, Qué Hacemos y Sobre Nosotros */}
        <AboutSection />

        {/* 5. Sección 4: Hardware - Impresoras y Multifuncionales A3 / A4 / Producción */}
        <HardwareCatalog
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onOpenProductDetail={(prod) => setSelectedProduct(prod)}
          comparedProducts={comparedProducts}
          onToggleCompare={handleToggleCompare}
          onOpenComparator={() => setIsComparatorOpen(true)}
        />

        {/* 6. Tienda en Línea Completa con Filtros y Precios con IVA */}
        <OnlineStoreSection
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onOpenProductDetail={(prod) => setSelectedProduct(prod)}
          initialSearchQuery={searchQuery}
        />

        {/* 7. Sección Software: Soluciones Inteligentes para tu Negocio */}
        <SoftwareSolutionsSection
          onOpenConsultation={handleConsultation}
        />

        {/* 8. Sección Servicios: Renta de Equipos & Calculadora Dinámica */}
        <RentalCalculatorSection
          onQuoteRental={handleQuoteRentalCalculation}
        />

        {/* 9. Sección Servicio Técnico Especializado en Menos de 24 Horas y Pólizas Anuales */}
        <TechnicalSupportSection
          onSelectPolicy={(policyName) => handleConsultation(`Contratación de: ${policyName}`)}
        />

        {/* 10. Centro de Distribución San Luis Potosí y Cobertura Nacional */}
        <CoverageMapSection />

        {/* 11. Sección Contacto: ¿En qué podemos ayudarte? */}
        <ContactSection
          prefilledSubject={prefilledContactSubject}
        />
      </main>

      {/* 12. Footer Corporativo */}
      <Footer />

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
