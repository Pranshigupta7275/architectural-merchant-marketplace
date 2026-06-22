import Chart from 'react-apexcharts';
import { ChevronRight, Star } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function Dashboard() {
  // MOCK DATA: Recent Orders
  const recentOrders = [
    { 
      id: 'ORD-9921-X', 
      product: 'Curated Print #042', 
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=64&h=64',
      date: 'Dec 14, 2024', 
      customer: 'Marcus Thorne', 
      status: 'SHIPPED', 
      total: 450.00 
    },
    { 
      id: 'ORD-9918-B', 
      product: 'Bauhaus Desk Lamp', 
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=64&h=64',
      date: 'Dec 13, 2024', 
      customer: 'Elena Rossi', 
      status: 'PROCESSING', 
      total: 1200.00 
    },
    { 
      id: 'ORD-9899-A', 
      product: 'Structure Study #09', 
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=64&h=64',
      date: 'Dec 12, 2024', 
      customer: 'David Chen', 
      status: 'DELIVERED', 
      total: 320.00 
    },
  ];

  // APEXCHARTS CONFIGURATION
  const chartSeries = [{
    name: 'Revenue',
    data: [15000, 22000, 11000, 31000, 42000, 28000, 35000]
  }];

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      parentHeightOffset: 0,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '70%',
      }
    },
    colors: ['#CBD5E1'], // Light gray base color matching reference
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.6 // Darkens gracefully on hover
        }
      }
    },
    dataLabels: { enabled: false },
    grid: {
      show: false,
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    xaxis: {
      categories: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
        },
        offsetY: 5,
      }
    },
    yaxis: { 
      show: false // Hides the Y axis completely as per design
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => '$' + val.toLocaleString()
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111827] mb-1">Merchant Overview</h1>
          <p className="text-gray-500 text-sm">Your studio performance for the month of December.</p>
        </div>
        
        <select className="bg-[#F8F9FA] border-none text-sm font-medium rounded-lg px-4 py-2 text-[#111827] focus:ring-0 cursor-pointer">
          <option>Timeline: Last 30 Days</option>
          <option>Timeline: Last 90 Days</option>
          <option>Timeline: Year to Date</option>
        </select>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Total Sales Revenue</div>
          <div className="text-4xl font-sans font-bold tracking-tight text-[#111827] mb-3">
            $142,850.00
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#0E4D34] text-white text-xs font-semibold px-2 py-0.5 rounded">
              +12.4%
            </span>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Listings</div>
          <div className="text-4xl font-sans font-bold tracking-tight text-[#111827] mb-3">
            48
          </div>
          <div className="text-xs text-gray-500">
            6 items low on stock
          </div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Customer Satisfaction</div>
          <div className="text-4xl font-sans font-bold tracking-tight text-[#111827] mb-3">
            4.9
          </div>
          <div className="flex text-[#2E8B57] space-x-1">
            {[1, 2, 3, 4, 5].map((star, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </Card>
      </div>

      {/* Middle Section: Chart & Top Collection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Performance Chart Area */}
        <Card className="lg:col-span-2 bg-[#F3F4F6] border-none">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#111827]">Sales Performance</h3>
              <p className="text-sm text-gray-500">Aggregate volume across all collections</p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#111827]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111827] mr-2"></span>
              Revenue
            </div>
          </div>
          
          {/* Actual ApexChart */}
          <div className="h-55 w-full">
            <Chart 
              options={chartOptions} 
              series={chartSeries} 
              type="bar" 
              height="100%" 
            />
          </div>
        </Card>

        {/* Top Collection Card */}
        <Card className="flex flex-col border border-gray-200">
          <h3 className="font-serif text-lg font-bold text-[#111827] mb-4">Top Collection</h3>
          
          <div className="bg-[#1A202C] rounded-xl p-6 text-white mb-6 relative overflow-hidden h-32 flex flex-col justify-end">
            <h4 className="font-serif font-bold text-lg relative z-10">BRUTALIST SERIES</h4>
            <p className="text-xs text-gray-400 relative z-10">12 Active SKUs</p>
            <div className="absolute top-2 right-4 opacity-10">
               <ShieldIcon /> 
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Conversion Rate</span>
                <span className="font-bold text-[#111827]">4.2%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-[#111827] h-1.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm pt-2">
              <span className="text-gray-500">Units Sold</span>
              <span className="font-bold text-[#111827]">184</span>
            </div>
          </div>

          <div className="pt-6 mt-auto flex justify-center border-t border-gray-100">
            <button className="text-[13px] font-bold flex items-center text-[#111827] hover:text-gray-600 transition-colors">
              View Analytics <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </Card>

      </div>

      {/* Recent Orders Section */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif font-bold text-[#111827]">Recent Orders</h2>
          <button className="text-[13px] font-bold text-gray-500 hover:text-[#111827] transition-colors">
            View All Orders
          </button>
        </div>
        
        <Card noPadding className="border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-gray-500 tracking-widest border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Order & Product</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-4">
                      <img 
                        src={order.image} 
                        alt={order.product}
                        className="w-10 h-10 rounded bg-gray-200 object-cover border border-gray-100"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=Img' }}
                      />
                      <div>
                        <div className="font-bold text-[#111827] text-[13px]">{order.product}</div>
                        <div className="text-gray-500 text-[11px] mt-0.5">{order.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#111827] font-medium text-[13px]">{order.date}</td>
                    <td className="px-6 py-4 text-[#111827] font-medium text-[13px]">{order.customer}</td>
                    <td className="px-6 py-4">
                      {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                        <span className="bg-[#0E4D34] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                          {order.status}
                        </span>
                      )}
                      {order.status === 'PROCESSING' && (
                        <span className="bg-[#E2E8F0] text-[#475569] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#111827] text-[13px]">
                      ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
}

// Internal icon component for Brutalist card
function ShieldIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}