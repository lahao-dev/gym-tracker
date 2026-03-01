// chart.js - Biểu đồ tiến trình tạ theo thời gian

let progressChart = null; // Instance Chart.js hiện tại

async function loadChart() {
  const name = document.getElementById('chart-exercise-select').value;
  const canvas = document.getElementById('progress-chart');

  if (!name) {
    if (progressChart) { progressChart.destroy(); progressChart = null; }
    return;
  }

  try {
    const data = await api.getProgress(name);

    // Hủy chart cũ nếu có
    if (progressChart) progressChart.destroy();

    if (data.length === 0) {
      canvas.style.display = 'none';
      return;
    }
    canvas.style.display = 'block';

    // Vẽ chart mới
    progressChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.map(d => {
          const [y, m, day] = d.date.split('-');
          return `${day}/${m}/${y}`;
        }),
        datasets: [{
          label: `Mức tạ (kg) - ${name}`,
          data: data.map(d => d.weight_kg),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: '#3b82f6',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.parsed.y} kg · ${data[ctx.dataIndex].sets}×${data[ctx.dataIndex].reps}`
            }
          }
        },
        scales: {
          y: {
            title: { display: true, text: 'kg' },
            beginAtZero: false,
            grid: { color: '#f3f4f6' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  } catch (e) {
    console.error('Lỗi tải biểu đồ:', e);
  }
}