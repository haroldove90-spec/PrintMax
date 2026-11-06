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
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: false });

    if (error) {
      console.warn('Supabase products fetch error:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      // Map database snake_case or json to Product interface
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        category: item.category,
        categoryLabel: item.category_label || item.categoryLabel,
        price: Number(item.price),
        rentalPriceMonthly: item.rental_price_monthly ? Number(item.rental_price_monthly) : undefined,
        badge: item.badge,
        shortDescription: item.short_description || item.shortDescription || '',
        description: item.description || '',
        image: item.image,
        specs: typeof item.specs === 'string' ? JSON.parse(item.specs) : (item.specs || {}),
        features: Array.isArray(item.features) ? item.features : [],
        inStock: Boolean(item.in_stock ?? item.inStock ?? true),
        rating: Number(item.rating || 5.0),
        reviewsCount: Number(item.reviews_count || item.reviewsCount || 0),
        originalRef: item.original_ref || item.originalRef
      }));
    }
    return null;
  } catch (err) {
    console.warn('Supabase products exception:', err);
    return null;
  }
}

export async function saveProductToSupabase(product: Product): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        name: product.name,
        code: product.code,
        category: product.category,
        category_label: product.categoryLabel,
        price: product.price,
        rental_price_monthly: product.rentalPriceMonthly || null,
        badge: product.badge || null,
        short_description: product.shortDescription,
        description: product.description,
        image: product.image,
        specs: product.specs,
        features: product.features,
        in_stock: product.inStock,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        original_ref: product.originalRef || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

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
        total: Number(item.total),
        date: item.date || new Date(item.created_at).toLocaleString(),
        status: item.status as OrderStatus,
        trackingNumber: item.tracking_number || item.trackingNumber,
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
        total: order.total,
        date: order.date,
        status: order.status,
        tracking_number: order.trackingNumber || null,
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
  trackingNumber?: string
): Promise<boolean> {
  try {
    const updatePayload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString()
    };
    if (trackingNumber !== undefined) {
      updatePayload.tracking_number = trackingNumber;
    }

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
