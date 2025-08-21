let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

// render transaksi ke layar
function renderTransaksi() {
  const list = document.querySelector(".history-list");
  const saldoEl = document.querySelector(".total-balance .card-amount");
  const incomeEl = document.querySelector(".income .card-amount");
  const expenseEl = document.querySelector(".expense .card-amount");
  const totalCounter = document.querySelector(".counter-value");

  list.innerHTML = "";
  let saldo = 0, income = 0, expense = 0;

  transaksi.forEach((t, index) => {
    const div = document.createElement("div");
    div.classList.add("history-item", t.type === "income" ? "income-item" : "expense-item");

    div.innerHTML = `
      <div class="history-icon">${t.icon || "💸"}</div>
      <div class="history-info">
        <h3 class="history-name">${t.name}</h3>
        <p class="history-date">${t.date}</p>
      </div>
      <div class="history-amount ${t.type}">
        ${t.type === "income" ? "+" : "-"}Rp ${t.amount.toLocaleString()}
      </div>
      <button onclick="hapusTransaksi(${index})" class="delete-btn">Delete</button>
    `;
    list.appendChild(div);

    if (t.type === "income") {
      income += t.amount;
      saldo += t.amount;
    } else {
      expense += t.amount;
      saldo -= t.amount;
    }
  });

  saldoEl.textContent = "Rp " + saldo.toLocaleString();
  incomeEl.textContent = "Rp " + income.toLocaleString();
  expenseEl.textContent = "Rp " + expense.toLocaleString();
  totalCounter.textContent = transaksi.length;
}

// tambah transaksi
document.querySelector(".transaction-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("transaction-name").value;
  const amount = parseInt(document.getElementById("amount").value);
  const type = document.querySelector("input[name='type']:checked").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  transaksi.push({
    name,
    amount,
    type,
    category,
    date,
    icon: category.startsWith("💰") ? "💰" : "🛒"
  });

  localStorage.setItem("transaksi", JSON.stringify(transaksi));
  renderTransaksi();
  this.reset();
});

// hapus transaksi
function hapusTransaksi(index) {
  transaksi.splice(index, 1);
  localStorage.setItem("transaksi", JSON.stringify(transaksi));
  renderTransaksi();
}

// hapus semua transaksi
document.querySelector(".delete-all-btn").addEventListener("click", () => {
  if (confirm("Hapus semua transaksi?")) {
    transaksi = [];
    localStorage.setItem("transaksi", JSON.stringify(transaksi));
    renderTransaksi();
  }
});

// export ke CSV
function exportCSV() {
  if (transaksi.length === 0) {
    alert("Tidak ada transaksi untuk diexport!");
    return;
  }

  let csv = "Nama, Jumlah, Tipe, Kategori, Tanggal\n";
  transaksi.forEach(t => {
    csv += `${t.name},${t.amount},${t.type},${t.category},${t.date}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transaksi.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// render awal
renderTransaksi();
