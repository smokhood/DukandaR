/**
 * useOwnerDashViewModel
 * Business logic for owner dashboard
 * Handles: Real-time stats, demand alerts, inventory management
 */

import type { Order } from '@models/Order';
import type { DemandAlert, Shop } from '@models/Shop';
import { db } from '@services/firebase';
import { getDemandAlerts, getProductsByShop } from '@services/productService';
import { getShopById } from '@services/shopService';
import { useAuthStore } from '@store/authStore';
import { useQuery } from '@tanstack/react-query';
import {
    collection,
    onSnapshot,
    query,
    QueryConstraint,
    where,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

interface ShopStats {
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalProducts: number;
  activeDealCount: number;
}

interface OwnerDashStats {
  shop: Shop | null;
  stats: ShopStats | null;
  recentOrders: Order[];
  pendingOrders: number;
  completedOrders: number;
  demandAlerts: DemandAlert[];
}

export function useOwnerDashViewModel() {
  const { user } = useAuthStore();
  const [dashStats, setDashStats] = useState<OwnerDashStats>({
    shop: null,
    stats: null,
    recentOrders: [],
    pendingOrders: 0,
    completedOrders: 0,
    demandAlerts: [],
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch shop details
  const shopQuery = useQuery({
    queryKey: ['shop', user?.shopId],
    queryFn: () => {
      if (!user?.shopId) throw new Error('No shop found');
      return getShopById(user.shopId);
    },
    enabled: !!user?.shopId,
    staleTime: 60000, // 1 minute
  });

  // Fetch products for stats calculation
  const productsQuery = useQuery({
    queryKey: ['shopProducts', user?.shopId],
    queryFn: () => {
      if (!user?.shopId) throw new Error('No shop found');
      return getProductsByShop(user.shopId);
    },
    enabled: !!user?.shopId,
    staleTime: 120000, // 2 minutes
  });

  // Fetch demand alerts
  const demandsQuery = useQuery({
    queryKey: ['demandAlerts', user?.shopId],
    queryFn: () => {
      if (!user?.shopId) throw new Error('No shop found');
      return getDemandAlerts(user.shopId);
    },
    enabled: !!user?.shopId,
    staleTime: 180000, // 3 minutes
  });

  // Real-time listener for pending orders count
  useEffect(() => {
    if (!user?.shopId) return;

    const constraints: QueryConstraint[] = [
      where('shopId', '==', user.shopId),
      where('status', '==', 'pending'),
    ];

    const q = query(
      collection(db, 'orders'),
      ...constraints
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDashStats((prev) => ({
        ...prev,
        pendingOrders: snapshot.size,
      }));
    });

    return unsubscribe;
  }, [user?.shopId]);

  // Real-time listener for completed orders count
  useEffect(() => {
    if (!user?.shopId) return;

    const constraints: QueryConstraint[] = [
      where('shopId', '==', user.shopId),
      where('status', '==', 'completed'),
    ];

    const q = query(
      collection(db, 'orders'),
      ...constraints
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDashStats((prev) => ({
        ...prev,
        completedOrders: snapshot.size,
      }));
    });

    return unsubscribe;
  }, [user?.shopId]);

  // Update dashboard stats when queries complete
  useEffect(() => {
    if (shopQuery.data || productsQuery.data || demandsQuery.data) {
      setDashStats((prev) => ({
        ...prev,
        shop: shopQuery.data || prev.shop,
        stats: shopQuery.data
          ? {
              totalOrders: prev.stats?.totalOrders || 0,
              totalRevenue: prev.stats?.totalRevenue || 0,
              averageRating: shopQuery.data.rating || 0,
              totalProducts: productsQuery.data?.length || 0,
              activeDealCount: prev.stats?.activeDealCount || 0,
            }
          : prev.stats,
        demandAlerts: demandsQuery.data || prev.demandAlerts,
      }));
    }
  }, [shopQuery.data, productsQuery.data, demandsQuery.data]);

  // Refresh all data
  const refreshDashboard = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        shopQuery.refetch(),
        productsQuery.refetch(),
        demandsQuery.refetch(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [shopQuery, productsQuery, demandsQuery]);

  // Get dashboard readiness
  const isDashboardReady =
    !!dashStats.shop && !!dashStats.stats && productsQuery.data && productsQuery.data.length > 0;

  return {
    // Data
    dashStats,

    // Queries
    isLoading:
      shopQuery.isLoading ||
      productsQuery.isLoading ||
      demandsQuery.isLoading,
    error:
      shopQuery.error ||
      productsQuery.error ||
      demandsQuery.error,

    // State
    isRefreshing,
    isDashboardReady,

    // Actions
    refreshDashboard,
  };
}
