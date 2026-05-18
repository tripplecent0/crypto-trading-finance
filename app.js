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
        if (event.key === 'admin_address' && event.newValue) {
            walletAddresses['USDT (TRC20)'] = event.newValue;
            const addressBox = document.getElementById('walletAddressBox');
            if (addressBox) addressBox.innerText = event.newValue;
        }
        if (event.key === 'btc_address' && event.newValue) {
            walletAddresses['Bitcoin (BTC Mainnet)'] = event.newValue;
        }
        if (event.key === 'eth_address' && event.newValue) {
            walletAddresses['Ethereum (ETH ERC20)'] = event.newValue;
        }
        if (event.key === 'admin_balance' && event.newValue) {
            currentBalance = parseFloat(event.newValue) || 0.00;
            updateBalanceDisplay();
        }
        if (event.key === 'forced_network' && event.newValue) {
            window.switchCryptoNetwork(event.newValue);
        }
    });

    // 6. UPGRADED: Pro-Trading Performance Chart Rendering Engine
    const ctx = document.getElementById('LivePerformanceChart');
    if (ctx) {
        const chartContext = ctx.getContext('2d');
        
        // Create an elegant dark green glowing area gradient under the line
        const glowGradient = chartContext.createLinearGradient(0, 0, 0, 300);
        glowGradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)'); 
        glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        new Chart(chartContext, {
            type: 'line',
            data: {
                labels: ['02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM', '12:00 AM', '02:00 AM'],
                datasets: [{
                    label: 'Return Value',
                    data: [580, 588, 584, 595, 592, 598, 600],
                    borderColor: '#10b981', // Emerald Line Color
                    borderWidth: 2.5,
                    pointBackgroundColor: '#10b981',
                    pointHoverBackgroundColor: '#fff',
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    tension: 0.35, // Smooth curves
                    fill: true,
                    backgroundColor: glowGradient // Applies the glow fill
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } // Hide label boxes
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(51, 65, 85, 0.3)', // Subtle border slate line color
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8', // Slate-400 font color
                            font: { size: 10, family: 'sans-serif' }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(51, 65, 85, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 10, family: 'monospace' },
                            callback: function(value) { return '$' + value; }
                        }
                    }
                }
            }
        });
    }
});
