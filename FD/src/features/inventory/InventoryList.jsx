import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Filter, Download, MoreVertical, ChevronLeft, ChevronRight, Loader2, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useGetProductsQuery, useDeleteProductMutation } from '../../services/productsApiSlice'; 

export default function InventoryList() {
  const navigate = useNavigate();
  
  // State to track which row's dropdown is currently open
  const [openMenuId, setOpenMenuId] = useState(null);

  // 1. Fetch Data
  const { data: response, isLoading, isError, error } = useGetProductsQuery();
  // 2. Delete Mutation
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = response?.data || [];
  const pagination = response?.pagination || {};

  const inventoryMetrics = {
    totalPieces: pagination.totalProducts || products.length,
    activeListings: products.filter(p => p.status === 'ACTIVE').length,
    drafts: products.filter(p => p.status === 'DRAFT').length,
    lowStock: products.filter(p => 
      (p.inventory?.stockQuantity || 0) <= (p.inventory?.lowStockAlert || 5)
    ).length
  };

  // --- ACTION HANDLERS ---
  const handleEdit = (productId) => {
    setOpenMenuId(null);
    // Navigates to the edit page (you can build this page next!)
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    // Built-in browser confirmation so you don't accidentally delete items
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        await deleteProduct(productId).unwrap();
        setOpenMenuId(null);
        // Redux will automatically refresh the table here!
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Failed to delete the product. Please try again.");
      }
    }
  };

  // UI Helpers
  const renderStockBar = (stock, maxStock, status) => {
    const safeStock = stock || 0;
    const percentage = Math.min((safeStock / maxStock) * 100, 100);
    let barColor = 'bg-[#10B981]'; 
    let textColor = 'text-[#10B981]';
    
    if (safeStock === 0 || status === 'OUT OF STOCK') {
      barColor = 'bg-transparent';
      textColor = 'text-red-500';
    } else if (safeStock <= 5) {
      barColor = 'bg-red-600';
      textColor = 'text-red-600';
    } else if (status === 'DRAFT') {
      barColor = 'bg-gray-400';
      textColor = 'text-gray-600';
    }

    return (
      <div className="flex items-center space-x-4 w-48">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
        </div>
        <span className={`text-[13px] font-bold whitespace-nowrap w-16 ${textColor}`}>
          {safeStock} Units
        </span>
      </div>
    );
  };

  const renderStatusBadge = (status) => {
    if (status === 'ACTIVE') return <span className="bg-[#0E4D34] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">ACTIVE</span>;
    if (status === 'DRAFT') return <span className="bg-[#E2E8F0] text-[#475569] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">DRAFT</span>;
    return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">OUT OF STOCK</span>;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#111827] mb-4" />
        <p className="text-gray-500 font-medium">Loading inventory data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg border border-red-100">
        <h3 className="font-bold text-lg mb-2">Failed to load inventory</h3>
        <p>{error?.data?.message || 'An unexpected error occurred. Please try again.'}</p>
      </div>
    );
  }

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
        </Card>
        <Card>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Active Listings</div>
          <div className="text-3xl font-sans font-bold text-[#111827] mb-3">{inventoryMetrics.activeListings}</div>
        </Card>
        <Card>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Low Stock</div>
          <div className="text-3xl font-sans font-bold text-red-600 mb-3">{inventoryMetrics.lowStock}</div>
        </Card>
        <Card>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Drafts</div>
          <div className="text-3xl font-sans font-bold text-[#111827] mb-3">{inventoryMetrics.drafts}</div>
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center text-gray-500">
                    No products found. Start by creating a new listing!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-5 flex items-center space-x-5">
                      <img 
                        src={product.images?.[0]?.url || ''} 
                        alt={product.title}
                        className="w-14 h-14 rounded-md bg-gray-200 object-cover border border-gray-100"
                        onError={(e) => {
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = 'https://placehold.co/80x80/eeeeee/999999?text=No+Image';
                        }}
                      />
                      <div className="max-w-50">
                        <div className="font-bold text-[#111827] text-[14px] leading-snug mb-1 truncate">{product.title}</div>
                        <div className="text-gray-400 text-[11px] tracking-wider">
                          SKU: {product.inventory?.sku || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[#111827] font-medium text-[13px]">{product.category || 'Uncategorized'}</td>
                    <td className="px-6 py-5 text-[#111827] font-bold text-[14px]">
                      ${(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5">
                      {renderStockBar(product.inventory?.stockQuantity, 50, product.status)}
                    </td>
                    <td className="px-6 py-5">
                      {renderStatusBadge(product.status)}
                    </td>
                    
                    {/* 🔥 THE NEW ACTION MENU */}
                    <td className="px-6 py-5 text-right relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === product._id ? null : product._id)}
                        className={`text-gray-400 hover:text-[#111827] transition-colors p-2 ${openMenuId === product._id ? 'opacity-100 text-[#111827]' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === product._id && (
                        <>
                          {/* Invisible overlay to close menu if clicked outside */}
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          
                          <div className="absolute right-8 top-10 w-36 bg-white border border-gray-100 rounded-md shadow-lg z-20 overflow-hidden">
                            <button 
                              onClick={() => handleEdit(product._id)}
                              className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                            >
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(product._id)}
                              disabled={isDeleting}
                              className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center transition-colors"
                            >
                              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} 
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Pagination */}
        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-white">
          <div className="text-[12px] text-gray-500 font-medium">
            Showing <span className="font-bold text-[#111827]">1-{products.length}</span> of <span className="font-bold text-[#111827]">{inventoryMetrics.totalPieces}</span> pieces
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-[#111827] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded bg-[#111827] text-white text-[12px] font-bold flex items-center justify-center">1</button>
            <button className="p-1 text-gray-400 hover:text-[#111827] transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}
