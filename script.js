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

// Download PDF report - IMPROVED VERSION
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

    // Fixed currency formatting function for PDF (removes ₹ symbol to avoid encoding issues)
    function formatCurrencyForPDF(amount) {
        return `Rs. ${amount.toLocaleString('en-IN')}`;
    }

    // Page settings
    const pageHeight = 280; // Usable page height
    const marginBottom = 30; // Bottom margin for footer
    let yPos = 30; // Starting Y position

    // Function to check if new page is needed
    function checkPageBreak(requiredSpace) {
        if (yPos + requiredSpace > pageHeight - marginBottom) {
            doc.addPage();
            yPos = 20; // Reset Y position for new page
            return true;
        }
        return false;
    }

    // Function to add styled heading
    function addStyledHeading(text, size, color = [0, 0, 0], underline = false) {
        checkPageBreak(25);
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont("helvetica", "bold");
        doc.text(text, 20, yPos);
        
        if (underline) {
            const textWidth = doc.getTextWidth(text);
            doc.setDrawColor(color[0], color[1], color[2]);
            doc.setLineWidth(0.5);
            doc.line(20, yPos + 2, 20 + textWidth, yPos + 2);
        }
        
        yPos += 15;
    }

    // Function to add normal text
    function addText(text, size = 12, color = [0, 0, 0], bold = false) {
        checkPageBreak(15);
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.text(text, 20, yPos);
        yPos += 15;
    }

    // Function to add indented text
    function addIndentedText(text, size = 11, color = [0, 0, 0]) {
        checkPageBreak(15);
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont("helvetica", "normal");
        doc.text(text, 25, yPos);
        yPos += 15;
    }

    // PDF Header with styling
    addStyledHeading('MONTHLY BUDGET REPORT', 22, [52, 73, 94], true);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text(`${currentMonth} ${currentYear}`, 20, yPos);
    yPos += 25;

    // Summary Section with styled header
    addStyledHeading('FINANCIAL SUMMARY', 18, [41, 128, 185], true);
    
    // Summary with better formatting
    addText(`Total Income: ${formatCurrencyForPDF(totalIncome)}`, 12, [46, 125, 50], true);
    addText(`Total Expenses: ${formatCurrencyForPDF(totalExpenses)}`, 12, [231, 76, 60], true);
    
    // Net balance with color coding
    const balanceColor = netBalance >= 0 ? [46, 125, 50] : [231, 76, 60];
    addText(`Net Balance: ${formatCurrencyForPDF(netBalance)}`, 12, balanceColor, true);
    
    yPos += 10;

    // Income Details with styled header
    addStyledHeading('INCOME DETAILS', 16, [46, 125, 50], true);
    
    if (incomeItems.length > 0) {
        incomeItems.forEach(item => {
            addIndentedText(`• ${item.desc}: ${formatCurrencyForPDF(item.amount)}`);
        });
    } else {
        addIndentedText('No income entries', 11, [128, 128, 128]);
    }

    yPos += 10;

    // Expense Details with styled header
    addStyledHeading('EXPENSE DETAILS', 16, [231, 76, 60], true);

    if (expenseItems.length > 0) {
        // Group expenses by category for better organization
        const expensesByCategory = {
            needs: expenseItems.filter(item => item.category === 'needs'),
            wants: expenseItems.filter(item => item.category === 'wants'),
            savings: expenseItems.filter(item => item.category === 'savings')
        };

        // Display expenses by category
        Object.keys(expensesByCategory).forEach(category => {
            if (expensesByCategory[category].length > 0) {
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                addText(`${categoryName}:`, 12, [0, 0, 0], true);
                
                expensesByCategory[category].forEach(item => {
                    addIndentedText(`• ${item.desc}: ${formatCurrencyForPDF(item.amount)}`);
                });
                yPos += 5;
            }
        });
    } else {
        addIndentedText('No expense entries', 11, [128, 128, 128]);
    }

    yPos += 10;

    // Budget Goals Analysis with styled header
    addStyledHeading('BUDGET GOALS ANALYSIS (50/30/20 Rule)', 16, [255, 152, 0], true);

    const needsGoal = totalIncome * 0.5;
    const wantsGoal = totalIncome * 0.3;
    const savingsGoal = totalIncome * 0.2;

    // Needs analysis
    const needsPercentage = totalIncome > 0 ? ((needsTotal / totalIncome) * 100).toFixed(1) : 0;
    addText(`Needs (50% Goal):`, 12, [0, 0, 0], true);
    addIndentedText(`Target: ${formatCurrencyForPDF(needsGoal)}`);
    addIndentedText(`Actual: ${formatCurrencyForPDF(needsTotal)} (${needsPercentage}%)`);
    addIndentedText(`Status: ${needsTotal <= needsGoal ? 'Within Budget' : 'Over Budget'}`, 11, needsTotal <= needsGoal ? [46, 125, 50] : [231, 76, 60]);
    
    yPos += 5;

    // Wants analysis
    const wantsPercentage = totalIncome > 0 ? ((wantsTotal / totalIncome) * 100).toFixed(1) : 0;
    addText(`Wants (30% Goal):`, 12, [0, 0, 0], true);
    addIndentedText(`Target: ${formatCurrencyForPDF(wantsGoal)}`);
    addIndentedText(`Actual: ${formatCurrencyForPDF(wantsTotal)} (${wantsPercentage}%)`);
    addIndentedText(`Status: ${wantsTotal <= wantsGoal ? 'Within Budget' : 'Over Budget'}`, 11, wantsTotal <= wantsGoal ? [46, 125, 50] : [231, 76, 60]);
    
    yPos += 5;

    // Savings analysis
    const savingsPercentage = totalIncome > 0 ? ((savingsTotal / totalIncome) * 100).toFixed(1) : 0;
    addText(`Savings (20% Goal):`, 12, [0, 0, 0], true);
    addIndentedText(`Target: ${formatCurrencyForPDF(savingsGoal)}`);
    addIndentedText(`Actual: ${formatCurrencyForPDF(savingsTotal)} (${savingsPercentage}%)`);
    addIndentedText(`Status: ${savingsTotal >= savingsGoal ? 'Goal Achieved' : 'Below Goal'}`, 11, savingsTotal >= savingsGoal ? [46, 125, 50] : [231, 76, 60]);

    // Footer - Always at the bottom of the last page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Add page number
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.setFont("helvetica", "normal");
        doc.text(`Page ${i} of ${totalPages}`, 180, 285);
        
        // Add footer only on last page
        if (i === totalPages) {
            doc.setFontSize(10);
            doc.setTextColor(128, 128, 128);
            doc.text(`Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 20, 285);
            doc.text('Created with Monthly Budget Tracker by Avadhut Noola', 20, 295);
        }
    }

    // Save the PDF
    doc.save(`Budget-Report-${currentMonth}-${currentYear}.pdf`);
}