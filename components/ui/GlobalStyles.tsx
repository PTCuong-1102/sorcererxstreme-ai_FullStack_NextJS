'use client';

import { useEffect } from 'react';

export default function GlobalStyles() {
  useEffect(() => {
    // Inject critical CSS styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* Ensure Tailwind CSS base styles */
      .bg-gray-950 { background-color: #030712 !important; }
      .bg-gray-900 { background-color: #111827 !important; }
      .bg-gray-800 { background-color: #1f2937 !important; }
      .bg-gray-700 { background-color: #374151 !important; }
      
      /* Glass effect backgrounds with proper opacity */
      .bg-gray-800\\/60 { background-color: rgba(31, 41, 55, 0.6) !important; }
      .bg-gray-800\\/40 { background-color: rgba(31, 41, 55, 0.4) !important; }
      .bg-gray-800\\/30 { background-color: rgba(31, 41, 55, 0.3) !important; }
      .bg-gray-900\\/50 { background-color: rgba(17, 24, 39, 0.5) !important; }
      .bg-gray-900\\/30 { background-color: rgba(17, 24, 39, 0.3) !important; }
      
      /* Text colors */
      .text-white { color: #ffffff !important; }
      .text-gray-300 { color: #d1d5db !important; }
      .text-gray-400 { color: #9ca3af !important; }
      .text-gray-500 { color: #6b7280 !important; }
      
      /* Border colors with opacity */
      .border-gray-700\\/30 { border-color: rgba(55, 65, 81, 0.3) !important; }
      .border-gray-600\\/50 { border-color: rgba(75, 85, 99, 0.5) !important; }
      .border-gray-600\\/30 { border-color: rgba(75, 85, 99, 0.3) !important; }
      .border-gray-600\\/20 { border-color: rgba(75, 85, 99, 0.2) !important; }
      
      /* Backdrop blur effects */
      .backdrop-blur-xl { 
        backdrop-filter: blur(24px) !important; 
        -webkit-backdrop-filter: blur(24px) !important; 
      }
      .backdrop-blur-sm { 
        backdrop-filter: blur(8px) !important; 
        -webkit-backdrop-filter: blur(8px) !important; 
      }
      
      /* Gradient backgrounds */
      .bg-gradient-to-br { 
        background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)) !important; 
      }
      .bg-gradient-to-r { 
        background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important; 
      }
      
      /* Animation keyframes */
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes pulse-glow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      /* Animation classes */
      .animate-float { animation: float 3s ease-in-out infinite !important; }
      .animate-twinkle { animation: twinkle 2s ease-in-out infinite !important; }
      .animate-pulse-slow { animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
      .star-twinkle { animation: twinkle 2s ease-in-out infinite !important; }
      
      /* Hover effects */
      .hover\\:scale-105:hover { transform: scale(1.05) !important; }
      .hover\\:-translate-y-1:hover { transform: translateY(-0.25rem) !important; }
      .hover\\:bg-gray-800\\/60:hover { background-color: rgba(31, 41, 55, 0.6) !important; }
      
      /* Shadow effects */
      .shadow-lg { 
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; 
      }
      .shadow-xl { 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; 
      }
      
      /* Rounded corners */
      .rounded-xl { border-radius: 0.75rem !important; }
      .rounded-2xl { border-radius: 1rem !important; }
      .rounded-full { border-radius: 9999px !important; }
      
      /* Flex utilities */
      .flex { display: flex !important; }
      .items-center { align-items: center !important; }
      .justify-center { justify-content: center !important; }
      .justify-between { justify-content: space-between !important; }
      
      /* Grid utilities */
      .grid { display: grid !important; }
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
      
      /* Responsive grid */
      @media (min-width: 768px) {
        .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
      }
      
      @media (min-width: 1024px) {
        .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
      }
      
      /* Spacing utilities */
      .gap-4 { gap: 1rem !important; }
      .gap-6 { gap: 1.5rem !important; }
      .gap-8 { gap: 2rem !important; }
      
      /* Padding utilities */
      .p-1 { padding: 0.25rem !important; }
      .p-4 { padding: 1rem !important; }
      .p-6 { padding: 1.5rem !important; }
      .p-8 { padding: 2rem !important; }
      .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
      .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
      
      /* Margin utilities */
      .mb-2 { margin-bottom: 0.5rem !important; }
      .mb-4 { margin-bottom: 1rem !important; }
      .mb-6 { margin-bottom: 1.5rem !important; }
      .mb-8 { margin-bottom: 2rem !important; }
      .mr-2 { margin-right: 0.5rem !important; }
      
      /* Width and height */
      .w-full { width: 100% !important; }
      .h-full { height: 100% !important; }
      .w-4 { width: 1rem !important; }
      .h-4 { height: 1rem !important; }
      .w-5 { width: 1.25rem !important; }
      .h-5 { height: 1.25rem !important; }
      .w-12 { width: 3rem !important; }
      .h-12 { height: 3rem !important; }
      .w-16 { width: 4rem !important; }
      .h-16 { height: 4rem !important; }
      
      /* Position utilities */
      .relative { position: relative !important; }
      .absolute { position: absolute !important; }
      .fixed { position: fixed !important; }
      .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
      
      /* Z-index */
      .z-10 { z-index: 10 !important; }
      .z-50 { z-index: 50 !important; }
      .-z-10 { z-index: -10 !important; }
      
      /* Overflow */
      .overflow-hidden { overflow: hidden !important; }
      .overflow-auto { overflow: auto !important; }
      
      /* Pointer events */
      .pointer-events-none { pointer-events: none !important; }
      .cursor-pointer { cursor: pointer !important; }
      
      /* Transition */
      .transition-all { 
        transition-property: all !important; 
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; 
        transition-duration: 150ms !important; 
      }
      
      /* Font utilities */
      .font-medium { font-weight: 500 !important; }
      .font-bold { font-weight: 700 !important; }
      .text-sm { font-size: 0.875rem !important; }
      .text-lg { font-size: 1.125rem !important; }
      .text-xl { font-size: 1.25rem !important; }
      .text-2xl { font-size: 1.5rem !important; }
      .text-3xl { font-size: 1.875rem !important; }
      .text-center { text-align: center !important; }
      
      /* Custom cosmic background */
      .cosmic-bg {
        background: 
          radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.15), transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.15), transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(147, 51, 234, 0.1), transparent 50%) !important;
      }
      
      /* Whitespace */
      .whitespace-nowrap { white-space: nowrap !important; }
      
      /* Form styling */
      input[type="date"]::-webkit-calendar-picker-indicator,
      input[type="time"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(31, 41, 55, 0.5);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(107, 114, 128, 0.5);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(107, 114, 128, 0.8);
      }
      
      /* Ensure body styling */
      body {
        font-family: 'Be Vietnam Pro', sans-serif !important;
        background: #030712 !important;
        color: #ffffff !important;
        margin: 0;
        padding: 0;
      }
      
      /* Min height */
      .min-h-screen { min-height: 100vh !important; }
      
      /* Max width */
      .max-w-2xl { max-width: 42rem !important; }
      .max-w-4xl { max-width: 56rem !important; }
      .max-w-6xl { max-width: 72rem !important; }
      .mx-auto { margin-left: auto !important; margin-right: auto !important; }
      
      /* Leading */
      .leading-relaxed { line-height: 1.625 !important; }
      
      /* Border */
      .border { border-width: 1px !important; }
      
      /* Disabled state */
      .disabled\\:opacity-50:disabled { opacity: 0.5 !important; }
      
      /* Focus */
      .focus\\:outline-none:focus { outline: none !important; }
      .focus\\:ring-2:focus { box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.5) !important; }
      
      /* Hidden utility */
      .hidden { display: none !important; }
      
      /* Flex-1 */
      .flex-1 { flex: 1 1 0% !important; }
    `;
    
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return null;
}