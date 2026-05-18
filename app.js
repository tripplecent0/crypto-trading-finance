document.addEventListener('DOMContentLoaded', () => {
    console.log("Binance-style ticker engine online.");

    // 1. Set the initial control baseline
    let baselineBalance = 600.00;
    try {
        const stored = localStorage.getItem('admin_balance');
        if (stored) baselineBalance = parseFloat(stored);
    } catch (e) {
        console.error(e);
    }

    // Live display variables
    let currentLivePrice = baselineBalance;
    let lastTickPrice = currentLivePrice;

    // Maintain a rolling history of the last 10 ticks for the chart path
    let chartDataPoints = Array(10).fill(baselineBalance).map((val, idx) => val + (idx - 5) * (Math.random() * 2));

    // UI Element Updater
    function refreshUIElements(isUpTick) {
        const balanceTxt = document.getElementById('balance-display');
        if (balanceTxt) {
            balanceTxt.innerText = '$' + currentLivePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            // Flash the balance text color briefly to simulate an active market feed
            balanceTxt.style.color = isUpTick ? '#10b981' : '#ef4444'; 
        }
    }
    refreshUIElements(true);

    // 2. Dynamic Chart Rendering Module
    let cryptoChartInstance = null;
    const chartCanvas = document.getElementById('LivePerformanceChart');

    function drawCryptoChart(isUpTick) {
        if (!chartCanvas || typeof Chart === 'undefined') return;

        if (cryptoChartInstance) {
            cryptoChartInstance.destroy();
        }

        const ctxRef = chartCanvas.getContext('2d');
        const glowArea = ctxRef.createLinearGradient(0, 0, 0, chartCanvas.clientHeight || 220);
        
        // Define trade signals: standard green for upward ticks, standard red for downward ticks
        let strokeColor = '#10b981'; // Bullish Green
        if (!isUpTick) {
            strokeColor = '#ef4444'; // Bearish Red
            glowArea.addColorStop(0, 'rgba(239, 68, 68, 0.20)');
            glowArea.addColorStop(1, 'rgba(239, 68, 68, 0.00)');
        } else {
            glowArea.addColorStop(0, 'rgba(16, 185, 129, 0.20)');
            glowArea.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        }

        // Generate clean placeholders along the bottom timeline axis
        const timelineLabels = chartDataPoints.map((_, i) => `T-${10 - i}`);

        cryptoChartInstance = new Chart(ctxRef, {
            type: 'line',
            data: {
                labels: timelineLabels,
                datasets: [{
                    data: [...chartDataPoints],
                    borderColor: strokeColor,
                    borderWidth: 2.5,
                    pointRadius: 0, // Smooth line without bulky circle points
                    tension: 0.3,   // Natural market wave curve styling
                    fill: true,
                    backgroundColor: glowArea
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 200 }, // Snappy transitions for rapid tick updates
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false }, // Hides clutter on small grid scales
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.10)', drawBorder: false },
                        ticks: { 
                            color: '#64748b', 
                            font: { size: 10 },
                            callback: function(v) { return '$' + v.toFixed(2); }
                        }
                    }
                }
            }
        });
    }

    // Initial setup render
    drawCryptoChart(true);

    // 3. Automated Order Book Simulation Loop (Runs fast every 2 seconds)
    setInterval(() => {
        const trendControl = localStorage.getItem('chart_trend_directive') || 'stable';
        
        lastTickPrice = currentLivePrice;

        // Generate a random market fluctuation fraction
        let marketShift = (Math.random() - 0.5) * 1.50;

        // Adjust trend direction based on your choice in control.html
        if (trendControl === 'upward') {
            marketShift += 0.40; // Lean heavily toward gains
        } else if (trendControl === 'downward') {
            marketShift -= 0.45; // Lean heavily toward drops
        }

        currentLivePrice += marketShift;
        if (currentLivePrice < 0) currentLivePrice = 0;

        // Check if the asset price went up or down compared to the last tick
        const priceWentUp = currentLivePrice >= lastTickPrice;

        // Append the new tick to our rolling dataset and drop the oldest data point
        chartDataPoints.push(currentLivePrice);
        chartDataPoints.shift();

        // Push updates live to your screen layout elements
        refreshUIElements(priceWentUp);
        drawCryptoChart(priceWentUp);
    }, 2000);

    // 4. Remote Event Listener for Setting Updates via the Controller
    window.addEventListener('storage', (event) => {
        if (!event.newValue) return;

        if (event.key === 'admin_balance') {
            baselineBalance = parseFloat(event.newValue) || 600.00;
            currentLivePrice = baselineBalance;
            lastTickPrice = currentLivePrice;
            chartDataPoints = Array(10).fill(baselineBalance);
            
            refreshUIElements(true);
            drawCryptoChart(true);
        }
    });
});
