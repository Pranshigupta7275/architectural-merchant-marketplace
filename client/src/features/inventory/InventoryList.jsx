import { Filter, Download, MoreVertical, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function InventoryList() {
  // MOCK DATA: Perfectly aligned with "Product inventory.png"
  const inventoryMetrics = {
    totalPieces: '1,284',
    activeListings: '942',
    lowStock: '18',
    drafts: '324'
  };

  const products = [
    {
      id: 'SKU: ARCH-2024-BH-01',
      title: 'Brushed Brass Linear Handle',
      image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=80&h=80',
      category: 'Hardware',
      price: 145.00,
      stock: 42,
      maxStock: 50,
      status: 'ACTIVE'
    },
    {
      id: 'SKU: FURN-2024-OC-92',
      title: "The 'Curator' Oak Side Chair",
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=80&h=80',
      category: 'Furniture',
      price: 890.00,
      stock: 3,
      maxStock: 50,
      status: 'ACTIVE'
    },
    {
      id: 'SKU: MATL-2024-MS-05',
      title: 'Carrara Marble Surface Segment',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=80&h=80',
      category: 'Materials',
      price: 1200.00,
      stock: 12,
      maxStock: 50,
      status: 'DRAFT'
    },
    {
      id: 'SKU: LITE-2024-IP-44',
      title: 'Industrial Iron Pendant',
      image: 'https://via.placeholder.com/80?text=OUT+OF+STOCK', // Using placeholder for out of stock aesthetic
      category: 'Lighting',
      price: 225.00,
      stock: 0,
      maxStock: 50,
      status: 'OUT OF STOCK'
    }
  ];

  // Helper to render the visual stock progress bar
  const renderStockBar = (stock, maxStock, status) => {
    const percentage = Math.min((stock / maxStock) * 100, 100);
    
    let barColor = 'bg-[#10B981]'; // Default Green
    let textColor = 'text-[#10B981]';
    
    if (stock === 0 || status === 'OUT OF STOCK') {
      barColor = 'bg-transparent';
      textColor = 'text-red-500';
    } else if (stock <= 5) {
      barColor = 'bg-red-600';
      textColor = 'text-red-600';
    } else if (status === 'DRAFT') {
      barColor = 'bg-gray-400';
      textColor = 'text-gray-600';
    }

    return (
      <div className="flex items-center space-x-4 w-48">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${barColor}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-[13px] font-bold whitespace-nowrap w-16 ${textColor}`}>
          {stock} Units
        </span>
      </div>
    );
  };

  // Helper for pixel-perfect status badges
  const renderStatusBadge = (status) => {
    if (status === 'ACTIVE') {
      return <span className="bg-[#0E4D34] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">ACTIVE</span>;
    }
    if (status === 'DRAFT') {
      return <span className="bg-[#E2E8F0] text-[#475569] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">DRAFT</span>;
    }
    if (status === 'OUT OF STOCK') {
      return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">OUT OF STOCK</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="max-w-xl">
          <h1 className="text-3xl font-serif font-bold text-[#111827] mb-2">Product Inventory</h1>
          <p className="text-gray-500 text-[13px] leading-relaxed">
            Curate and manage your collection of architectural hardware and bespoke furniture pieces with precision.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-[#F3F4F6] text-[#111827] text-[13px] font-bold rounded-md hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </button>
          <button className="flex items-center px-4 py-2 bg-[#F3F4F6] text-[#111827] text-[13px] font-bold rounded-md hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#111827] pl-5 pr-6 py-6">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Total Pieces</div>
          <div className="text-3xl font-sans font-bold text-[#111827] mb-3">{inventoryMetrics.totalPieces}</div>
          <div className="flex items-center text-[#10B981] text-[11px] font-bold">
            <TrendingUp className="w-3 h-3 mr-1" strokeWidth={3} /> +12 this week
          </div>
        </Card>

        <Card>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Active Listings</div>
          <div className="text-3xl font-sans font-bold text-[#111827] mb-3">{inventoryMetrics.activeListings}</div>
          <div className="text-gray-500 text-[11px] font-medium">73% Visibility Rate</div>
        </Card>

        <Card>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Low Stock</div>
          <div className="text-3xl font-sans font-bold text-red-600 mb-3">{inventoryMetrics.lowStock}</div>
          <div className="text-gray-500 text-[11px] font-medium">Action Required</div>
        </Card>

        <Card>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Drafts</div>
          <div className="text-3xl font-sans font-bold text-[#111827] mb-3">{inventoryMetrics.drafts}</div>
          <div className="text-gray-500 text-[11px] font-medium">In curation phase</div>
        </Card>
      </div>

      {/* Main DataTable */}
      <Card noPadding className="border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] uppercase font-bold text-gray-500 tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Inventory</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-5 flex items-center space-x-5">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-14 h-14 rounded-md bg-gray-200 object-cover border border-gray-100"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=IMG' }}
                    />
                    <div className="max-w-50">
                      <div className="font-bold text-[#111827] text-[14px] leading-snug mb-1 truncate">{product.title}</div>
                      <div className="text-gray-400 text-[11px] tracking-wider">{product.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[#111827] font-medium text-[13px]">{product.category}</td>
                  <td className="px-6 py-5 text-[#111827] font-bold text-[14px]">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-5">
                    {renderStockBar(product.stock, product.maxStock, product.status)}
                  </td>
                  <td className="px-6 py-5">
                    {renderStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-gray-400 hover:text-[#111827] transition-colors p-2 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Pagination */}
        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-white">
          <div className="text-[12px] text-gray-500 font-medium">
            Showing <span className="font-bold text-[#111827]">1-4</span> of <span className="font-bold text-[#111827]">{inventoryMetrics.totalPieces}</span> pieces
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-[#111827] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded bg-[#111827] text-white text-[12px] font-bold flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded text-gray-500 hover:bg-gray-100 text-[12px] font-bold flex items-center justify-center transition-colors">2</button>
            <button className="w-7 h-7 rounded text-gray-500 hover:bg-gray-100 text-[12px] font-bold flex items-center justify-center transition-colors">3</button>
            <button className="p-1 text-gray-400 hover:text-[#111827] transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </Card>
      
    </div>
  );
}