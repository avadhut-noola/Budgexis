// Global variables
let incomeItems = [];
let expenseItems = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setCurrentMonth();
    updateDisplay();
    setupEventListeners();
});

// Set current month and year dynamically
function setCurrentMonth() {
    const now = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();
    
    document.getElementById('current-month').textContent = `${currentMonth} ${currentYear} - Track Your Financial Goals`;
}

// Setup event listeners
function setupEventListeners() {
    // Enter key support for inputs
    document.getElementById('income-desc').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addIncome();
    });

    document.getElementById('income-amount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addIncome();
    });

    document.getElementById('expense-desc').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addExpense();
    });

    document.getElementById('expense-amount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addExpense();
    });
}

// Format currency in Indian Rupees
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

// Round amount to nearest 10
function roundToTen(amount) {
    return Math.round(amount / 10) * 10;
}

// Add income item
function addIncome() {
    const desc = document.getElementById('income-desc').value.trim();
    const amount = parseFloat(document.getElementById('income-amount').value);
    
    if (desc && amount && amount > 0) {
        const roundedAmount = roundToTen(amount);
        incomeItems.push({ desc, amount: roundedAmount, id: Date.now() });
        document.getElementById('income-desc').value = '';
        document.getElementById('income-amount').value = '';
        updateDisplay();
    } else {
        alert('Please enter a valid description and amount (minimum ₹10).');
    }
}

// Add expense item
function addExpense() {
    const desc = document.getElementById('expense-desc').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    
    if (desc && amount && amount > 0) {
        const roundedAmount = roundToTen(amount);
        expenseItems.push({ desc, amount: roundedAmount, category, id: Date.now() });
        document.getElementById('expense-desc').value = '';
        document.getElementById('expense-amount').value = '';
        updateDisplay();
    } else {
        alert('Please enter a valid description and amount (minimum ₹10).');
    }
}

// Delete income item
function deleteIncome(id) {
    incomeItems = incomeItems.filter(item => item.id !== id);
    updateDisplay();
}

// Delete expense item
function deleteExpense(id) {
    expenseItems = expenseItems.filter(item => item.id !== id);
    updateDisplay();
}

// Update all display elements
function updateDisplay() {
    updateIncomeList();
    updateExpenseList();
    updateSummary();
    updateGoals();
}

// Update income list display
function updateIncomeList() {
    const incomeList = document.getElementById('income-list');
    if (incomeItems.length === 0) {
        incomeList.innerHTML = '<div class="empty-state">No income entries yet. Add your first income source above!</div>';
    } else {
        incomeList.innerHTML = incomeItems.map(item => 
            `<div class="item income">
                <span><strong>${item.desc}</strong></span>
                <span>${formatCurrency(item.amount)} <button class="delete-btn" onclick="deleteIncome(${item.id})">×</button></span>
            </div>`
        ).join('');
    }
}

// Update expense list display
function updateExpenseList() {
    const expenseList = document.getElementById('expense-list');
    if (expenseItems.length === 0) {
        expenseList.innerHTML = '<div class="empty-state">No expense entries yet. Add your first expense above!</div>';
    } else {
        expenseList.innerHTML = expenseItems.map(item => 
            `<div class="item ${item.category}">
                <span><strong>${item.desc}</strong> <small>(${item.category})</small></span>
                <span>${formatCurrency(item.amount)} <button class="delete-btn" onclick="deleteExpense(${item.id})">×</button></span>
            </div>`
        ).join('');
    }
}

// Update summary section
function updateSummary() {
    const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('net-balance').textContent = formatCurrency(netBalance);
    
    // Color code net balance
    const netBalanceElement = document.getElementById('net-balance');
    if (netBalance > 0) {
        netBalanceElement.style.color = '#4CAF50';
    } else if (netBalance < 0) {
        netBalanceElement.style.color = '#f44336';
    } else {
        netBalanceElement.style.color = '#fff';
    }
}

// Update goals section
function updateGoals() {
    const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate category totals
    const needsTotal = expenseItems.filter(item => item.category === 'needs').reduce((sum, item) => sum + item.amount, 0);
    const wantsTotal = expenseItems.filter(item => item.category === 'wants').reduce((sum, item) => sum + item.amount, 0);
    const savingsTotal = expenseItems.filter(item => item.category === 'savings').reduce((sum, item) => sum + item.amount, 0);

    // Calculate goals (50/30/20 rule)
    const needsGoal = totalIncome * 0.5;
    const wantsGoal = totalIncome * 0.3;
    const savingsGoal = totalIncome * 0.2;

    // Update needs
    document.getElementById('needs-goal').textContent = formatCurrency(needsGoal);
    document.getElementById('needs-actual').textContent = formatCurrency(needsTotal);
    document.getElementById('needs-percent').textContent = `${totalIncome > 0 ? ((needsTotal / totalIncome) * 100).toFixed(1) : 0}%`;

    // Update wants
    document.getElementById('wants-goal').textContent = formatCurrency(wantsGoal);
    document.getElementById('wants-actual').textContent = formatCurrency(wantsTotal);
    document.getElementById('wants-percent').textContent = `${totalIncome > 0 ? ((wantsTotal / totalIncome) * 100).toFixed(1) : 0}%`;

    // Update savings
    document.getElementById('savings-goal').textContent = formatCurrency(savingsGoal);
    document.getElementById('savings-actual').textContent = formatCurrency(savingsTotal);
    document.getElementById('savings-percent').textContent = `${totalIncome > 0 ? ((savingsTotal / totalIncome) * 100).toFixed(1) : 0}%`;

    // Update progress bars
    updateProgressBar('needs-progress', needsTotal, needsGoal);
    updateProgressBar('wants-progress', wantsTotal, wantsGoal);
    updateProgressBar('savings-progress', savingsTotal, savingsGoal);
}

// Update progress bar
function updateProgressBar(elementId, actual, goal) {
    const progressBar = document.getElementById(elementId);
    const percentage = goal > 0 ? Math.min((actual / goal) * 100, 100) : 0;
    progressBar.style.width = `${percentage}%`;
}

// Download PDF report
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get current date
    const now = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    // Calculate totals
    const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    const needsTotal = expenseItems.filter(item => item.category === 'needs').reduce((sum, item) => sum + item.amount, 0);
    const wantsTotal = expenseItems.filter(item => item.category === 'wants').reduce((sum, item) => sum + item.amount, 0);
    const savingsTotal = expenseItems.filter(item => item.category === 'savings').reduce((sum, item) => sum + item.amount, 0);

    // PDF Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Monthly Budget Report', 20, 30);
    
    doc.setFontSize(14);
    doc.text(`${currentMonth} ${currentYear}`, 20, 45);

    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Financial Summary', 20, 65);
    
    doc.setFontSize(12);
    doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 20, 80);
    doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 20, 95);
    doc.text(`Net Balance: ${formatCurrency(netBalance)}`, 20, 110);

    // Income Details
    doc.setFontSize(14);
    doc.text('Income Details', 20, 135);
    
    let yPos = 150;
    doc.setFontSize(11);
    
    if (incomeItems.length > 0) {
        incomeItems.forEach(item => {
            doc.text(`• ${item.desc}: ${formatCurrency(item.amount)}`, 25, yPos);
            yPos += 15;
        });
    } else {
        doc.text('No income entries', 25, yPos);
        yPos += 15;
    }

    // Expense Details
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Expense Details', 20, yPos);
    yPos += 15;

    doc.setFontSize(11);
    if (expenseItems.length > 0) {
        expenseItems.forEach(item => {
            doc.text(`• ${item.desc} (${item.category}): ${formatCurrency(item.amount)}`, 25, yPos);
            yPos += 15;
        });
    } else {
        doc.text('No expense entries', 25, yPos);
        yPos += 15;
    }

    // Budget Goals Analysis
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Budget Goals Analysis (50/30/20 Rule)', 20, yPos);
    yPos += 15;

    doc.setFontSize(11);
    const needsGoal = totalIncome * 0.5;
    const wantsGoal = totalIncome * 0.3;
    const savingsGoal = totalIncome * 0.2;

    doc.text(`Needs: ${formatCurrency(needsTotal)} / ${formatCurrency(needsGoal)} (${totalIncome > 0 ? ((needsTotal / totalIncome) * 100).toFixed(1) : 0}%)`, 25, yPos);
    yPos += 15;
    doc.text(`Wants: ${formatCurrency(wantsTotal)} / ${formatCurrency(wantsGoal)} (${totalIncome > 0 ? ((wantsTotal / totalIncome) * 100).toFixed(1) : 0}%)`, 25, yPos);
    yPos += 15;
    doc.text(`Savings: ${formatCurrency(savingsTotal)} / ${formatCurrency(savingsGoal)} (${totalIncome > 0 ? ((savingsTotal / totalIncome) * 100).toFixed(1) : 0}%)`, 25, yPos);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 20, 280);
    doc.text('Created with Monthly Budget Tracker', 20, 290);

    // Save the PDF
    doc.save(`Budget-Report-${currentMonth}-${currentYear}.pdf`);
}