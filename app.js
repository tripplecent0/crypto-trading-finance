document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard tracking matrix online.");

    let currentBalance = 1000.00;
    try {
        const storedBalance = localStorage.getItem('admin_balance');
        if (storedBalance) currentBalance = parseFloat(storedBalance);
    } catch (e) {
        console.error(e);
    }
    
    let walletAddresses = {
        'USDT (TRC20)': localStorage.getItem('admin_address') || "0x71C2496E7278274d3b4614a420971a9E3a9411bb",
        'Bitcoin (BTC Mainnet)': localStorage.getItem('btc_address') || "1BitcoinAddressHere",
        'Ethereum (ETH ERC20)': localStorage.getItem('eth_address') || "0xEthAddressHere"
    };

    function updateBalanceDisplay() {
        const display = document.getElementById('balance-display');
        if (display) {
            display.innerText = '$' + currentBalance.toFixed(2);
        }
    }
    updateBalanceDisplay();

    // Chart logic setup
    let trendChartInstance = null;
    const ctx = document.getElementById('LivePerformanceChart');

    function generateDataPoints(trend, baseValue) {
        const factor = baseValue > 0 ? baseValue : 600;
        if (trend === 'upward') {
            // Rises over time
            return [factor * 0.92, factor * 0.94, factor * 0.93, factor * 0.97, factor * 0.96, factor * 0.99, factor];
        } else if (trend === 'downward') {
            // Falls over time
            return [factor * 1.08, factor * 1.05, factor * 1.06, factor * 1.02, factor * 1.03, factor * 0.98, factor * 0.91];
        } else {
            // Fluctuate tightly in a stable line around baseValue
            return [factor * 0.99, factor * 1.01, factor * 0.98, factor * 1.02, factor * 0.99, factor * 1.01, factor];
        }
    }

    function buildLiveChart() {
        if (!ctx || typeof Chart === 'undefined') return;
        
        const activeTrend = localStorage.getItem('chart_trend_directive') || 'upward';
        const rawDataset = generateDataPoints(activeTrend, currentBalance);

        if (trendChartInstance) {
            trendChartInstance.destroy();
        }

        const chartContext = ctx.getContext('2d');
        const glowGradient = chartContext.createLinearGradient(0, 0, 0, 300);
        
        // Adjust chart colors based on positive rise or negative drop trends
        if (activeTrend === 'downward') {
            glowGradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)'); // Red glow
            glowGradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
        } else {
            glowGradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)'); // Green glow
            glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
        }

        trendChartInstance = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: ['02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM', '12:00 AM', '02:00 AM'],
                datasets: [{
                    label: 'Index Value',
                    data: rawDataset,
                    borderColor: activeTrend === 'downward' ? '#ef4444' : '#10b981',
                    borderWidth: 2.5,
                    pointBackgroundColor: activeTrend === 'downward' ? '#ef4444' : '#10b981',
                    pointRadius: 2,
                    tension: 0.35,
                    fill: true,
                    backgroundColor: glowGradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { color: 'rgba(51, 65, 85, 0.2)', drawBorder: false },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.2)', drawBorder: false },
                        ticks: { 
                            color: '#94a3b8', 
                            font: { size: 10 },
                            callback: function(val) { return '$' + val.toFixed(0); }
                        }
                    }
                }
            }
        });
    }

    // Initialize chart display
    buildLiveChart();

    // Storage updates observer
    window.addEventListener('storage', (event) => {
        if (!event.newValue) return;

        if (event.key === 'admin_balance') {
            currentBalance = parseFloat(event.newValue) || 0.00;
            updateBalanceDisplay();
            buildLiveChart(); // Re-render relative values
        }
        if (event.key === 'chart_trend_directive') {
            buildLiveChart(); // Trigger dynamic data rebuild instantly
        }
        if (event.key === 'forced_network') {
            if (typeof window.switchCryptoNetwork === 'function') {
                window.switchCryptoNetwork(event.newValue);
            }
        }
    });
});
