import { useState } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import {
  TrendingUp,
  Repeat,
  Wallet,
  Calendar,
  ChevronDown,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import Card from '../components/ui/Card';
import { MetricCardSkeleton, ChartSkeleton } from '../components/ui/Skeleton';
import { useGetAnalyticsSummaryQuery } from '../services/productsApiSlice';

const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusColor = (status) => {
  if (status === 'Delivered' || status === 'COMPLETED') {
    return 'bg-emerald-50 text-emerald-600';
  }
  return 'bg-blue-50 text-blue-600';
};

export default function Analytics() {
  const [chartType, setChartType] = useState('area');

  const { data: summaryData, isLoading: summaryLoading, error: summaryError } =
    useGetAnalyticsSummaryQuery();

  const summary = summaryData?.data || {};
  const transactions = summary.recentTransactions || [];

  const totalRevenue = summary.totalRevenue || 0;
  const conversionRate = summary.conversionRate ?? null;
  const revenueData = summary.recentTransactions || [];

  const chartSeries = [
    {
      name: 'Revenue',
      data: revenueData.length
        ? revenueData.map((item) => item.totalPrice || item.revenue || 0)
        : [totalRevenue],
    },
  ];

  const chartOptions = {
    chart: {
      type: chartType,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#111827'],
    },
    fill: {
      type: chartType === 'area' ? 'gradient' : 'solid',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.2,
        opacityTo: 0.0,
        stops: [0, 100],
      },
    },
    colors: ['#111827'],
    dataLabels: { enabled: false },
    grid: { show: false },
    xaxis: {
      categories: revenueData.length
        ? revenueData.map((item) => {
            const date = new Date(item.createdAt || item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          })
        : ['No data'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#9CA3AF', fontSize: '10px', fontWeight: 600 },
        offsetY: 5,
      },
    },
    yaxis: { show: false },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => '$' + val.toLocaleString() },
    },
  };

  const isLoading = summaryLoading;
  const hasError = summaryError;

  const topCategories = [
    { name: 'STRUCTURAL STEEL', amount: 12400, percent: 85, color: 'bg-[#111827]' },
    { name: 'FACADE SYSTEMS', amount: 9820, percent: 65, color: 'bg-[#93C5FD]' },
    { name: 'SMART GLASS', amount: 7210, percent: 45, color: 'bg-[#CBD5E1]' },
    { name: 'HVAC UNITS', amount: 4450, percent: 30, color: 'bg-[#E2E8F0]' },
    { name: 'OTHERS', amount: 2100, percent: 15, color: 'bg-[#F1F5F9]' },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      className="space-y-8 pb-12"
    >
      {/* Header Section */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">Analytics & Insights</h1>
          <p className="text-gray-500 text-[14px] leading-relaxed">
            Detailed performance metrics for your architectural catalog.
          </p>
        </div>

        <button className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors shadow-sm">
          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-[13px] font-bold text-[#111827] mr-3">Last 30 Days</span>
          <span className="text-[12px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded mr-2">
            May 12 - Jun 11
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </motion.div>

      {hasError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Failed to load analytics data. Please try again later.
        </div>
      )}

      {/* Top Metrics Cards */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {summaryLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <Card className="relative overflow-hidden group pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="flex items-center text-[#10B981] text-[11px] font-bold bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +2.4%
            </span>
          </div>
          {summaryLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Conversion Rate</div>
              <div className="text-3xl font-sans font-bold text-[#111827]">
                {conversionRate != null ? `${conversionRate}%` : '—'}
              </div>
            </>
          )}
          <div className="absolute bottom-0 left-6 right-6 h-1 bg-gray-100 rounded-t-md">
            <div className="h-full bg-indigo-600 rounded-t-md w-3/4"></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
              <Repeat className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center text-gray-500 text-[11px] font-bold bg-gray-100 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3 mr-1" /> -0.8%
            </span>
          </div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Returning Customers</div>
          <div className="text-3xl font-sans font-bold text-[#111827]">24.5%</div>
          <div className="absolute bottom-0 left-6 right-6 h-1 bg-gray-100 rounded-t-md">
            <div className="h-full bg-blue-400 rounded-t-md w-1/4"></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="flex items-center text-[#10B981] text-[11px] font-bold bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12.1%
            </span>
          </div>
          {summaryLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Net Profit</div>
              <div className="text-3xl font-sans font-bold text-[#111827]">{formatCurrency(totalRevenue)}</div>
            </>
          )}
          <div className="absolute bottom-0 left-6 right-6 h-1 bg-gray-100 rounded-t-md">
            <div className="h-full bg-emerald-400 rounded-t-md w-full"></div>
          </div>
        </Card>
            </>
          )}
        </motion.div>

      {/* Middle Section: Main Chart & Top Categories */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left: Revenue Over Time Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-lg text-[#111827]">Revenue over Time</h3>
              <p className="text-[13px] text-gray-500 mt-1">Daily performance tracking for the current period.</p>
            </div>
            {/* Chart Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${
                  chartType === 'line' ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500 hover:text-[#111827]'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${
                  chartType === 'area' ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500 hover:text-[#111827]'
                }`}
              >
                Area
              </button>
            </div>
          </div>

          <div className="h-70 w-full">
            {summaryLoading ? (
              <ChartSkeleton />
            ) : (
              <Chart options={chartOptions} series={chartSeries} type={chartType} height="100%" />
            )}
          </div>
        </Card>

        {/* Right: Top Selling Categories */}
        <Card className="flex flex-col border-none shadow-sm">
          <h3 className="font-bold text-lg text-[#111827] mb-6">Top Selling Categories</h3>

          <div className="space-y-5 flex-1">
            {topCategories.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-[11px] font-bold text-[#111827] mb-2 tracking-wide uppercase">
                  <span>{cat.name}</span>
                  <span>${cat.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percent}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full rounded-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Insight Highlight */}
          <div className="mt-8 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-4 flex items-start">
            <Sparkles className="w-4 h-4 text-emerald-600 mr-3 shrink-0 mt-0.5" />
            <p className="text-[12px] text-emerald-800 font-medium leading-relaxed">
              <span className="font-bold">Insight:</span> Structural Steel sales have increased by 15% due to new regional contracts.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Bottom Section: Detailed Breakdown */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        }}
      >
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold text-[#111827]">Detailed Revenue Breakdown</h2>
          <button className="flex items-center text-[13px] font-bold text-[#111827] hover:text-gray-600 transition-colors">
            Export Report <Download className="w-4 h-4 ml-2" />
          </button>
        </div>

        <Card noPadding className="border-none shadow-sm">
          {summaryLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading transactions...
            </div>
          ) : summaryError ? (
            <div className="px-6 py-8 text-sm text-red-600">Failed to load transactions.</div>
          ) : transactions.length === 0 ? (
            <div className="px-6 py-8 text-sm text-gray-500">No transactions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-gray-500 tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((txn, index) => {
                    const firstItem = txn.orderItems?.[0];
                    const productTitle = firstItem?.product?.title || firstItem?.name || 'Unknown Product';
                    const txnId = txn._id || txn.id;
                    const txnDate = formatDate(txn.createdAt);
                    const status = txn.status || 'Pending';
                    const amount = txn.totalPrice || txn.amount || 0;

                    return (
                      <tr key={txnId || index} className="hover:bg-[#F9FAFB] transition-colors group">
                        <td className="px-6 py-4 font-bold text-[#111827] text-[13px] tracking-wide">
                          #{String(txnId).slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-[#111827] font-medium text-[13px]">{txnDate}</td>
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500 uppercase">
                            img
                          </div>
                          <span className="font-bold text-[#111827] text-[13px]">{productTitle}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusColor(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#111827] text-[14px]">
                          {formatCurrency(amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
