import { useQuery, useSubscription } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { setAnalytics, setLoading, setError, updateSalesMetric, updateInventoryItem } from '@/lib/features/dashboard/dashboardSlice';
import { GET_ANALYTICS, GET_SALES_METRICS, GET_INVENTORY_ITEMS } from '@/graphql/queries';
import { ANALYTICS_UPDATED, SALES_METRIC_ADDED, INVENTORY_UPDATED } from '@/graphql/subscriptions';

export const useAnalytics = () => {
  const dispatch = useDispatch();
  const { analytics, selectedDateRange, loading, error, filters } = useSelector(
    (state: RootState) => state.dashboard
  );

  // Main analytics query
  const { data: analyticsData, refetch: refetchAnalytics } = useQuery(GET_ANALYTICS, {
    variables: {
      dateRange: {
        startDate: selectedDateRange.startDate,
        endDate: selectedDateRange.endDate,
      },
    },
    onCompleted: (data) => {
      if (data.analytics) {
        dispatch(setAnalytics(data.analytics));
      }
    },
    onError: (err) => {
      dispatch(setError(err.message));
    },
  });

  // Sales metrics query with filters
  const { data: salesData, refetch: refetchSales } = useQuery(GET_SALES_METRICS, {
    variables: {
      dateRange: {
        startDate: selectedDateRange.startDate,
        endDate: selectedDateRange.endDate,
      },
      channel: filters.channel,
    },
    skip: !filters.channel,
  });

  // Inventory items query with filters
  const { data: inventoryData, refetch: refetchInventory } = useQuery(GET_INVENTORY_ITEMS, {
    variables: {
      category: filters.category,
      lowStock: filters.lowStock,
    },
    skip: !filters.category && !filters.lowStock,
  });

  // Real-time subscriptions
  useSubscription(ANALYTICS_UPDATED, {
    onData: ({ data }) => {
      if (data.data?.analyticsUpdated) {
        dispatch(setAnalytics(data.data.analyticsUpdated));
      }
    },
  });

  useSubscription(SALES_METRIC_ADDED, {
    onData: ({ data }) => {
      if (data.data?.salesMetricAdded) {
        dispatch(updateSalesMetric(data.data.salesMetricAdded));
      }
    },
  });

  useSubscription(INVENTORY_UPDATED, {
    onData: ({ data }) => {
      if (data.data?.inventoryUpdated) {
        dispatch(updateInventoryItem(data.data.inventoryUpdated));
      }
    },
  });

  const refreshData = () => {
    dispatch(setLoading(true));
    refetchAnalytics();
    if (filters.channel) refetchSales();
    if (filters.category || filters.lowStock) refetchInventory();
  };

  return {
    analytics,
    salesData: salesData?.salesMetrics,
    inventoryData: inventoryData?.inventoryItems,
    loading,
    error,
    refreshData,
  };
};
