import { AlertIcon } from './Icons';

export default function Loading({ locationName }) {
  return (
    <div className='flex flex-col items-center justify-center py-24 gap-4 animate-fade-slide-up'>
      <div className='relative'>
        <div
          className='w-14 h-14 rounded-full border-[3px] border-t-transparent animate-spin'
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        />
        <span className='absolute inset-0 flex items-center justify-center animate-pulse-skeleton'>
          <AlertIcon size={20} style={{ color: 'var(--accent)' }} />
        </span>
      </div>
      <div className='text-center'>
        <p className='text-sm font-medium animate-pulse-skeleton' style={{ color: 'var(--text-primary)' }}>
          Đang tải dữ liệu...
        </p>
        {locationName && (
          <p className='text-xs mt-1' style={{ color: 'var(--text-muted)' }}>{locationName}</p>
        )}
      </div>
      <div className='flex gap-1 mt-2'>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className='w-2 h-2 rounded-full animate-pulse-skeleton'
            style={{
              backgroundColor: 'var(--accent)',
              animationDelay: (i * 0.2) + 's',
            }}
          />
        ))}
      </div>
    </div>
  );
}