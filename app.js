document.addEventListener('DOMContentLoaded', () => {
    console.log("Real-time trading simulation engine online.");

    // 1. Initial State Variables
    let currentBalance = 600.00;
    try {
        const storedBalance = localStorage.getItem('admin_balance');
        if (storedBalance) currentBalance = parseFloat(storedBalance);
    } catch (e) {
        console.error("Storage access error:", e);
    }

    let previousBalance = currentBalance;

    function updateDisplayElements() {
        const balanceDisplay = document.getElementById('balance-display');
        const trendIndicator = document.getElementById('trend-indicator'); // Optional element for percentage text

        if (balanceDisplay) {
            balanceDisplay.innerText = '$' + currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        if (trendIndicator) {
            const difference = currentBalance - previousBalance;
            if (difference >= 0) {
                trendIndicator.innerText = `+${((difference / (previousBalance || 1)) * 100).toFixed(2)}% Today`;
                trendIndicator.style.color = '#10b981'; // Green text
            } else {
                trendIndicator.innerText = `${((difference / (previousBalance || 1)) * 100).toFixed(2)}% Today`;
                trendIndicator.style.color = '#ef4444'; // Red text
            }
        }
    }
    updateDisplayElements();

    // 2. Active Technical Chart Controller
    let tradingChart = null;
    const ctx = document.getElementById('LivePerformanceChart');

    function buildTradingChart() {
        if (!ctx || typeof Chart === 'undefined') return;

        const activeTrend = localStorage.getItem('chart_trend_directive') || 'stable';
        
        // Generate continuous sequence data reflecting structural market trends
        let dataPoints = [];
        let seedValue = currentBalance;
        
        // Construct 7 history segments backtracking from current balance
        for (let i = 0; i < 7; i++) {
            let variance = (Math.random() - 0.48) * (seedValue * 0.015); // Normal distribution noise
            if (activeTrend === 'upward') variance += (seedValue * 0.005);
            if (activeTrend === 'downward') variance -= (seedValue * 0.005);
            
            dataPoints.unshift(seedValue);
            seedValue -= variance;
        }

        if (tradingChart) {
            tradingChart.destroy();
        }

        const chartContext = ctx.getContext('2d');

        // Dynamically alter the core line asset aesthetics depending on net movement
        const currentTrendDirection = dataPoints[dataPoints.length - 1] - dataPoints[0];
        const marketThemeColor = currentTrendDirection >= 0 ? '#10b981' : '#ef4444'; // Green if up, Red if down

        const gradientArea = chartContext.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight || 250);
        if (currentTrendDirection >= 0) {
            gradientArea.addColorStop(0, 'rgba(16, 185, 129, 0.20)');
            gradientArea.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        } else {
            gradientArea.addColorStop(0, 'rgba(239, 68, 68, 0.20)');
            gradientArea.addColorStop(1, 'rgba(239, 68, 68, 0.00)');
        }

        tradingChart = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: ['02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM', '12:00 AM', '02:00 AM'],
                datasets: [{
                    data: dataPoints,
                    borderColor: marketThemeColor,
                    borderWidth: 2.5,
                    pointBackgroundColor: marketThemeColor,
                    pointRadius: 2,
                    tension: 0.35,
                    fill: true,
                    backgroundColor: gradientArea
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { color: 'rgba(51, 65, 85, 0.12)', drawBorder: false },
                        ticks: { color: '#64748b', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.12)', drawBorder: false },
                        ticks: { 
                            color: '#64748b', 
                            font: { size: 10 },
                            callback: function(val) { return '$' + val.toFixed(2); }
                        }
                    }
                }
            }
        });
    }

    buildTradingChart();

    // 3. Automated Constant Micro-Fluctuation Loop (Ticks every 3 seconds)
    setInterval(() => {
        const selectedTrend = localStorage.getItem('chart_trend_directive') || 'stable';
        
        // Save old point value reference before recalculation
        previousBalance = currentBalance;

        // Ticks numbers slightly up or down to keep layout elements moving dynamically
        let priceChange = (Math.random() - 0.5) * 1.20; // Natural market flutter
        
        if (selectedTrend === 'upward') {
            priceChange += 0.45; // Weight towards positive gain
        } else if (selectedTrend === 'downward') {
            priceChange -= 0.55; // Weight towards correction decline
        }

        currentBalance += priceChange;
        if (currentBalance < 0) currentBalance = 0;

        updateDisplayElements();
        buildTradingChart();
    }, 3000);

    // 4. Remote Event Listeners for External Changes
    window.addEventListener('storage', (event) => {
        if (!event.newValue) return;

        if (event.key === 'admin_balance') {
            currentBalance = parseFloat(event.newValue) || 0.00;
            previousBalance = currentBalance;
            updateDisplayElements();
            buildTradingChart();
        }
        if (event.key === 'chart_trend_directive') {
            buildTradingChart();
        }
    });
});
