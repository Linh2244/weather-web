export default function Layout({ children }) {
  return (
    <div className='min-h-screen transition-colors duration-300' style={{ backgroundColor: 'var(--bg-primary)' }}>
      <main className='max-w-2xl mx-auto px-4 py-8 space-y-4' style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}