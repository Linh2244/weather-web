import SearchBox from './SearchBox';
import { MenuIcon, LocationIcon, CloseIcon } from './Icons';
import { useState } from 'react';

export default function Layout({ children, onSearch, locationName }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='min-h-screen transition-colors duration-300' style={{ backgroundColor: 'var(--bg-primary)' }}>
      <header
        className='fixed top-0 left-0 right-0 z-50'
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <div className='max-w-2xl mx-auto px-4 py-3 flex items-center justify-between'>
          <button
            onClick={() => setMenuOpen(true)}
            className='w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95'
            style={{ color: 'var(--text-primary)' }}
          >
            <MenuIcon size={20} />
          </button>
          <div className='flex items-center gap-1.5'>
            <span className='text-sm font-semibold' style={{ color: 'var(--text-primary)' }}>{locationName}</span>
            <LocationIcon size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <div className='w-9' />
        </div>
      </header>

      {menuOpen && (
        <div
          className='fixed inset-0 z-[100] flex'
          onClick={() => setMenuOpen(false)}
        >
          <div
            className='fixed inset-0 bg-black/40 animate-fade-in'
          />
          <div
            className='w-full max-w-sm h-full relative animate-slide-in-left'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between px-5 py-4' style={{ borderBottom: '1px solid var(--border)' }}>
              <span className='text-sm font-semibold' style={{ color: 'var(--text-primary)' }}>Tìm kiếm</span>
              <button
                onClick={() => setMenuOpen(false)}
                className='w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 active:scale-90'
                style={{ color: 'var(--text-muted)' }}
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <div className='px-5 pt-4'>
              <SearchBox onSelect={(loc) => { onSearch(loc); setMenuOpen(false); }} />
            </div>
          </div>
          <div className='flex-1' />
        </div>
      )}

      <main className='max-w-2xl mx-auto px-4 pt-16 pb-8 space-y-4' style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
