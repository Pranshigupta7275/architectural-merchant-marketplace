import  { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-[#111827] overflow-hidden">
      
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300 bg-[#F8F9FA]">
        
        <Navbar setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pt-8 animate-fade-in relative">
          <div className="max-w-1200px mx-auto w-full min-h-full flex flex-col">
            <Outlet />
            <Footer />
          </div>
        </main>

      </div>
    </div>
  );
}