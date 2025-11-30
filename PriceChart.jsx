import { useEffect, useRef } from "react";

/**
 * Plain Chart.js (loaded from CDN) line chart.
 * Expects props.series in the shape returned by /api/prices/{symbol}.
 */
export default function PriceChart({ series }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // no data yet
    if (!series || !series.bars?.length || !window.Chart) return;

    const ctx = canvasRef.current.getContext("2d");

    // destroy previous chart instance if it exists to avoid leaks
    if (canvasRef.current._chartInstance) {
      canvasRef.current._chartInstance.destroy();
    }

    const labels = series.bars.map(b => new Date(b.date).toLocaleDateString());
    const data = series.bars.map(b => b.close);

    const chart = new window.Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: `${series.symbol} Close`,
          data,
          tension: 0.2,
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { maxTicksLimit: 6 } },
          y: { beginAtZero: false }
        },
        plugins: { legend: { display: true } }
      }
    });

    // stash instance so we can destroy on update
    canvasRef.current._chartInstance = chart;

    return () => {
      chart.destroy();
    };
  }, [series]);

  return (
    <div style={{ height: 320 }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}