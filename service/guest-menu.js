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
const langButtons = document.querySelectorAll(".lang-btn");

const LANG_KEY = "valeMenuLanguage";
const SUPPORTED_LANGS = ["sq", "en", "it"];
if (!localStorage.getItem(LANG_KEY)) {
  localStorage.setItem(LANG_KEY, "sq");
}

const showMessage = (text, variant = "success") => {
  messageArea.textContent = text;
  messageArea.className = `messages message-${variant}`;
};

const getCurrentLanguage = () => {
  const stored = localStorage.getItem(LANG_KEY);
  return SUPPORTED_LANGS.includes(stored) ? stored : "sq";
};

const setLanguage = (lang) => {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  localStorage.setItem(LANG_KEY, lang);
  refreshMenuDisplay();
};

const updateLanguageButtons = () => {
  const lang = getCurrentLanguage();
  langButtons.forEach((btn) => {
    btn.classList.toggle("lang-active", btn.dataset.lang === lang);
  });
};

const getLocalizedValue = (item, key, lang) => {
  return item[`${key}_${lang}`] ?? item[key] ?? "";
};

const getLocalizedName = (item, lang) => getLocalizedValue(item, "name", lang);
const getLocalizedCategory = (item, lang) => getLocalizedValue(item, "category", lang);
const getLocalizedNote = (item, lang) => getLocalizedValue(item, "note", lang);
const getLocalizedPriceLabel = (item, lang) => {
  const label = item[`price_label_${lang}`];
  return label ? label : `${item.price} LEK`;
};

const cart = {};

const calculateCart = () => {
  const lang = getCurrentLanguage();
  const entries = menuData
    .filter((item) => cart[item.id] > 0)
    .map((item) => {
      const qty = cart[item.id];
      return {
        ...item,
        qty,
        displayName: getLocalizedName(item, lang) || item.name,
        displayNote: getLocalizedNote(item, lang),
        displayPriceLabel: getLocalizedPriceLabel(item, lang),
      };
    });
  const total = entries.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
  return { entries, total };
};

const renderCart = () => {
  const { entries, total } = calculateCart();
  cartTotalEl.textContent = `Total: ${total} LEK`;
  if (!entries.length) {
    cartItemsEl.textContent = "No items yet.";
    return;
  }
  const itemCount = entries.reduce((sum, entry) => sum + entry.qty, 0);
  cartItemsEl.innerHTML = `
    <div class="cart-summary-count">
      ${itemCount} item${itemCount === 1 ? "" : "s"}
    </div>
    ${entries
      .map(
        (entry) => `
      <div class="cart-row">
        <span class="cart-row-name">${entry.displayName}</span>
        <span class="cart-row-qty">x${entry.qty}</span>
        <span class="cart-row-line">${entry.price * entry.qty} LEK</span>
        ${entry.displayNote ? `<span class="cart-row-note">${entry.displayNote}</span>` : ""}
      </div>
    `
      )
      .join("")}
  `;
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
  const lang = getCurrentLanguage();
  const categories = {};
  menuData.forEach((item) => {
    if (!item.active) return;
    const key = item.category;
    if (!categories[key]) {
      categories[key] = {
        label: getLocalizedCategory(item, lang) || key,
        items: [],
      };
    }
    categories[key].items.push(item);
  });

  menuGrid.innerHTML = Object.values(categories)
    .map(
      (group) => `
      <div class="category-block">
        <h3 class="category-label">${group.label}</h3>
        <div class="category-items">
          ${group.items
            .map((item) => {
              const localizedName = getLocalizedName(item, lang) || item.name;
              const localizedPrice = getLocalizedPriceLabel(item, lang);
              const localizedNote = getLocalizedNote(item, lang);
              return `
            <div class="menu-card" data-item="${item.id}">
              <div class="menu-card-header">
                <h4>${localizedName}</h4>
                <span class="menu-price">${localizedPrice}</span>
              </div>
              ${localizedNote ? `<p class="menu-note">${localizedNote}</p>` : ""}
              <div class="qty-controls">
                <button type="button" data-action="decrease" data-id="${item.id}">-</button>
                <span class="qty-value">${cart[item.id] || 0}</span>
                <button type="button" data-action="increase" data-id="${item.id}">+</button>
              </div>
            </div>
          `;
            })
            .join("")}
        </div>
      </div>
    `
    )
    .join("");
};

const refreshMenuDisplay = () => {
  updateLanguageButtons();
  buildMenu();
  renderCart();
};

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = button.dataset.id;
  const card = button.closest(".menu-card");
  if (card) {
    card.classList.add("card-pulse");
    setTimeout(() => card.classList.remove("card-pulse"), 220);
  }
  if (button.dataset.action === "increase") {
    updateQty(id, 1);
  } else if (button.dataset.action === "decrease") {
    updateQty(id, -1);
  }
});

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
  });
});

refreshMenuDisplay();

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    refreshMenuDisplay();
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === LANG_KEY) {
    refreshMenuDisplay();
  }
});

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
  sendOrderBtn.disabled = false;

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
    if (!entries.length) {
      showMessage("Please add items first", "error");
      return;
    }
    if (!tryOncePer(`lastOrder_${umbrellaNumber}`, 12000)) {
      showMessage("Please wait before sending another order.", "error");
      return;
    }
    sendOrderBtn.disabled = true;
    showMessage("Sending order…");
    try {
      const payloadItems = entries.map((entry) => ({
        id: entry.id,
        name: entry.displayName,
        qty: entry.qty,
        price: entry.price,
        subtotal: entry.price * entry.qty,
      }));
      await ordersRef.add({
        umbrella: umbrellaNumber,
        items: payloadItems,
        note: orderNote.value.trim(),
        total,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        source: "qr",
      });
      Object.keys(cart).forEach((key) => (cart[key] = 0));
      document.querySelectorAll(".qty-value").forEach((el) => (el.textContent = "0"));
      orderNote.value = "";
      refreshMenuDisplay();
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
