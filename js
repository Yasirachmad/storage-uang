// Store our transactions in a simple array
let transactions = [
  {
    id: 1,
    name: "Monthly Salary",
    amount: 5000000,
    type: "income",
    category: "salary",
    date: "2025-06-18",
  },
  {
    id: 2,
    name: "Grocery Shopping",
    amount: 250000,
    type: "expense",
    category: "shopping",
    date: "2025-06-17",
  },
  {
    id: 3,
    name: "Gas Station",
    amount: 150000,
    type: "expense",
    category: "transport",
    date: "2025-06-16",
  },
  {
    id: 4,
    name: "Freelance Project",
    amount: 1500000,
    type: "income",
    category: "freelance",
    date: "2025-06-15",
  },
];

// Format number with dots (Indonesian style)
function formatNumberInput(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Remove dots and convert to number
function parseFormattedNumber(str) {
  return parseInt(str.replace(/\./g, "")) || 0;
}

// Simple function to format money
function formatMoney(amount) {
  return "Rp " + amount.toLocaleString();
}

// Calculate total income
function getTotalIncome() {
  let total = 0;
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].type === "income") {
      total += transactions[i].amount;
    }
  }
  return total;
}

// Calculate total expense
function getTotalExpense() {
  let total = 0;
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].type === "expense") {
      total += transactions[i].amount;
    }
  }
  return total;
}

// Calculate balance
function getTotalBalance() {
  return getTotalIncome() - getTotalExpense();
}

// Update the money cards on screen
function updateMoneyCards() {
  let income = getTotalIncome();
  let expense = getTotalExpense();
  let balance = getTotalBalance();

  document.querySelector(".income .card-amount").textContent = formatMoney(income);
  document.querySelector(".expense .card-amount").textContent = formatMoney(expense);
  document.querySelector(".total-balance .card-amount").textContent = formatMoney(balance);
}

// Update transaction count
function updateTransactionCount() {
  let count = transactions.length;
  document.querySelector(".counter-value").textContent = count;
}

// Simple function to format date for display
function formatDate(dateString) {
  let date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Show transaction history
function showTransactionHistory() {
  let container = document.querySelector(".history-list");
  container.innerHTML = "";

  // sort by newest first
  let sorted = transactions.slice().sort(function (a, b) {
    return b.id - a.id;
  });

  for (let i = 0; i < sorted.length; i++) {
    let transaction = sorted[i];
    let sign = transaction.type === "income" ? "+" : "-";
    let dateDisplay = transaction.date ? formatDate(transaction.date) : "Today";
    let categoryIcon = transaction.category ? getCategoryIcon(transaction.category) : "💰";

    let html =
      '<div class="history-item ' +
      transaction.type +
      '-item">' +
      '<div class="history-icon">' +
      categoryIcon +
      "</div>" +
      '<div class="history-info">' +
      '<h3 class="history-name">' +
      transaction.name +
      "</h3>" +
      '<p class="history-date">' +
      dateDisplay +
      "</p>" +
      "</div>" +
      '<div class="history-amount ' +
      transaction.type +
      '">' +
      sign +
      formatMoney(transaction.amount) +
      "</div>" +
      '<button class="delete-btn" onclick="deleteTransaction(' +
      transaction.id +
      ')">Delete</button>' +
      "</div>";

    container.innerHTML += html;
  }
}

// Add new transaction
function addTransaction() {
  let name = document.getElementById("transaction-name").value;
  let amountInput = document.getElementById("amount").value;
  let amount = parseFormattedNumber(amountInput);
  let type = document.querySelector('input[name="type"]:checked').value;
  let category = document.getElementById("category").value;
  let date = document.getElementById("date").value;

  // basic validation
  if (name === "" || amount <= 0 || category === "") {
    alert("Please fill all fields correctly!");
    return;
  }

  let newTransaction = {
    id: transactions.length + 1,
    name: name,
    amount: amount,
    type: type,
    category: category,
    date: date,
  };

  transactions.push(newTransaction);

  // update everything
  updateMoneyCards();
  updateTransactionCount();
  showTransactionHistory();

  // clear all form fields
  document.getElementById("transaction-name").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
  document.getElementById("date").value = "";

  // reset radio button to income (default)
  document.getElementById("income").checked = true;
  document.getElementById("expense").checked = false;
}

// Delete a transaction
function deleteTransaction(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].id === id) {
        transactions.splice(i, 1);
        break;
      }
    }

    updateMoneyCards();
    updateTransactionCount();
    showTransactionHistory();
  }
}

// Delete all transactions
function deleteAllTransactions() {
  if (confirm("Are you sure you want to delete all transactions? This action cannot be undone.")) {
    transactions = [];
    updateMoneyCards();
    updateTransactionCount();
    showTransactionHistory();
  }
}

// When page loads, run this
document.addEventListener("DOMContentLoaded", function () {
  updateMoneyCards();
  updateTransactionCount();
  showTransactionHistory();

  // Setup form submission
  document.querySelector(".transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();
    addTransaction();
  });

  // Setup delete all button
  document.querySelector(".delete-all-btn").addEventListener("click", deleteAllTransactions);

  // Setup amount input formatting
  let amountInput = document.getElementById("amount");

  // Only allow numbers and control keys
  amountInput.addEventListener("keydown", function (e) {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });

  // Format input with dots as user types
  amountInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\./g, ""); // Remove existing dots
    if (value !== "") {
      e.target.value = formatNumberInput(value);
    }
  });
});

// Category icon mapping
let categoryIcons = {
  // Income categories
  salary: "💰",
  freelance: "💼",
  investment: "📈",
  business: "🏢",
  // Expense categories
  food: "🍕",
  transport: "🚗",
  shopping: "🛒",
  bills: "📱",
  entertainment: "🎬",
  health: "🏥",
};

// Get icon for category, fallback to generic icon
function getCategoryIcon(category) {
  return categoryIcons[category] || "💰";
}
