document.addEventListener('DOMContentLoaded', () => {
    console.log("Trading Engine Stabilized Mode Active.");

    // 1. Initial baseline configuration
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
        
        let strokeColor = '#10b981'; // Green
        if (!isUpTick) {
            strokeColor = '#ef4444'; // Red
            glowArea.addColorStop(0, 'rgba(239, 68, 68, 0.15)');
            glowArea.addColorStop(1, 'rgba(239, 68, 68, 0.00)');
        } else {
            glowArea.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
            glowArea.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        }

        const timelineLabels = chartDataPoints.map((_, i) => `T-${10 - i}`);

        cryptoChartInstance = new Chart(ctxRef, {
            type: 'line',
            data: {
                labels: timelineLabels,
                datasets: [{
                    data: [...chartDataPoints],
                    borderColor: strokeColor,
                    borderWidth: 2.5,
                    pointRadius: 0, 
                    tension: 0.35,   
                    fill: true,
                    backgroundColor: glowArea
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 600 }, // Smooth transition speed
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false }, 
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.08)', drawBorder: false },
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

    drawCryptoChart(true);

    // 3. Automated Flow Loop - Slowed down to 6000ms (6 seconds) for normal positioning
    setInterval(() => {
        const trendControl = localStorage.getItem('chart_trend_directive') || 'stable';
        
        lastTickPrice = currentLivePrice;
        let marketShift = (Math.random() - 0.5) * 1.10;

        if (trendControl === 'upward') {
            marketShift += 0.35; 
        } else if (trendControl === 'downward') {
            marketShift -= 0.40; 
        }

        currentLivePrice += marketShift;
        if (currentLivePrice < 0) currentLivePrice = 0;

        const priceWentUp = currentLivePrice >= lastTickPrice;

        chartDataPoints.push(currentLivePrice);
        chartDataPoints.shift();

        refreshUIElements(priceWentUp);
        drawCryptoChart(priceWentUp);
    }, 6000);

    // 4. Re-linking Button Actions for Deposit and Withdrawal
    const depositBtn = document.querySelector('button, .bg-emerald-500'); 
    const withdrawBtn = document.querySelectorAll('button')[1]; 

    // Open deposit panel view
    if (depositBtn && depositBtn.innerText.includes('Deposit')) {
        depositBtn.addEventListener('click', () => {
            const modal = document.getElementById('deposit-modal') || document.querySelector('.modal-deposit');
            if (modal) modal.style.display = 'flex';
            else alert('Redirecting to secure deposit address node...');
        });
    }

    // Open withdrawal request form
    if (withdrawBtn && withdrawBtn.innerText.includes('Withdraw')) {
        withdrawBtn.addEventListener('click', () => {
            const modal = document.getElementById('withdraw-modal') || document.querySelector('.modal-withdraw');
            if (modal) modal.style.display = 'flex';
            else alert('Withdrawal gateway verification handling initiated.');
        });
    }

    // 5. Remote Sync Updates via Control Panel
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
