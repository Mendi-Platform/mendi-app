import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  Timestamp,
  DocumentReference
} from 'firebase/firestore';
import { firebaseApp } from '@/firebase/firebaseApp';
import type { FormData } from '@/types/formData';

const db = getFirestore(firebaseApp);

export type OrderStatus = 'pending' | 'paid' | 'failed';

export interface CartItemWithMeta extends FormData {
  id: string;
  title: string;
}

export interface Order {
  id: string;
  items: CartItemWithMeta[];
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryMethod: string;
  deliveryDetails?: {
    selectedStore?: string;
    selectedPosten?: string;
    syerMeetingPlace?: string;
  };
  customerEmail?: string;
  status: OrderStatus;
  stripeSessionId?: string;
  createdAt: Timestamp;
  paidAt?: Timestamp;
}

export interface CreateOrderData {
  items: CartItemWithMeta[];
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryMethod: string;
  deliveryDetails?: Order['deliveryDetails'];
  customerEmail?: string;
}

/**
 * Creates a new order in Firestore with 'pending' status
 */
export async function createOrder(data: CreateOrderData): Promise<string> {
  // Build order data, excluding undefined fields (Firestore doesn't accept undefined)
  const orderData: Record<string, unknown> = {
    items: data.items,
    subtotal: data.subtotal,
    shippingCost: data.shippingCost,
    total: data.total,
    deliveryMethod: data.deliveryMethod,
    status: 'pending',
    createdAt: Timestamp.now(),
  };

  // Only add optional fields if they have values
  if (data.deliveryDetails !== undefined) {
    orderData.deliveryDetails = data.deliveryDetails;
  }
  if (data.customerEmail !== undefined) {
    orderData.customerEmail = data.customerEmail;
  }

  const docRef: DocumentReference = await addDoc(collection(db, 'orders'), orderData);
  return docRef.id;
}

interface UpdateOrderOptions {
  stripeSessionId?: string;
  customerEmail?: string;
}

/**
 * Updates an order's status and optionally adds stripe session ID and customer email
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  options?: UpdateOrderOptions
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);

  const updateData: Partial<Order> = { status };

  if (options?.stripeSessionId) {
    updateData.stripeSessionId = options.stripeSessionId;
  }

  if (options?.customerEmail) {
    updateData.customerEmail = options.customerEmail;
  }

  if (status === 'paid') {
    updateData.paidAt = Timestamp.now();
  }

  await updateDoc(orderRef, updateData);
}

/**
 * Retrieves an order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    return null;
  }

  return {
    id: orderSnap.id,
    ...orderSnap.data(),
  } as Order;
}

/**
 * Gets an order by Stripe session ID
 */
export async function getOrderByStripeSessionId(sessionId: string): Promise<Order | null> {
  const { query, where, getDocs } = await import('firebase/firestore');

  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('stripeSessionId', '==', sessionId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as Order;
}
