import { memo } from 'react';
import { getUVInfo } from '../utils/formatters';
import { useInView } from '../hooks/useInView';

const UvIndex = memo(function UvIndex({ data }) {
  const [ref, inView] = useInView();
  if (!data) return null;
  const currentUV = data.current?.uv_index;
  const dailyUV = data.daily?.uv_index_max?.[0];
  const uv = currentUV ?? dailyUV;
  if (uv == null) return null;
  const info = getUVInfo(uv);
  const pct = Math.min(uv / 11 * 100, 100);

  return (
    <div ref={ref} className={`glass-card reveal ${inView ? 'visible' : ''}`}>
      <h3 className='text-[13px] font-semibold mb-3 tracking-wide' style={{ color: 'var(--text-muted)' }}>
        CHỈ SỐ UV
      </h3>

      <div className='flex items-baseline gap-2 mb-3'>
        <span className='text-[32px] font-bold leading-none' style={{ color: info.color }}>
          {uv.toFixed(1)}
        </span>
        <span className='text-sm font-semibold' style={{ color: info.color }}>{info.label}</span>
      </div>

      <div className='relative mb-1'>
        <div className='h-[6px] rounded-full overflow-hidden' style={{ background: 'linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444, #a855f7, #7c3aed)' }}>
          <div
            className='h-full w-[3px] rounded-full bg-white'
            style={{
              marginLeft: inView ? pct + '%' : '0%',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 4px rgba(0,0,0,0.3)',
              transition: 'margin-left 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s',
            }}
          />
        </div>
      </div>

      {dailyUV != null && currentUV != null && currentUV !== dailyUV && (
        <div className='flex gap-4 mt-3 pt-3' style={{ borderTop: '1px solid var(--border)' }}>
          <div className='flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />
            <span className='text-[11px]' style={{ color: 'var(--text-muted)' }}>
              Hiện tại: <span className='font-semibold' style={{ color: 'var(--text-primary)' }}>{currentUV.toFixed(1)}</span>
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-orange-500' />
            <span className='text-[11px]' style={{ color: 'var(--text-muted)' }}>
              Cao nhất: <span className='font-semibold' style={{ color: 'var(--text-primary)' }}>{dailyUV.toFixed(1)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

export default UvIndex;