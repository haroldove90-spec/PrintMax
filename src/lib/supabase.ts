import { createClient } from '@supabase/supabase-js';
import { SiteContent, Product, OrderDetails, OrderStatus } from '../types';

export const SUPABASE_URL = 'https://mzxmiwvesflacxxerlxl.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_pvTWBDSQh30B6D-yBxUlnQ_RBEymjgM';
export const SUPABASE_PROJECT_ID = 'mzxmiwvesflacxxerlxl';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Test connection
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; tables: string[] }> {
  try {
    // Try pinging site_content table
    const { data, error } = await supabase
      .from('site_content')
      .select('id')
      .limit(1);

    if (error) {
      // Table might not exist yet
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Conexión a Supabase exitosa, pero las tablas aún no se han creado. Por favor ejecuta el script SQL en Supabase.',
          tables: []
        };
      }
      return {
        success: false,
        message: `Error de Supabase: ${error.message} (Código ${error.code})`,
        tables: []
      };
    }

    return {
      success: true,
      message: 'Conexión a Supabase establecida correctamente y tabla site_content activa.',
      tables: ['site_content', 'products', 'orders']
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `No se pudo conectar a Supabase: ${errorMsg}`,
      tables: []
    };
  }
}

// ==========================================
// SITE CONTENT API
// ==========================================
export async function fetchSiteContentFromSupabase(): Promise<SiteContent | null> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'lumesa_main')
      .single();

    if (error) {
      console.warn('Supabase site_content fetch error (using local fallback):', error.message);
      return null;
    }

    if (data && data.content) {
      return data.content as SiteContent;
    }
    return null;
  } catch (err) {
    console.warn('Supabase site_content network error:', err);
    return null;
  }
}

export async function saveSiteContentToSupabase(content: SiteContent): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({
        id: 'lumesa_main',
        content,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase saveSiteContent error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveSiteContent exception:', err);
    return false;
  }
}

// ==========================================
// PRODUCTS API
// ==========================================
export const SUPABASE_PRODUCT_IMAGES_BUCKET = 'product-images';

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase products fetch error:', error.message);
      return null;
    }

    if (Array.isArray(data)) {
      return data.map((item: any) => {
        const parsedSpecs = typeof item.specs === 'string' ? JSON.parse(item.specs) : (item.specs || {});
        const price = Number(item.price || 0);
        const rentalPriceMonthly = item.rental_price_monthly ? Number(item.rental_price_monthly) : undefined;
        const specListing = parsedSpecs?.listingType || item.listing_type;
        const listingType =
          specListing === 'venta' || specListing === 'renta' || specListing === 'ambos'
            ? specListing
            : (rentalPriceMonthly && rentalPriceMonthly > 0 && price <= 0
                ? 'renta'
                : rentalPriceMonthly && rentalPriceMonthly > 0
                ? 'ambos'
                : 'venta');

        return {
          id: item.id,
          name: item.name,
          code: item.code,
          category: item.category,
          categoryLabel: item.category_label || item.categoryLabel || '',
          listingType,
          price,
          rentalPriceMonthly,
          badge: item.badge || undefined,
          shortDescription: item.short_description || item.shortDescription || '',
          description: item.description || '',
          image: item.image || '',
          specs: parsedSpecs,
          features: Array.isArray(item.features) ? item.features : [],
          active: item.active !== undefined ? Boolean(item.active) : true,
          inStock: Boolean(item.in_stock ?? item.inStock ?? true),
          stockQuantity: item.stock_quantity !== undefined && item.stock_quantity !== null ? Number(item.stock_quantity) : item.stockQuantity,
          minStockAlert: item.min_stock_alert !== undefined && item.min_stock_alert !== null ? Number(item.min_stock_alert) : item.minStockAlert,
          datasheetUrl: item.datasheet_url || item.datasheetUrl || undefined,
          rating: Number(item.rating || 5.0),
          reviewsCount: Number(item.reviews_count || item.reviewsCount || 0),
          originalRef: item.original_ref || item.originalRef || undefined
        };
      });
    }
    return [];
  } catch (err) {
    console.warn('Supabase products exception:', err);
    return null;
  }
}

function mapProductToDbRow(product: Product) {
  const listingType = product.listingType || (
    product.rentalPriceMonthly && product.rentalPriceMonthly > 0 && !(product.price > 0)
      ? 'renta'
      : product.rentalPriceMonthly && product.rentalPriceMonthly > 0
      ? 'ambos'
      : 'venta'
  );
  return {
    id: product.id,
    name: product.name,
    code: product.code,
    category: product.category,
    category_label: product.categoryLabel || '',
    price: Number(product.price) || 0,
    rental_price_monthly: product.rentalPriceMonthly ? Number(product.rentalPriceMonthly) : null,
    badge: product.badge || null,
    short_description: product.shortDescription || '',
    description: product.description || '',
    image: product.image || '',
    specs: {
      ...(product.specs || {}),
      listingType
    },
    features: product.features || [],
    active: product.active !== false,
    in_stock: product.inStock ?? true,
    stock_quantity: product.stockQuantity ?? (product.inStock ? 5 : 0),
    min_stock_alert: product.minStockAlert ?? 2,
    datasheet_url: product.datasheetUrl || null,
    rating: product.rating ?? 5.0,
    reviews_count: product.reviewsCount ?? 0,
    original_ref: product.originalRef || null,
    updated_at: new Date().toISOString()
  };
}

export async function saveProductToSupabase(product: Product): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .upsert(mapProductToDbRow(product), { onConflict: 'id' });

    if (error) {
      console.error('Supabase saveProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveProduct exception:', err);
    return false;
  }
}

export async function saveProductsBatchToSupabase(
  productsList: Product[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!productsList.length) return { success: true, count: 0 };
  try {
    // Deduplicate by id so PostgreSQL ON CONFLICT DO UPDATE never fails on duplicate IDs
    const uniqueById = new Map<string, Product>();
    for (const p of productsList) {
      uniqueById.set(p.id, p);
    }
    const dedupedList = Array.from(uniqueById.values());

    const chunkSize = 50;
    let totalSaved = 0;
    for (let i = 0; i < dedupedList.length; i += chunkSize) {
      const chunk = dedupedList.slice(i, i + chunkSize).map(mapProductToDbRow);
      const { error } = await supabase
        .from('products')
        .upsert(chunk, { onConflict: 'id' });

      if (error) {
        return { success: false, count: totalSaved, error: error.message };
      }
      totalSaved += chunk.length;
    }
    return { success: true, count: totalSaved };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, count: 0, error: msg };
  }
}

export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Supabase deleteProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteProduct exception:', err);
    return false;
  }
}

export async function deleteAllProductsFromSupabase(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .neq('id', '');

    if (error) {
      console.error('Supabase deleteAllProducts error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteAllProducts exception:', err);
    return false;
  }
}

export async function uploadProductImageToSupabase(
  file: File,
  skuOrCode?: string
): Promise<{ url?: string; error?: string }> {
  try {
    if (!file.type.startsWith('image/')) {
      return { error: 'Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'La imagen supera el límite de 5 MB. Comprímela antes de subirla.' };
    }

    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    const cleanSku = (skuOrCode || 'producto')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'producto';
    const filePath = `productos/${cleanSku}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_PRODUCT_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      if (uploadError.message.toLowerCase().includes('bucket') || uploadError.message.toLowerCase().includes('not found')) {
        return {
          error: `El bucket "${SUPABASE_PRODUCT_IMAGES_BUCKET}" aún no existe en Supabase Storage. Ejecuta el Script SQL actualizado en tu panel Supabase.`
        };
      }
      return { error: `Error al subir imagen a Supabase: ${uploadError.message}` };
    }

    const { data } = supabase.storage
      .from(SUPABASE_PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      return { error: 'Se subió el archivo pero no se pudo obtener la URL pública.' };
    }

    return { url: data.publicUrl };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Error inesperado al subir imagen: ${msg}` };
  }
}

// ==========================================
// ORDERS API
// ==========================================
export async function fetchOrdersFromSupabase(): Promise<OrderDetails[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase orders fetch error:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        orderId: item.order_id || item.orderId || item.id,
        customerName: item.customer_name || item.customerName,
        companyName: item.company_name || item.companyName,
        rfc: item.rfc,
        cfdiUse: item.cfdi_use || item.cfdiUse,
        taxRegime: item.tax_regime || item.taxRegime,
        email: item.email,
        phone: item.phone,
        address: item.address,
        city: item.city,
        state: item.state,
        postalCode: item.postal_code || item.postalCode,
        paymentMethod: item.payment_method || item.paymentMethod,
        items: typeof item.items === 'string' ? JSON.parse(item.items) : (item.items || []),
        subtotal: Number(item.subtotal),
        tax: Number(item.tax),
        shipping: Number(item.shipping || 0),
        discountCoupon: item.discount_coupon || item.discountCoupon,
        discountAmount: item.discount_amount ? Number(item.discount_amount) : item.discountAmount,
        total: Number(item.total),
        date: item.date || new Date(item.created_at).toLocaleString(),
        status: item.status as OrderStatus,
        trackingNumber: item.tracking_number || item.trackingNumber,
        invoiceStatus: item.invoice_status || item.invoiceStatus || 'pendiente',
        invoicePdfUrl: item.invoice_pdf_url || item.invoicePdfUrl,
        invoiceXmlUrl: item.invoice_xml_url || item.invoiceXmlUrl,
        internalNotes: item.internal_notes || item.internalNotes,
        notes: item.notes
      }));
    }
    return null;
  } catch (err) {
    console.warn('Supabase orders exception:', err);
    return null;
  }
}

export async function saveOrderToSupabase(order: OrderDetails): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .upsert({
        order_id: order.orderId,
        customer_name: order.customerName,
        company_name: order.companyName,
        rfc: order.rfc,
        cfdi_use: order.cfdiUse || null,
        tax_regime: order.taxRegime || null,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city,
        state: order.state,
        postal_code: order.postalCode,
        payment_method: order.paymentMethod,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        discount_coupon: order.discountCoupon || null,
        discount_amount: order.discountAmount || 0,
        total: order.total,
        date: order.date,
        status: order.status,
        tracking_number: order.trackingNumber || null,
        invoice_status: order.invoiceStatus || 'pendiente',
        invoice_pdf_url: order.invoicePdfUrl || null,
        invoice_xml_url: order.invoiceXmlUrl || null,
        internal_notes: order.internalNotes || null,
        notes: order.notes || null,
        created_at: new Date().toISOString()
      }, { onConflict: 'order_id' });

    if (error) {
      console.error('Supabase saveOrder error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveOrder exception:', err);
    return false;
  }
}

export async function updateOrderStatusInSupabase(
  orderId: string, 
  status: OrderStatus, 
  trackingNumber?: string,
  invoiceStatus?: 'pendiente' | 'emitida' | 'no_requerida',
  invoicePdfUrl?: string,
  invoiceXmlUrl?: string,
  internalNotes?: string
): Promise<boolean> {
  try {
    const updatePayload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString()
    };
    if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber;
    if (invoiceStatus !== undefined) updatePayload.invoice_status = invoiceStatus;
    if (invoicePdfUrl !== undefined) updatePayload.invoice_pdf_url = invoicePdfUrl;
    if (invoiceXmlUrl !== undefined) updatePayload.invoice_xml_url = invoiceXmlUrl;
    if (internalNotes !== undefined) updatePayload.internal_notes = internalNotes;

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('order_id', orderId);

    if (error) {
      console.error('Supabase updateOrderStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase updateOrderStatus exception:', err);
    return false;
  }
}
