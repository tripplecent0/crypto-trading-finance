document.addEventListener('DOMContentLoaded', () => {
    console.log("Dashboard live feed engine active.");

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

    let trendChartInstance = null;
    const ctx = document.getElementById('LivePerformanceChart');

    // Generates points with subtle random variations around the target baseline
    function generateLivePoints(trend, baseValue) {
        const factor = baseValue > 0 ? baseValue : 600;
        const randomShift = () => (Math.random() - 0.5) * (factor * 0.02); // 2% fluctuation range

        if (trend === 'upward') {
            return [
                factor * 0.90 + randomShift(),
                factor * 0.93 + randomShift(),
                factor * 0.91 + randomShift(),
                factor * 0.96 + randomShift(),
                factor * 0.94 + randomShift(),
                factor * 0.98 + randomShift(),
                factor
            ];
        } else if (trend === 'downward') {
            return [
                factor * 1.10 + randomShift(),
                factor * 1.06 + randomShift(),
                factor * 1.08 + randomShift(),
                factor * 1.02 + randomShift(),
                factor * 1.04 + randomShift(),
                factor * 0.97 + randomShift(),
                factor * 0.90
            ];
        } else {
            // Stable consolidation mode bounces tightly around baseline
            return [
                factor * 0.98 + randomShift(),
                factor * 1.01 + randomShift(),
                factor * 0.99 + randomShift(),
                factor * 1.02 + randomShift(),
                factor * 0.98 + randomShift(),
                factor * 1.01 + randomShift(),
                factor + randomShift()
            ];
        }
    }

    function buildLiveChart() {
        if (!ctx || typeof Chart === 'undefined') return;
        
        const activeTrend = localStorage.getItem('chart_trend_directive') || 'stable';
        const rawDataset = generateLivePoints(activeTrend, currentBalance);

        if (trendChartInstance) {
            trendChartInstance.destroy();
        }

        const chartContext = ctx.getContext('2d');
        const glowGradient = chartContext.createLinearGradient(0, 0, 0, 300);
        
        // Dynamic coloring: red color scheme for downward trends, green for upward/stable
        let lineThemeColor = '#10b981';
        if (activeTrend === 'downward') {
            lineThemeColor = '#ef4444';
            glowGradient.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
            glowGradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
        } else {
            glowGradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
            glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
        }

        trendChartInstance = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: ['02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM', '12:00 AM', '02:00 AM'],
                datasets: [{
                    label: 'Market Index',
                    data: rawDataset,
                    borderColor: lineThemeColor,
                    borderWidth: 2.5,
                    pointBackgroundColor: lineThemeColor,
                    pointRadius: 3,
                    tension: 0.4,
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
                        grid: { color: 'rgba(51, 65, 85, 0.15)', drawBorder: false },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.15)', drawBorder: false },
                        ticks: { 
                            color: '#94a3b8', 
                            font: { size: 10 },
                            callback: function(val) { return '$' + val.toFixed(2); }
                        }
                    }
                }
            }
        });
    }

    // Initial render
    buildLiveChart();

    // Auto-update feed cycle: redraws minor changes every 4 seconds to animate movement
    setInterval(() => {
        buildLiveChart();
    }, 4000);

    // Synchronizer listener for real-time remote commands
    window.addEventListener('storage', (event) => {
        if (!event.newValue) return;

        if (event.key === 'admin_balance') {
            currentBalance = parseFloat(event.newValue) || 0.00;
            updateBalanceDisplay();
            buildLiveChart();
        }
        if (event.key === 'chart_trend_directive') {
            buildLiveChart();
        }
        if (event.key === 'forced_network') {
            if (typeof window.switchCryptoNetwork === 'function') {
                window.switchCryptoNetwork(event.newValue);
            }
        }
    });
});
