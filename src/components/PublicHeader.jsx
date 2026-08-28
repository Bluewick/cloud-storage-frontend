import React from 'react'
import {
  Cloud,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PublicHeader() {
    const navigate = useNavigate();
  return (
          <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <a onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1D4ED8] transition-colors">
                <Cloud className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base font-bold text-[#0F172A] tracking-tight">Lumina</span>
                <span className="text-base font-medium text-[#2563EB]">Clarity</span>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#475569]">
              <a href="#features" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors">Features</a>
              <a href="#demo" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors">Interactive Demo</a>
              <a href="#security" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors">Security & Roles</a>
              <a href="#pricing" className="px-3 py-1.5 rounded-md hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors">Pricing</a>
            </nav>
          </div>

          {/* Search bar simulation & Auth buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] w-48">
              <Search className="w-3.5 h-3.5" />
              <span>Search media...</span>
              <kbd className="ml-auto bg-white border border-[#CBD5E1] text-[#64748B] px-1.5 py-0.5 rounded text-[10px] font-semibold">⌘K</kbd>
            </div>

            <button onClick={() => navigate('/login')} className="text-sm font-medium text-[#475569] hover:text-[#0F172A] px-3 py-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/signup')} className="text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 rounded-lg shadow-sm transition-all transform active:scale-[0.98] flex items-center gap-1.5">
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
  )
}
