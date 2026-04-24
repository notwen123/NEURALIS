'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  createChart,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  Time,
} from 'lightweight-charts';

type Timeframe = '30m' | '1h' | '4h' | '1d' | '1w';

export const PerformanceChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const toolTipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const [timeframe, setTimeframe] = useState<Timeframe>('1h');
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ price: '—', change: '0.00', isPositive: true });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 1. QUANTITATIVE FALLBACK AGGREGATOR (For 30m/1h)
  const manualAggregate = (prices: any[], volumes: any[], intervalMs: number) => {
    const buckets = new Map<number, { p: number[], v: number }>();
    prices.forEach(([ts, p], i) => {
      const bTs = Math.floor(ts / intervalMs) * intervalMs;
      if (!buckets.has(bTs)) buckets.set(bTs, { p: [], v: 0 });
      buckets.get(bTs)!.p.push(p);
      if (volumes[i]) buckets.get(bTs)!.v += volumes[i][1];
    });

    return Array.from(buckets.keys()).sort((a, b) => a - b)
      .filter(ts => buckets.get(ts)!.p.length >= 2) // Reject sparse
      .map(ts => {
        const b = buckets.get(ts)!;
        return {
          time: (ts / 1000) as Time,
          open: b.p[0],
          high: Math.max(...b.p),
          low: Math.min(...b.p),
          close: b.p[b.p.length - 1],
          volume: b.v
        };
      });
  };

  // 2. CHART ENVIRONMENT (CMC HARDENED)
  useEffect(() => {
    if (!isMounted || !chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#050508' }, textColor: '#64748b', fontFamily: 'Inter, sans-serif' },
      grid: { vertLines: { color: 'rgba(30,32,38,0.3)' }, horzLines: { color: 'rgba(30,32,38,0.3)' } },
      rightPriceScale: { borderColor: 'rgba(51,65,85,0.5)', autoScale: true, scaleMargins: { top: 0.05, bottom: 0.15 } },
      timeScale: { borderColor: 'rgba(51,65,85,0.5)', timeVisible: true, barSpacing: 4, minBarSpacing: 3, rightOffset: 2 },
      crosshair: { mode: 0, vertLine: { color: '#64748b', width: 1, style: 2 }, horzLine: { color: '#64748b', width: 1, style: 2 } },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
      priceFormat: { type: 'price', precision: 5, minMove: 0.00001 },
    });

    const vSeries = chart.addSeries(HistogramSeries, { color: '#26a69a', priceScaleId: '' });
    vSeries.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });

    chart.subscribeCrosshairMove((p) => {
      if (!toolTipRef.current || !chartContainerRef.current) return;
      if (!p.point || !p.time) { toolTipRef.current.style.display = 'none'; return; }
      const data = p.seriesData.get(series) as any;
      const vData = p.seriesData.get(vSeries) as any;
      if (data) {
        toolTipRef.current.style.display = 'block';
        toolTipRef.current.innerHTML = `
                <div style="color:#64748b; font-size:10px">${new Date((p.time as number) * 1000).toLocaleString()}</div>
                <div style="display:flex;gap:8px;font-family:monospace;white-space:nowrap">
                    <span>O <span style="color:white">${data.open.toFixed(5)}</span></span>
                    <span>H <span style="color:#26a69a">${data.high.toFixed(5)}</span></span>
                    <span>L <span style="color:#ef5350">${data.low.toFixed(5)}</span></span>
                    <span>C <span style="color:white">${data.close.toFixed(5)}</span></span>
                </div>
                <div style="font-size:10px;color:#3b82f6;margin-top:2px">VOL: ${vData ? (vData.value / 1000).toFixed(2) + 'K' : '—'}</div>
            `;
        toolTipRef.current.style.left = `${Math.min(p.point.x + 15, chartContainerRef.current.clientWidth - 180)}px`;
        toolTipRef.current.style.top = `${Math.min(p.point.y + 15, chartContainerRef.current.clientHeight - 80)}px`;
      }
    });

    chartRef.current = chart; seriesRef.current = series; volumeRef.current = vSeries;
    const resObs = new ResizeObserver(() => { if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight }); });
    resObs.observe(chartContainerRef.current);
    return () => { resObs.disconnect(); chart.remove(); };
  }, [isMounted]);

  // 3. HYBRID DATA HUB (STEP 2 REPAIR)
  const fetchData = useCallback(async (isUpdate = false, forceTf?: Timeframe) => {
    if (!seriesRef.current || !volumeRef.current) return;
    const tf = forceTf || timeframe;

    try {
      let candleData: any[] = [];
      let volumeData: any[] = [];

      if (tf === '30m' || tf === '1h' || tf === '4h') {
        // Use Market Chart + Aggregation for intraday truth
        const days = tf === '30m' ? '1' : tf === '1h' ? '1' : '7';
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/initia/market_chart?vs_currency=usd&days=${days}`);
        const raw = await res.json();
        const intervalMs = tf === '30m' ? 1800000 : tf === '1h' ? 3600000 : 14400000;
        const aggregated = manualAggregate(raw.prices, raw.total_volumes, intervalMs);
        candleData = aggregated.map(c => ({ time: c.time, open: c.open, high: c.high, low: c.low, close: c.close }));
        volumeData = aggregated.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? 'rgba(38,166,154,0.3)' : 'rgba(239,83,80,0.3)' }));
      } else if (tf === '1d') {
        // Use Native OHLC for daily precision
        const [ohlcRes, mktRes] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/initia/ohlc?vs_currency=usd&days=365`),
          fetch(`https://api.coingecko.com/api/v3/coins/initia/market_chart?vs_currency=usd&days=365`)
        ]);
        const oData = await ohlcRes.json();
        const vData = await mktRes.json();
        candleData = oData.map((d: any) => ({ time: (d[0] / 1000) as Time, open: d[1], high: d[2], low: d[3], close: d[4] }));
        volumeData = candleData.map(c => {
          const vMatch = vData.total_volumes.find((v: any) => Math.abs(v[0] / 1000 - (c.time as number)) < 43200);
          return { time: c.time, value: vMatch ? vMatch[1] : 0, color: c.close >= c.open ? 'rgba(38,166,154,0.3)' : 'rgba(239,83,80,0.3)' };
        });
      } else if (tf === '1w') {
        // Group Daily into Weekly
        const ohlcRes = await fetch(`https://api.coingecko.com/api/v3/coins/initia/ohlc?vs_currency=usd&days=max`);
        const oData = await ohlcRes.json();
        const formattedDaily = oData.map((d: any) => ({ time: d[0], open: d[1], high: d[2], low: d[3], close: d[4] }));

        const weeklyBuckets = new Map<number, any[]>();
        formattedDaily.forEach((d: any) => {
          const wTs = Math.floor(d.time / 604800000) * 604800000;
          if (!weeklyBuckets.has(wTs)) weeklyBuckets.set(wTs, []);
          weeklyBuckets.get(wTs)!.push(d);
        });

        candleData = Array.from(weeklyBuckets.keys()).sort((a, b) => a - b).map(ts => {
          const pts = weeklyBuckets.get(ts)!;
          return {
            time: (ts / 1000) as Time,
            open: pts[0].open,
            high: Math.max(...pts.map(p => p.high)),
            low: Math.min(...pts.map(p => p.low)),
            close: pts[pts.length - 1].close
          };
        });
        volumeData = candleData.map(c => ({ time: c.time, value: 0, color: 'rgba(38,166,154,0.3)' })); // Simplified for W
      }

      if (isUpdate) {
        seriesRef.current.update(candleData[candleData.length - 1]);
        volumeRef.current.update(volumeData[volumeData.length - 1]);
      } else {
        setLoading(true);
        seriesRef.current.setData(candleData);
        volumeRef.current.setData(volumeData);
        chartRef.current?.timeScale().fitContent();
        setLoading(false);
      }

      const l = candleData[candleData.length - 1];
      setStats({ price: l.close.toFixed(5), change: (((l.close - candleData[0].open) / candleData[0].open) * 100).toFixed(2), isPositive: l.close >= candleData[0].open });
    } catch (e) { console.warn(e); }
  }, [timeframe]);

  useEffect(() => {
    if (!isMounted) return;
    fetchData(false);
    const int = setInterval(() => fetchData(true), 15000);
    return () => clearInterval(int);
  }, [fetchData, isMounted]);

  return (
    <div className="h-[85vh] flex flex-col bg-[#050508] border border-white/5 relative overflow-hidden">
      <div className="relative z-50 flex items-center justify-between px-6 py-2 border-b border-white/[0.04] bg-[#0A0A0F]">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <img src="/landing/token.png" className="w-6 h-6 rounded-full" />
            <span className="text-sm font-bold text-white tracking-tight uppercase font-mono">INITIA/USDC</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-2xl font-mono font-bold text-white">${stats.price}</span>
            <span className={`text-xs font-bold ${stats.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>{stats.isPositive ? '▲' : '▼'}{stats.change}%</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/5 rounded p-0.5 border border-white/10">
          {(['30m', '1h', '4h', '1d', '1w'] as Timeframe[]).map(t => (
            <button key={t} onClick={() => { setTimeframe(t); fetchData(false, t); }} className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${timeframe === t ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-row relative z-10">
        <div className="w-10 border-r border-white/5 bg-black/40 flex flex-col items-center py-6 gap-6" />
        <div className="flex-1 relative overflow-hidden">
          {loading && <div className="absolute inset-0 z-50 bg-[#050508]/80 flex flex-col items-center justify-center gap-4"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /><span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Direct Hydration</span></div>}
          <div ref={toolTipRef} className="absolute hidden z-50 p-3 bg-slate-900/95 border border-white/10 rounded-lg shadow-2xl pointer-events-none text-[11px] backdrop-blur-md" style={{ position: 'absolute', top: 0, left: 0 }} />
          <div ref={chartContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};
