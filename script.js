// 🔴 IMPORTANT: Replace with your Render backend URL
const BASE_URL = "https://stock-app-backend-okhx.onrender.com";

let currentSymbol = "";

// 🔍 Load stock
async function loadStock() {
    const symbol = document.getElementById("stockInput").value;
    if (!symbol) return alert("Enter stock");

    currentSymbol = symbol;
    document.getElementById("stockName").innerText = symbol;

    fetchStock(symbol);
}

// 📡 Fetch from backend
async function fetchStock(symbol) {
    try {
        const res = await fetch(`${BASE_URL}/api/stock/${symbol}`);
        const data = await res.json();

        const ts = data["Time Series (Daily)"];
        if (!ts) return alert("No data / API limit");

        const dates = Object.keys(ts).slice(0, 10).reverse();
        const prices = dates.map(d => parseFloat(ts[d]["4. close"]));

        updatePrice(prices);
        analyzeStock(prices);

    } catch (err) {
        console.error(err);
    }
}

// 🔴 Price
function updatePrice(prices) {
    const latest = prices[prices.length - 1];
    document.getElementById("price").innerText = "Price: ₹ " + latest;
}

// 🤖 AI Signal (Moving Average)
function analyzeStock(prices) {
    const latest = prices[prices.length - 1];
    const avg = prices.reduce((a, b) => a + b) / prices.length;

    let signal = "";
    let color = "";

    if (latest > avg) {
        signal = "BUY 📈";
        color = "lightgreen";
    } else {
        signal = "SELL 📉";
        color = "red";
    }

    const el = document.getElementById("signal");
    el.innerText = "Signal: " + signal;
    el.style.color = color;
}

// ⭐ Watchlist
function addToWatchlist() {
    if (!currentSymbol) return;

    let list = JSON.parse(localStorage.getItem("stocks")) || [];

    if (!list.includes(currentSymbol)) {
        list.push(currentSymbol);
        localStorage.setItem("stocks", JSON.stringify(list));
    }

    renderWatchlist();
}

// 📌 Render watchlist
function renderWatchlist() {
    const list = JSON.parse(localStorage.getItem("stocks")) || [];
    const container = document.getElementById("watchlist");

    container.innerHTML = "";

    list.forEach(stock => {
        const el = document.createElement("span");
        el.innerText = stock;

        el.onclick = () => {
            document.getElementById("stockInput").value = stock;
            loadStock();
        };

        container.appendChild(el);
    });
}

// Auto refresh
setInterval(() => {
    if (currentSymbol) fetchStock(currentSymbol);
}, 30000);

renderWatchlist();