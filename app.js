document.addEventListener('DOMContentLoaded', () => {
    // 1. Establish initial data states from local storage or defaults
    let currentBalance = parseFloat(localStorage.getItem('admin_balance')) || 1000.00;
    
    let walletAddresses = {
        'USDT (TRC20)': localStorage.getItem('admin_address') || "0x71C2496E7278274d3b4614a420971a9E3a9411bb",
        'Bitcoin (BTC Mainnet)': localStorage.getItem('btc_address') || "1BitcoinAddressHere",
        'Ethereum (ETH ERC20)': localStorage.getItem('eth_address') || "0xEthAddressHere"
    };

    // 2. Initialize Core Interface UI Elements
    function updateBalanceDisplay() {
        const display = document.getElementById('balance-display');
        if (display) {
            display.innerText = '$' + currentBalance.toFixed(2);
        }
    }
    updateBalanceDisplay();

    // 3. Setup Interactive Modal Visibility Controls
    window.triggerDepositModal = function() {
        const modal = document.getElementById('depositModal');
        if (modal) modal.style.display = 'flex';
    };

    window.closeDepositModal = function() {
        const modal = document.getElementById('depositModal');
        if (modal) modal.style.display = 'none';
    };

    window.triggerWithdrawalModal = function() {
        const modal = document.getElementById('withdrawModal');
        if (modal) modal.style.display = 'flex';
    };

    window.closeWithdrawModal = function() {
        const modal = document.getElementById('withdrawModal');
        if (modal) modal.style.display = 'none';
    };

    // 4. Network Switching Rendering Pipeline
    window.switchCryptoNetwork = function(networkName) {
        const addressBox = document.getElementById('walletAddressBox');
        if (addressBox && walletAddresses[networkName]) {
            addressBox.innerText = walletAddresses[networkName];
        }

        const networks = [
            { id: 'coin-usdt', textId: null, checkId: 'check-usdt', name: 'USDT (TRC20)' },
            { id: 'coin-btc', textId: 'text-btc', checkId: 'check-btc', name: 'Bitcoin (BTC Mainnet)' },
            { id: 'coin-eth', textId: 'text-eth', checkId: 'check-eth', name: 'Ethereum (ETH ERC20)' }
        ];

        networks.forEach(item => {
            const panel = document.getElementById(item.id);
            const check = document.getElementById(item.checkId);
            const textSpan = item.textId ? document.getElementById(item.textId) : null;
            
            if (panel && check) {
                if (item.name === networkName) {
                    panel.style.border = '2px solid #10b981';
                    check.style.display = 'block';
                    if (textSpan) textSpan.style.color = '#10b981';
                } else {
                    panel.style.border = '1px solid #334155';
                    check.style.display = 'none';
                    if (textSpan) textSpan.style.color = '#94a3b8';
                }
            }
        });
    };

    // 5. Global Synchronizer Listener for the External Controller Panel
    window.addEventListener('storage', (event) => {
        // Synchronize wallet addresses instantly when updated remotely
        if (event.key === 'admin_address' && event.newValue) {
            walletAddresses['USDT (TRC20)'] = event.newValue;
            const addressBox = document.getElementById('walletAddressBox');
            // If USDT is the active network pane, refresh display text immediately
            if (addressBox) {
                addressBox.innerText = event.newValue;
            }
        }
        if (event.key === 'btc_address' && event.newValue) {
            walletAddresses['Bitcoin (BTC Mainnet)'] = event.newValue;
        }
        if (event.key === 'eth_address' && event.newValue) {
            walletAddresses['Ethereum (ETH ERC20)'] = event.newValue;
        }

        // Synchronize balance modifications instantly
        if (event.key === 'admin_balance' && event.newValue) {
            currentBalance = parseFloat(event.newValue) || 0.00;
            updateBalanceDisplay();
        }

        // Handle forced active network adjustments
        if (event.key === 'forced_network' && event.newValue) {
            window.switchCryptoNetwork(event.newValue);
        }
    });

    // 6. Optional: Initialize Default Chart Template
    const ctx = document.getElementById('LivePerformanceChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Performance Index',
                    data: [1000, 1002, 998, 1005, 1003, 1000],
                    borderColor: '#10b981',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
    }
});
