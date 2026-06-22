import { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";

/**
 * RevenueChart Component
 * @param {Object[]} data - Array of objects containing { date: string, revenue: number }
 */
const RevenueChart = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);

  // 1. MOUNT GUARD: Asynchronous to satisfy ESLint 'set-state-in-effect'
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. DEFENSIVE & MEMOIZED DATA PARSING: Satisfies ESLint 'exhaustive-deps'
  // Ensures the fallback array maintains the same memory reference across renders
  const safeData = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  // 3. MEMOIZED CONFIG
  const options = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        fontFamily: "Manrope, sans-serif",
        animations: { enabled: false },
      },
      grid: { show: false },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2, colors: ["#002045"] },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 },
      },
      xaxis: {
        categories: safeData.map((item) => item?.date || ""),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: "#8E9196",
            fontSize: "10px",
            fontWeight: 600,
            cssClass: "tracking-widest",
          },
        },
      },
      yaxis: { show: false },
    }),
    [safeData],
  );

  const series = useMemo(
    () => [
      {
        name: "Revenue",
        data: safeData.map((item) => Number(item?.revenue) || 0),
      },
    ],
    [safeData],
  );

  // 4. FIXED HEIGHT LOADER: Uses canonical Tailwind class h-87.5 (350px)
  if (!isMounted) {
    return (
      <div className="w-full h-87.5 flex items-center justify-center bg-gray-50/50 rounded-xl animate-pulse">
        <span className="text-sm font-medium text-gray-400 tracking-wide">
          Loading chart data...
        </span>
      </div>
    );
  }

  // 5. FIXED HEIGHT CONTAINER: Uses canonical Tailwind class h-87.5 (350px)
  return (
    <div className="w-full h-87.5">
      <Chart options={options} series={series} type="area" height="100%" />
    </div>
  );
};

export default RevenueChart;
