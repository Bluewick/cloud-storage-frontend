import React, { useState } from 'react';
import {
  Cloud,
  HardDrive,
  Folder,
  FolderPlus,
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Share2,
  Lock,
  Eye,
  Edit3,
  Download,
  Trash2,
  Search,
  Check,
  Copy,
  ChevronRight,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  Key,
  ArrowUpRight,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  CheckCircle2,
  Layers,
  Sparkles,
  Server,
  Database,
  ExternalLink,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('Campaign Assets 2026');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [storageSlider, setStorageSlider] = useState(250);

  // Mock File Hierarchy
  const files = [
    {
      id: 'f1',
      name: 'Brand_Launch_Keynote_v4.mp4',
      type: 'video',
      size: '142.8 MB',
      updated: '12 mins ago',
      owner: 'Sarah Jenkins',
      access: 'Editor',
      starred: true,
      tag: 'tag-blue'
    },
    {
      id: 'f2',
      name: 'Q3_Global_Media_Deck.pdf',
      type: 'doc',
      size: '18.4 MB',
      updated: '2 hours ago',
      owner: 'Alex Rivera',
      access: 'Viewer',
      starred: true,
      tag: 'tag-purple'
    },
    {
      id: 'f3',
      name: 'Product_Hero_Render_4K.png',
      type: 'image',
      size: '48.2 MB',
      updated: 'Yesterday',
      owner: 'Sarah Jenkins',
      access: 'Owner',
      starred: false,
      tag: 'tag-green'
    },
    {
      id: 'f4',
      name: 'Commercial_Voiceover_Master.wav',
      type: 'audio',
      size: '64.1 MB',
      updated: '3 days ago',
      owner: 'Studio Audio Lab',
      access: 'Editor',
      starred: false,
      tag: 'tag-yellow'
    }
  ];

  const handleCopy = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const calculateCost = (gb) => {
    if (gb <= 15) return 0;
    return Math.round((gb - 15) * 0.038 + 5);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#EFF6FF] selection:text-[#2563EB]">
      
      {/* -------------------- Top Notification Banner -------------------- */}
      <div className="bg-[#EFF6FF] border-b border-[#E2E8F0] px-4 py-2 text-center text-xs font-medium text-[#1D4ED8] flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
        <span>Lumina Vault 2.0 is live: Supabase S3 Object Storage + Instant Zero-Knowledge Share links</span>
        <a href="#features" className="underline font-semibold hover:text-[#1E40AF] inline-flex items-center gap-0.5">
          Read architecture note <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* -------------------- Header / Navigation -------------------- */}
      <PublicHeader />


      {/* -------------------- Hero Section -------------------- */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#1D4ED8] mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Engineered for High-Density Media Workflows</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F172A] leading-[1.15]">
              Cloud storage with <span className="text-[#2563EB]">zero friction</span> and micro-precision control.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto">
              Effortless folder hierarchies, lightning multi-part uploads, granular viewer/editor permissions, and password-protected expiry links. Powered by Supabase & Postgres.
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                <Cloud className="w-4 h-4" />
                <span>Start Free (15 GB Included)</span>
              </button>

              <a
                href="#demo"
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-medium text-sm shadow-level-1 transition-all flex items-center justify-center gap-2"
              >
                <span>Live Interactive Sandbox</span>
                <SlidersHorizontal className="w-4 h-4 text-[#64748B]" />
              </a>
            </div>

            {/* Quick Metrics Under Hero */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-[#E2E8F0] pt-8 text-left">
              <div className="px-3">
                <p className="text-2xl font-bold text-[#0F172A]">99.99%</p>
                <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mt-0.5">SLA Durability</p>
              </div>
              <div className="px-3">
                <p className="text-2xl font-bold text-[#0F172A]">5GB/s</p>
                <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mt-0.5">Upload Stream</p>
              </div>
              <div className="px-3">
                <p className="text-2xl font-bold text-[#0F172A]">E2E</p>
                <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mt-0.5">Encrypted Links</p>
              </div>
              <div className="px-3">
                <p className="text-2xl font-bold text-[#0F172A]">30-Day</p>
                <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mt-0.5">Trash Restore</p>
              </div>
            </div>

          </div>

          {/* -------------------- Interactive Live UI Sandbox -------------------- */}
          <div id="demo" className="mt-16 scroll-mt-20">
            <div className="rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] shadow-level-2 overflow-hidden">
              
              {/* Fake App Topbar */}
              <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                
                {/* Window Dots & Breadcrumbs */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#EF4444]/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-[#10B981]/80 inline-block"></span>
                  </div>
                  
                  <div className="h-4 w-px bg-[#CBD5E1] mx-1"></div>

                  <div className="flex items-center gap-1.5 text-xs text-[#475569]">
                    <span className="font-medium hover:text-[#2563EB] cursor-pointer">My Drive</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span className="font-medium hover:text-[#2563EB] cursor-pointer">Marketing 2026</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span className="font-semibold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded text-[11px]">
                      {selectedFolder}
                    </span>
                  </div>
                </div>

                {/* Topbar Actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE] text-xs font-semibold transition-colors border border-[#BFDBFE]"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Folder</span>
                  </button>

                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-xs font-semibold transition-colors shadow-sm">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Media</span>
                  </button>
                </div>

              </div>

              {/* Workspace Split Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                
                {/* Left Mini Sidebar */}
                <aside className="md:col-span-3 border-r border-[#E2E8F0] p-4 bg-[#F8FAFC]/60 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-2 mb-2">Navigation</p>
                      <div className="space-y-1">
                        <button 
                          onClick={() => setActiveTab('all')}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${activeTab === 'all' ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#475569] hover:bg-[#F1F5F9]'}`}
                        >
                          <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4" />
                            <span>All Files</span>
                          </div>
                          <span className="text-[10px] bg-[#E2E8F0] text-[#475569] px-1.5 py-0.5 rounded-full font-bold">142</span>
                        </button>

                        <button 
                          onClick={() => setActiveTab('shared')}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${activeTab === 'shared' ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#475569] hover:bg-[#F1F5F9]'}`}
                        >
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Shared with me</span>
                          </div>
                          <span className="text-[10px] bg-[#ECFDF5] text-[#047857] px-1.5 py-0.5 rounded-full font-bold">18</span>
                        </button>

                        <button 
                          onClick={() => setActiveTab('recent')}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${activeTab === 'recent' ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#475569] hover:bg-[#F1F5F9]'}`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Recent Edits</span>
                          </div>
                        </button>

                        <button 
                          onClick={() => setActiveTab('trash')}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${activeTab === 'trash' ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#475569] hover:bg-[#F1F5F9]'}`}
                        >
                          <div className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            <span>Trash</span>
                          </div>
                          <span className="text-[10px] text-[#94A3B8]">30d purge</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-2 mb-2">Folder Tree</p>
                      <div className="space-y-1">
                        {['Campaign Assets 2026', 'Brand Guidelines & SVG', 'Raw Video Footage'].map((folder) => (
                          <button
                            key={folder}
                            onClick={() => setSelectedFolder(folder)}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedFolder === folder ? 'bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm text-[#0F172A] font-semibold' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
                          >
                            <Folder className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span className="truncate">{folder}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Storage Status in Sidebar */}
                  <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] shadow-level-1 mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#0F172A]">Storage Quota</span>
                      <span className="text-[11px] text-[#2563EB] font-bold">64% Used</span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden mb-2">
                      <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '64%' }}></div>
                    </div>
                    <p className="text-[11px] text-[#64748B]">9.6 GB of 15.0 GB used</p>
                  </div>
                </aside>

                {/* Main Table Area */}
                <main className="md:col-span-6 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-[#0F172A]">{selectedFolder}</h2>
                    <span className="text-xs text-[#64748B]">4 items</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                          <th className="pb-2 pl-2">Name</th>
                          <th className="pb-2 hidden sm:table-cell">Role</th>
                          <th className="pb-2 hidden md:table-cell">Size</th>
                          <th className="pb-2 text-right pr-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {files.map((file) => (
                          <tr
                            key={file.id}
                            onClick={() => setSelectedFile(file)}
                            className={`cursor-pointer transition-colors group ${selectedFile?.id === file.id ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'}`}
                          >
                            <td className="py-2.5 pl-2">
                              <div className="flex items-center gap-2.5">
                                {file.type === 'video' && <Video className="w-4 h-4 text-[#3B82F6] shrink-0" />}
                                {file.type === 'doc' && <FileText className="w-4 h-4 text-[#EF4444] shrink-0" />}
                                {file.type === 'image' && <ImageIcon className="w-4 h-4 text-[#10B981] shrink-0" />}
                                {file.type === 'audio' && <Music className="w-4 h-4 text-[#F59E0B] shrink-0" />}
                                <div className="truncate">
                                  <p className="font-semibold text-[#0F172A] truncate max-w-[140px] sm:max-w-[200px]">{file.name}</p>
                                  <p className="text-[10px] text-[#94A3B8]">{file.updated}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 hidden sm:table-cell">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                file.access === 'Owner' ? 'bg-[#ECFDF5] text-[#047857]' : 
                                file.access === 'Editor' ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 
                                'bg-[#F1F5F9] text-[#475569]'
                              }`}>
                                {file.access}
                              </span>
                            </td>
                            <td className="py-2.5 hidden md:table-cell text-[#64748B] font-mono text-[11px]">{file.size}</td>
                            <td className="py-2.5 text-right pr-2">
                              <div className="flex items-center justify-end gap-1 text-[#64748B]">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsShareModalOpen(true);
                                  }}
                                  className="p-1 rounded hover:bg-white hover:text-[#2563EB] transition-colors"
                                  title="Share"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1 rounded hover:bg-white hover:text-[#0F172A] transition-colors" title="Download">
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Drag & Drop Simulation Dropzone */}
                  <div className="mt-4 border-2 border-dashed border-[#CBD5E1] rounded-lg p-5 text-center bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
                    <Cloud className="w-6 h-6 text-[#2563EB] mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-[#0F172A]">Drag & drop raw files or folders here</p>
                    <p className="text-[11px] text-[#64748B]">Supports multi-GB 4K videos, zip files, and lossless masters</p>
                  </div>
                </main>

                {/* Right Metadata / File Preview Panel */}
                <aside className="md:col-span-3 border-t md:border-t-0 md:border-l border-[#E2E8F0] p-4 bg-white">
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Details</span>
                        <button onClick={() => setSelectedFile(null)} className="text-[#94A3B8] hover:text-[#0F172A]">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="aspect-video bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                        {selectedFile.type === 'video' && <Video className="w-8 h-8" />}
                        {selectedFile.type === 'doc' && <FileText className="w-8 h-8" />}
                        {selectedFile.type === 'image' && <ImageIcon className="w-8 h-8" />}
                        {selectedFile.type === 'audio' && <Music className="w-8 h-8" />}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#0F172A] break-all">{selectedFile.name}</h4>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{selectedFile.size} • Last touched {selectedFile.updated}</p>
                      </div>

                      <div className="border-t border-[#F1F5F9] pt-3 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Owner</span>
                          <span className="font-medium text-[#0F172A]">{selectedFile.owner}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Permissions</span>
                          <span className="font-medium text-[#0F172A]">{selectedFile.access}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Location</span>
                          <span className="font-medium text-[#0F172A] truncate max-w-[110px]">{selectedFolder}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setIsShareModalOpen(true)}
                        className="w-full py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Manage Access</span>
                      </button>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-[#94A3B8] p-4">
                      <File className="w-8 h-8 mb-2 stroke-1" />
                      <p className="text-xs font-medium text-[#64748B]">Select a file</p>
                      <p className="text-[11px]">Click any file to inspect metadata, sharing links, and preview</p>
                    </div>
                  )}
                </aside>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------- Granular Sharing Modal (Interactive Demo) -------------------- */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-level-3 w-full max-w-lg overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Share "{selectedFile ? selectedFile.name : selectedFolder}"</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Control granular team permissions and secure public URLs</p>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              
              {/* User Email Invite Field */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Add Collaborators</label>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="teammate@company.com" 
                    className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                    defaultValue="sarah@agency.design"
                  />
                  <select className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-xs font-medium text-[#0F172A]">
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                  <button className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg transition-colors">
                    Invite
                  </button>
                </div>
              </div>

              {/* People with Access List */}
              <div className="space-y-2.5 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">People with access</p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-[11px]">
                      YO
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">You (Current User)</p>
                      <p className="text-[11px] text-[#64748B]">admin@lumina.cloud</p>
                    </div>
                  </div>
                  <span className="text-[#64748B] text-xs font-medium">Owner</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-[11px]">
                      SJ
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">Sarah Jenkins</p>
                      <p className="text-[11px] text-[#64748B]">sarah@agency.design</p>
                    </div>
                  </div>
                  <select className="bg-transparent border border-[#CBD5E1] rounded px-2 py-0.5 text-xs text-[#0F172A]">
                    <option>Editor</option>
                    <option>Viewer</option>
                    <option className="text-[#EF4444]">Revoke Access</option>
                  </select>
                </div>
              </div>

              {/* Public Link Generator with Expiry & Password */}
              <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#F59E0B]" />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">Public Link with Expiry</p>
                      <p className="text-[11px] text-[#64748B]">Auto-revokes after 7 days • View-only by default</p>
                    </div>
                  </div>
                  <span className="bg-[#ECFDF5] text-[#047857] text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://lumina.vault/share/s9x7-k2q1-expire=7d"
                    className="flex-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs font-mono text-[#475569] select-all"
                  />
                  <button 
                    onClick={handleCopy}
                    className="px-3 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#F8FAFC] px-5 py-3 border-t border-[#E2E8F0] flex justify-end">
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- Core Capabilities Grid -------------------- */}
      <section id="features" className="py-20 border-t border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2">Architected For Performance</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
              Everything expected from modern cloud storage.
            </h2>
            <p className="text-sm text-[#475569] mt-3">
              Streamlined file mechanics built on proven relational structures and low-latency storage primitives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-level-1">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                <FolderPlus className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Hierarchical Tree & Breadcrumbs</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Organize deeply nested file trees with instantaneous folder moves, bulk renames, tag taxonomies, and fluid path navigation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-level-1">
              <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] text-[#047857] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Granular Role-Based Access</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Strict Owner, Editor, and Viewer privileges enforced directly via PostgreSQL Row Level Security (RLS) and cryptographic tokens.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-level-1">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Chunked Uploads & Resumes</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Direct-to-S3 signed URLs with automated resumable multi-part upload pipelines for massive raw video and graphic formats.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-level-1">
              <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] text-[#B45309] flex items-center justify-center mb-4">
                <Key className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Expiring Public Links & Passwords</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Deliver client deliverables safely. Set temporary 24h/7d expiry windows, optional PIN protections, and enforce view-only access.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-level-1">
              <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center mb-4">
                <Trash2 className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">30-Day Trash & Retention Window</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Accidentally wiped an entire folder? Restores are one click away with automated background queues handling safe 30-day retention.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-level-1">
              <div className="w-10 h-10 rounded-lg bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center mb-4">
                <Search className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Sub-millisecond Search & Filter</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Filter instantly across gigabytes of assets by MIME type, owner, modification timestamp, tags, and favorited states.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------- Tech Architecture Breakdown -------------------- */}
      <section id="security" className="py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-level-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded">
                  System Architecture
                </span>
                <h3 className="text-2xl font-bold text-[#0F172A]">
                  Enterprise stack built on Postgres & Node.js
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Engineered with a reliable decoupled architecture: RESTful Express micro-services, indexed PostgreSQL tree pointers for sub-millisecond folder traversals, and Supabase S3 bucket distribution.
                </p>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-[#0F172A]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span>PostgreSQL database with indexed closure trees</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0F172A]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span>Supabase Object Storage with CDN edge caching</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0F172A]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span>Background worker queues for video & image thumbnailing</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-5 font-mono text-xs text-[#475569]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#CBD5E1] text-[11px]">
                  <span className="font-semibold text-[#0F172A]">API Response Schema: GET /api/v1/files/tree</span>
                  <span className="text-[#10B981] font-bold">200 OK • 18ms</span>
                </div>
                <pre className="text-[11px] leading-relaxed overflow-x-auto text-[#0F172A]">
{`{
  "status": "success",
  "folder_id": "fld_921841",
  "breadcrumbs": ["Root", "Marketing", "Campaign Assets 2026"],
  "permissions": {
    "role": "Owner",
    "can_write": true,
    "can_share": true
  },
  "storage_engine": "supabase_s3_standard",
  "items_count": 4,
  "retention_policy_days": 30
}`}
                </pre>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* -------------------- Interactive Storage & Pricing Calculator -------------------- */}
      <section id="pricing" className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2">Transparent Pricing</p>
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">
              Pay only for what you store.
            </h2>
            <p className="text-xs text-[#475569] mt-2">
              Start free forever with 15 GB. Scale up smoothly as your team’s high-res media library expands.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-[#F8FAFC] rounded-xl border border-[#CBD5E1] p-6 sm:p-8 shadow-level-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Capacity Slider</p>
                <h4 className="text-2xl font-bold text-[#0F172A] mt-1">{storageSlider} GB Storage</h4>
              </div>
              
              <div className="text-right sm:border-l sm:border-[#CBD5E1] sm:pl-6">
                <p className="text-xs font-medium text-[#64748B]">Estimated Cost</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-bold text-[#2563EB]">
                    ${calculateCost(storageSlider)}
                  </span>
                  <span className="text-xs text-[#64748B]">/ month</span>
                </div>
              </div>
            </div>

            {/* Slider */}
            <input 
              type="range" 
              min="15" 
              max="2000" 
              step="25"
              value={storageSlider}
              onChange={(e) => setStorageSlider(Number(e.target.value))}
              className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#2563EB] mb-4"
            />

            <div className="flex justify-between text-[11px] text-[#64748B] font-medium">
              <span>15 GB (Free Forever)</span>
              <span>500 GB</span>
              <span>1 TB</span>
              <span>2 TB (Enterprise)</span>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>Unlimited sharing links, viewer roles, and zero-loss downloads</span>
              </div>

              <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors">
                Provision Storage Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------- Ready To Deploy CTA -------------------- */}
      <section className="py-16 bg-[#0F172A] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-medium text-[#93C5FD]">
            <Cloud className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Ready for your media pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Stop losing files in messy storage buckets.
          </h2>

          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
            Get started in less than 30 seconds. No credit card required. Experience clean folder hierarchies and frictionless access control.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs shadow-md transition-all">
              Create Free Workspace
            </button>
            <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white font-medium text-xs transition-all">
              View API Documentation
            </button>
          </div>
        </div>
      </section>

      {/* -------------------- Footer -------------------- */}
      <footer className="bg-white border-t border-[#E2E8F0] py-12 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#2563EB] flex items-center justify-center text-white">
                <Cloud className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-[#0F172A]">Lumina Vault</span>
            </div>
            <p className="max-w-xs text-[11px] leading-relaxed">
              Precision minimal cloud storage service. High data density, S3 reliability, and frictionless team collaboration.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="flex h-2 w-2 rounded-full bg-[#10B981]"></span>
              <span className="text-[11px] font-medium text-[#047857]">All systems operational (Supabase S3)</span>
            </div>
          </div>

          <div>
            <p className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] mb-3">Product</p>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-[#0F172A]">Folder Tree</a></li>
              <li><a href="#demo" className="hover:text-[#0F172A]">Live Sandbox</a></li>
              <li><a href="#security" className="hover:text-[#0F172A]">Access Roles</a></li>
              <li><a href="#pricing" className="hover:text-[#0F172A]">Storage Quotas</a></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] mb-3">Security</p>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#0F172A]">Postgres RLS</a></li>
              <li><a href="#" className="hover:text-[#0F172A]">Expiring Links</a></li>
              <li><a href="#" className="hover:text-[#0F172A]">30-Day Trash Purge</a></li>
              <li><a href="#" className="hover:text-[#0F172A]">Encryption Keys</a></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] mb-3">Developers</p>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#0F172A]">Express REST API</a></li>
              <li><a href="#" className="hover:text-[#0F172A]">Supabase Storage</a></li>
              <li><a href="#" className="hover:text-[#0F172A]">Webhook Events</a></li>
              <li><a href="#" className="hover:text-[#0F172A]">CLI Upload Tool</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
          <p>© {new Date().getFullYear()} Lumina Clarity Design System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#0F172A]">Privacy Policy</a>
            <a href="#" className="hover:text-[#0F172A]">Terms of Service</a>
            <a href="#" className="hover:text-[#0F172A]">Security SLA</a>
          </div>
        </div>
      </footer>

    </div>
  );
}