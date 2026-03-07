import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

admin.initializeApp();

const db = admin.firestore();
const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

type NotificationType =
  | 'new_deal'
  | 'shop_opened'
  | 'demand_alert'
  | 'stock_request'
  | 'new_shop_nearby'
  | 'system';

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string | number | boolean | null>;
  sound?: 'default';
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
}

interface UserPushInfo {
  expoPushToken?: string | null;
  expoPushTokens?: unknown;
  pushEnabled?: boolean;
}

interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  shopId?: string | null;
  productName?: string | null;
  actionUrl?: string | null;
  pushData?: Record<string, string | number | boolean | null>;
}

interface FirestoreCreateEvent {
  data?: {
    data: () => Record<string, unknown>;
  };
  params: Record<string, string>;
}

export const onOrderCreated = onDocumentCreated('orders/{orderId}', async (event: FirestoreCreateEvent) => {
  const snap = event.data;
  if (!snap) {
    return;
  }

  const orderId = event.params.orderId;
  const order = snap.data() as {
    shopId?: string;
    shopName?: string;
    customerId?: string;
    items?: unknown[];
  };

  if (!order.shopId || !order.customerId) {
    logger.warn('Order missing required fields', { orderId });
    return;
  }

  try {
    const shopSnap = await db.collection('shops').doc(order.shopId).get();
    const ownerId = shopSnap.exists ? (shopSnap.data()?.ownerId as string | undefined) : undefined;

    if (ownerId) {
      await notifyUser(ownerId, {
        type: 'stock_request',
        title: 'Naya order mila',
        body: `${Array.isArray(order.items) ? order.items.length : 0} items ka order ${order.shopName || ''} ke liye aya hai.`.trim(),
        actionUrl: '/(owner)/dashboard',
        shopId: order.shopId,
        pushData: {
          type: 'stock_request',
          orderId,
          shopId: order.shopId,
        },
      });
    }

    await notifyUser(order.customerId, {
      type: 'system',
      title: 'Order place ho gaya',
      body: `${order.shopName || 'Shop'} ko aapka order bhej diya gaya hai.`,
      actionUrl: '/(customer)/notifications',
      shopId: order.shopId,
      pushData: {
        type: 'system',
        orderId,
        shopId: order.shopId,
      },
    });
  } catch (error) {
    logger.error('onOrderCreated failed', error as Error, { orderId });
  }
});

export const onDealCreated = onDocumentCreated('deals/{dealId}', async (event: FirestoreCreateEvent) => {
  const snap = event.data;
  if (!snap) {
    return;
  }

  const dealId = event.params.dealId;
  const deal = snap.data() as {
    shopId?: string;
    shopName?: string;
    productName?: string;
    note?: string | null;
  };

  if (!deal.shopId) {
    logger.warn('Deal missing shopId', { dealId });
    return;
  }

  try {
    const followersSnap = await db
      .collection('users')
      .where('savedShops', 'array-contains', deal.shopId)
      .get();

    const noteText = (deal.note || '').trim();
    const body = noteText
      ? `${deal.shopName || 'Aap ki pasandeeda dukaan'}: ${deal.productName || 'Product'} - ${noteText}`
      : `${deal.shopName || 'Aap ki pasandeeda dukaan'}: ${deal.productName || 'Product'} par naya deal available hai.`;

    await Promise.all(
      followersSnap.docs.map((userDoc: { id: string }) =>
        notifyUser(userDoc.id, {
          type: 'new_deal',
          title: 'Naya deal available',
          body,
          actionUrl: '/(customer)/notifications',
          shopId: deal.shopId || null,
          productName: deal.productName || null,
          pushData: {
            type: 'new_deal',
            dealId,
            shopId: deal.shopId || null,
          },
        })
      )
    );
  } catch (error) {
    logger.error('onDealCreated failed', error as Error, { dealId });
  }
});

async function notifyUser(userId: string, payload: NotificationPayload): Promise<void> {
  await db.collection('notifications').add({
    userId,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    shopId: payload.shopId ?? null,
    productName: payload.productName ?? null,
    actionUrl: payload.actionUrl ?? null,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const userSnap = await db.collection('users').doc(userId).get();
  if (!userSnap.exists) {
    return;
  }

  const user = userSnap.data() as UserPushInfo;
  if (user.pushEnabled === false) {
    return;
  }

  const tokens = extractTokens(user);
  if (tokens.length === 0) {
    return;
  }

  const pushData = {
    actionUrl: payload.actionUrl ?? null,
    ...(payload.pushData || {}),
  };

  const invalidTokens = await sendExpoPush(tokens, payload.title, payload.body, pushData);
  if (invalidTokens.length > 0) {
    await db.collection('users').doc(userId).set(
      {
        expoPushTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
}

function extractTokens(user: UserPushInfo): string[] {
  const set = new Set<string>();

  if (typeof user.expoPushToken === 'string') {
    set.add(user.expoPushToken);
  }

  if (Array.isArray(user.expoPushTokens)) {
    for (const token of user.expoPushTokens) {
      if (typeof token === 'string') {
        set.add(token);
      }
    }
  }

  return Array.from(set).filter((token) => token.startsWith('ExponentPushToken['));
}

async function sendExpoPush(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string | number | boolean | null>
): Promise<string[]> {
  const invalidTokens: string[] = [];

  const messages: ExpoPushMessage[] = tokens.map((token) => ({
    to: token,
    title,
    body,
    data,
    sound: 'default',
    priority: 'high',
    channelId: 'default',
  }));

  const chunks = chunk(messages, 100);
  for (const batch of chunks) {
    try {
      const res = await fetch(EXPO_PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      });

      const json = (await res.json()) as {
        data?: Array<{
          status?: string;
          details?: { error?: string };
        }>;
      };

      if (Array.isArray(json.data)) {
        json.data.forEach((ticket, index) => {
          if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
            const token = batch[index]?.to;
            if (token) {
              invalidTokens.push(token);
            }
          }
        });
      }
    } catch (error) {
      logger.warn('Expo push batch failed', error as Error);
    }
  }

  return invalidTokens;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}
