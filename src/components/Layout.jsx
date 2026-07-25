import { useTheme } from './ThemeProvider';
import SearchBox from './SearchBox';
import { SunIcon, MoonIcon } from './Icons';

export default function Layout({ children, onSearch }) {
  const { dark, toggle } = useTheme();

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
        <div className='max-w-2xl mx-auto px-4 py-3 flex items-center gap-3'>
          <div className='flex-1'>
            <SearchBox onSelect={onSearch} />
          </div>
          <button
            onClick={toggle}
            className='glass-icon-btn'
            title={dark ? 'Chế độ sáng' : 'Chế độ tối'}
            style={{ color: 'var(--text-primary)' }}
          >
            {dark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
        </div>
      </header>
      <main className='max-w-2xl mx-auto px-4 pt-20 pb-8 space-y-4' style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}