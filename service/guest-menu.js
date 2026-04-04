const firebaseConfig = {
  apiKey: "AIzaSyBdP80zCTQr3DluoDhn5aQDKVTVqhBVKQU",
  authDomain: "vale-admin-a3c51.firebaseapp.com",
  projectId: "vale-admin-a3c51",
  storageBucket: "vale-admin-a3c51.firebasestorage.app",
  messagingSenderId: "42562595285",
  appId: "1:42562595285:web:6665e51bd4447d5f8a355c",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const waiterCalls = db.collection("waiter_calls");
const ordersRef = db.collection("orders");

// UI elements
const params = new URLSearchParams(window.location.search);
const umbrellaParam = params.get("u");
const umbrellaEl = document.getElementById("umbrellaNumber");
const helperText = document.getElementById("helperText");
const callBtn = document.getElementById("callWaiterBtn");
const sendOrderBtn = document.getElementById("sendOrderBtn");
const messageArea = document.getElementById("messageArea");
const menuGrid = document.getElementById("menuGrid");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const orderNote = document.getElementById("orderNote");

const showMessage = (text, variant = "success") => {
  messageArea.textContent = text;
  messageArea.className = `messages message-${variant}`;
};

const cart = {};

const calculateCart = () => {
  const entries = menuData
    .filter((item) => cart[item.id] > 0)
    .map((item) => ({ ...item, qty: cart[item.id] }));
  const total = entries.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { entries, total };
};

const renderCart = () => {
  const { entries, total } = calculateCart();
  cartTotalEl.textContent = `Total: ${total} LEK`;
  if (!entries.length) {
    cartItemsEl.textContent = "No items yet.";
    sendOrderBtn.disabled = true;
    return;
  }
  cartItemsEl.innerHTML = entries
    .map((entry) => `${entry.name} x${entry.qty}`)
    .join(" · ");
  sendOrderBtn.disabled = false;
};

const updateQty = (itemId, delta) => {
  cart[itemId] = Math.max(0, (cart[itemId] || 0) + delta);
  const display = document.querySelector(`[data-item="${itemId}"] .qty-value`);
  if (display) {
    display.textContent = cart[itemId];
  }
  renderCart();
};

const buildMenu = () => {
  const categories = {};
  menuData.forEach((item) => {
    if (!item.active) return;
    categories[item.category] = categories[item.category] || [];
    categories[item.category].push(item);
  });

  menuGrid.innerHTML = Object.entries(categories)
    .map(
      ([category, items]) => `
      <div class="category-block">
        <h3>${category.replace(/\b\w/g, (char) => char.toUpperCase())}</h3>
        <div class="category-items">
          ${items
            .map(
              (item) => `
            <div class="menu-card" data-item="${item.id}">
              <h3>${item.name}</h3>
              <span>${item.price} LEK</span>
              <div class="qty-controls">
                <button type="button" data-action="decrease" data-id="${item.id}">-</button>
                <span class="qty-value">0</span>
                <button type="button" data-action="increase" data-id="${item.id}">+</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
    )
    .join("");
};

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = button.dataset.id;
  if (button.dataset.action === "increase") {
    updateQty(id, 1);
  } else if (button.dataset.action === "decrease") {
    updateQty(id, -1);
  }
});

buildMenu();
renderCart();

const tryOncePer = (key, duration = 15000) => {
  const last = Number(localStorage.getItem(key) || "0");
  if (Date.now() - last < duration) {
    return false;
  }
  localStorage.setItem(key, String(Date.now()));
  return true;
};

if (umbrellaParam && !isNaN(Number(umbrellaParam))) {
  const umbrellaNumber = Number(umbrellaParam);
  umbrellaEl.textContent = umbrellaNumber;
  callBtn.disabled = false;
  sendOrderBtn.disabled = true;

  callBtn.addEventListener("click", async () => {
    if (!tryOncePer(`lastWaiter_${umbrellaNumber}`, 12000)) {
      showMessage("Please wait before calling again.", "error");
      return;
    }
    callBtn.disabled = true;
    showMessage("Sending waiter request…");
    try {
      await waiterCalls.add({
        umbrella: umbrellaNumber,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        source: "qr",
      });
      showMessage(`Waiter requested for Umbrella ${umbrellaNumber}.`);
    } catch (error) {
      console.error(error);
      showMessage("Unable to send the request. Try again shortly.", "error");
    } finally {
      setTimeout(() => {
        callBtn.disabled = false;
      }, 12000);
    }
  });

  sendOrderBtn.addEventListener("click", async () => {
    const { entries, total } = calculateCart();
    if (!entries.length) return;
    if (!tryOncePer(`lastOrder_${umbrellaNumber}`, 12000)) {
      showMessage("Please wait before sending another order.", "error");
      return;
    }
    sendOrderBtn.disabled = true;
    showMessage("Sending order…");
    try {
      await ordersRef.add({
        umbrella: umbrellaNumber,
        items: entries,
        note: orderNote.value.trim(),
        total,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        source: "qr",
      });
      Object.keys(cart).forEach((key) => (cart[key] = 0));
      document.querySelectorAll(".qty-value").forEach((el) => (el.textContent = "0"));
      orderNote.value = "";
      renderCart();
      showMessage(`Order sent for Umbrella ${umbrellaNumber}.`);
    } catch (error) {
      console.error(error);
      showMessage("Unable to send the order. Try again soon.", "error");
    } finally {
      setTimeout(() => {
        sendOrderBtn.disabled = false;
      }, 12000);
    }
  });
} else {
  umbrellaEl.textContent = "—";
  helperText.textContent =
    "Umbrella not identified. Please scan the QR code on your umbrella again.";
  showMessage("Umbrella missing. Scan the QR code again.", "error");
}
