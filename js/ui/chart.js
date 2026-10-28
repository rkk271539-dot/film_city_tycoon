/**
 * Interactive Canvas Line Chart Component
 * High-DPI responsive touch-enabled chart with smooth curves, gradient fills, and tooltips.
 */

window.StudioGame = window.StudioGame || {};
window.StudioGame.UI = window.StudioGame.UI || {};

window.StudioGame.UI.Chart = (function() {
  function render(canvas, dataPoints, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 340;
    const height = rect.height || 180;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (!dataPoints || dataPoints.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.font = '13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Advance turns to generate net worth trend line...', width / 2, height / 2);
      return;
    }

    const padding = { top: 20, right: 15, bottom: 25, left: 15 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Calculate Min and Max
    const values = dataPoints.map(d => d.value);
    let minVal = Math.min(...values);
    let maxVal = Math.max(...values);

    // Ensure range buffer
    if (minVal === maxVal) {
      minVal *= 0.95;
      maxVal *= 1.05;
    } else {
      const buffer = (maxVal - minVal) * 0.1;
      minVal -= buffer;
      maxVal += buffer;
    }

    const getX = (index) => padding.left + (index / (dataPoints.length - 1)) * chartW;
    const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

    // Draw Subtle Grid Lines (3 horizontal lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = padding.top + (chartH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Color definitions
    const strokeColor = options.lineColor || '#10b981'; // Emerald
    const fillColor = options.fillColor || 'rgba(16, 185, 129, 0.15)';

    // Path creation
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(values[0]));

    for (let i = 0; i < dataPoints.length - 1; i++) {
      const x0 = getX(i);
      const y0 = getY(values[i]);
      const x1 = getX(i + 1);
      const y1 = getY(values[i + 1]);

      const cx = (x0 + x1) / 2;
      ctx.bezierCurveTo(cx, y0, cx, y1, x1, y1);
    }

    // Fill gradient underneath
    const fillPath = new Path2D();
    fillPath.moveTo(getX(0), getY(values[0]));
    for (let i = 0; i < dataPoints.length - 1; i++) {
      const x0 = getX(i);
      const y0 = getY(values[i]);
      const x1 = getX(i + 1);
      const y1 = getY(values[i + 1]);
      const cx = (x0 + x1) / 2;
      fillPath.bezierCurveTo(cx, y0, cx, y1, x1, y1);
    }
    fillPath.lineTo(getX(dataPoints.length - 1), height - padding.bottom);
    fillPath.lineTo(getX(0), height - padding.bottom);
    fillPath.closePath();

    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, fillColor);
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill(fillPath);

    // Stroke line
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // End point highlight pulse circle
    const lastX = getX(dataPoints.length - 1);
    const lastY = getY(values[values.length - 1]);
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Bottom Date Labels (start and end)
    ctx.fillStyle = '#64748b';
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(dataPoints[0].label || 'Day 1', padding.left, height - 8);

    ctx.textAlign = 'right';
    ctx.fillText(dataPoints[dataPoints.length - 1].label || 'Now', width - padding.right, height - 8);
  }

  return {
    render
  };
})();
