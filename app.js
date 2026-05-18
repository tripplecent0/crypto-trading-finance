document.addEventListener('DOMContentLoaded', () => {
    console.log("Real-time Live Trading Engine Active.");

    // 1. Initial baseline configuration
    let targetBaseline = 600.00;
    try {
        const storedBalance = localStorage.getItem('admin_balance');
        if (storedBalance) targetBaseline = parseFloat(storedBalance);
    } catch (e) {
        console.error(e);
    }

    // Live working variables
    let livePrice = targetBaseline;
    let lastPrice = livePrice;
    
    // Hardcoded historical data array to mimic a continuous chart stream
    let priceHistory = [
        targetBaseline * 0.97, 
        targetBaseline * 0.99, 
        targetBaseline * 0.96, 
        targetBaseline * 1.01, 
        targetBaseline * 0.98, 
        targetBaseline * 1.02, 
        livePrice
    ];

    // UI Ticker Updater
    function updateLiveTicker() {
        const balanceDisplay = document.getElementById('balance-display');
        if (balanceDisplay) {
            balanceDisplay.innerText = '$' + livePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }
    updateLiveTicker();

    // 2. ChartJS Real-Time Renderer
    let tradingChart = null;
    const ctx = document.getElementById('LivePerformanceChart');

    function renderTradingChart(isBullish) {
        if (!ctx || typeof Chart === 'undefined') return;

        if (tradingChart) {
            tradingChart.destroy();
        }

        const chartContext = ctx.getContext('2d');
        const glowGradient = chartContext.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight || 250);
        
        // Define exact color tokens based on price trend direction
        let candleThemeColor = '#10b981'; // Green
        if (!isBullish) {
            candleThemeColor = '#ef4444'; // Red
            glowGradient.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
            glowGradient.addColorStop(1, 'rgba(239, 68, 68, 0.00)');
        } else {
            glowGradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
            glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        }

        tradingChart = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: ['02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM', '12:00 AM', 'Live Feed'],
                datasets: [{
                    data: priceHistory,
                    borderColor: candleThemeColor,
                    borderWidth: 2.5,
                    pointBackgroundColor: candleThemeColor,
                    pointRadius: 2,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: glowGradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 }, // Fast transition updates like a real exchange feed
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

    // Initial render setup
    renderTradingChart(true);

    // 3. Live Order Book Fluctuation Loop (Ticks fast every 1.5 seconds)
    setInterval(() => {
        const directiveTrend = localStorage.getItem('chart_trend_directive') || 'stable';
        
        // Store current position before updating the live price
        lastPrice = livePrice;

        // Calculate a micro price movement value
        let priceMovement = (Math.random() - 0.5) * (targetBaseline * 0.008); // Normal market fluctuation noise

        // Weight price direction based on controller trend selection
        if (directiveTrend === 'upward') {
            priceMovement += (targetBaseline * 0.002); // Upward push
        } else if (directiveTrend === 'downward') {
            priceMovement -= (targetBaseline * 0.002); // Downward pressure
        }

        livePrice += priceMovement;

        // Prevent values from dipping below zero
        if (livePrice < 0) livePrice = 0;

        // Is the current price higher or lower than the previous step?
        const isBullish = livePrice >= lastPrice;

        // Update the last coordinate element in our chart history tracking array
        priceHistory[priceHistory.length - 1] = livePrice;

        // Push values onto the UI elements
        updateLiveTicker();
        renderTradingChart(isBullish);
    }, 1500);

    // 4. Remote Control Override Event Synchronization Link
    window.addEventListener('storage', (event) => {
        if (!event.newValue) return;

        if (event.key === 'admin_balance') {
            targetBaseline = parseFloat(event.newValue) || 600.00;
            livePrice = targetBaseline;
            lastPrice = livePrice;
            
            // Re-seed history based on the newly submitted balance target
            priceHistory = [
                targetBaseline * 0.97, 
                targetBaseline * 0.99, 
                targetBaseline * 0.96, 
                targetBaseline * 1.01, 
                targetBaseline * 0.98, 
                targetBaseline * 1.02, 
                livePrice
            ];
            
            updateLiveTicker();
            renderTradingChart(true);
        }
    });
});
