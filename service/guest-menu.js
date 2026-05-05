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
const tableParam = params.get("t");

const umbrellaEl = document.getElementById("umbrellaNumber");
const umbrellaLabelText = document.getElementById("umbrellaLabelText");
const helperText = document.getElementById("helperText");
const callBtn = document.getElementById("callWaiterBtn");
const sendOrderBtn = document.getElementById("sendOrderBtn");
const quickMenuTitle = document.getElementById("quickMenuTitle");
const messageArea = document.getElementById("messageArea");
const menuGrid = document.getElementById("menuGrid");
const menuSearch = document.getElementById("menuSearch");
const menuSearchEmpty = document.getElementById("menuSearchEmpty");
const cartTitleEl = document.getElementById("cartTitle");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const orderNote = document.getElementById("orderNote");
const categoryShortcutsEl = document.getElementById("categoryShortcuts");
const langButtons = document.querySelectorAll(".lang-btn");

const LANG_KEY = "valeMenuLanguage";
const SUPPORTED_LANGS = ["sq", "en", "it"];

const parseLocationParam = (type, value, max) => {
  if (!value || !/^\d+$/.test(value)) return null;

  const number = Number(value);
  if (number < 1 || number > max) return null;

  return {
    type,
    number,
    labelSq: type === "umbrella" ? `Çadra ${number}` : `Tavolina ${number}`,
  };
};

const locationInfo = umbrellaParam
  ? parseLocationParam("umbrella", umbrellaParam, 100)
  : parseLocationParam("table", tableParam, 50);

const buildLocationPayload = () => {
  if (!locationInfo) return {};

  const payload = {
    locationType: locationInfo.type,
    locationNumber: locationInfo.number,
    locationLabel: locationInfo.labelSq,
  };

  if (locationInfo.type === "umbrella") {
    payload.umbrella = locationInfo.number;
    payload.umbrellaNumber = locationInfo.number;
  } else {
    payload.tableNumber = locationInfo.number;
  }

  return payload;
};

if (!localStorage.getItem(LANG_KEY)) {
  localStorage.setItem(LANG_KEY, "sq");
}

const uiText = {
  sq: {
    umbrella: "Çadra",
    table: "Tavolina",
    callWaiter: "Thërrit Kamarierin",
    sendOrder: "Dërgo Porosinë",
    quickMenu: "Menu e Shpejtë",
    searchPlaceholder: "Kërko produktin…",
    searchEmpty: "Asnjë produkt i gjetur.",
    cart: "Shporta",
    total: "Totali",
    noItems: "Asnjë produkt i zgjedhur",
    notePlaceholder: "Shënime të veçanta (opsionale)",
    itemCountSingle: "produkt",
    itemCountPlural: "produkte",
    msgWaitBeforeCall:
      "Ju lutem prisni pak para se ta thërrisni sërish kamarierin.",
    msgSendingWaiter: "Po dërgohet kërkesa për kamarierin…",
    msgWaiterRequested: (locationLabel) =>
      `Kamarieri u njoftua për ${locationLabel}.`,
    msgWaiterFailed: "Kërkesa nuk u dërgua dot. Provoni sërish pas pak.",
    msgAddItemsFirst: "Ju lutem shtoni fillimisht produkte.",
    msgWaitBeforeOrder:
      "Ju lutem prisni pak para se të dërgoni një porosi tjetër.",
    msgSendingOrder: "Po dërgohet porosia…",
    msgOrderSent: (locationLabel) => `Porosia u dërgua për ${locationLabel}.`,
    msgOrderFailed: "Porosia nuk u dërgua dot. Provoni sërish pas pak.",
    msgUmbrellaNotIdentified:
      "Lokacioni nuk u identifikua. Ju lutem skanoni përsëri kodin QR.",
    msgUmbrellaMissing:
      "Mungon identifikimi i lokacionit. Ju lutem skanoni përsëri kodin QR.",
  },
  en: {
    umbrella: "Umbrella",
    table: "Table",
    callWaiter: "Call Waiter",
    sendOrder: "Send Order",
    quickMenu: "Quick Menu",
    searchPlaceholder: "Search menu…",
    searchEmpty: "No matching products found.",
    cart: "Cart",
    total: "Total",
    noItems: "No items yet.",
    notePlaceholder: "Add a note (optional)",
    itemCountSingle: "item",
    itemCountPlural: "items",
    msgWaitBeforeCall: "Please wait before calling again.",
    msgSendingWaiter: "Sending waiter request…",
    msgWaiterRequested: (locationLabel) =>
      `Waiter requested for ${locationLabel}.`,
    msgWaiterFailed: "Unable to send the request. Try again shortly.",
    msgAddItemsFirst: "Please add items first.",
    msgWaitBeforeOrder: "Please wait before sending another order.",
    msgSendingOrder: "Sending order…",
    msgOrderSent: (locationLabel) => `Order sent for ${locationLabel}.`,
    msgOrderFailed: "Unable to send the order. Try again soon.",
    msgUmbrellaNotIdentified:
      "Location not identified. Please scan the QR code again.",
    msgUmbrellaMissing: "Location missing. Scan the QR code again.",
  },
  it: {
    umbrella: "Ombrellone",
    table: "Tavolo",
    callWaiter: "Chiama il Cameriere",
    sendOrder: "Invia l'Ordine",
    quickMenu: "Menu Rapido",
    searchPlaceholder: "Cerca nel menu…",
    searchEmpty: "Nessun prodotto trovato.",
    cart: "Carrello",
    total: "Totale",
    noItems: "Nessun prodotto selezionato",
    notePlaceholder: "Note particolari (opzionale)",
    itemCountSingle: "prodotto",
    itemCountPlural: "prodotti",
    msgWaitBeforeCall: "Attendi prima di richiamare di nuovo.",
    msgSendingWaiter: "Invio della richiesta al cameriere…",
    msgWaiterRequested: (locationLabel) =>
      `Cameriere richiesto per ${locationLabel}.`,
    msgWaiterFailed: "Impossibile inviare la richiesta. Riprova tra poco.",
    msgAddItemsFirst: "Aggiungi prima dei prodotti.",
    msgWaitBeforeOrder: "Attendi prima di inviare un altro ordine.",
    msgSendingOrder: "Invio dell'ordine…",
    msgOrderSent: (locationLabel) => `Ordine inviato per ${locationLabel}.`,
    msgOrderFailed: "Impossibile inviare l'ordine. Riprova tra poco.",
    msgUmbrellaNotIdentified:
      "Posizione non identificata. Scansiona di nuovo il codice QR.",
    msgUmbrellaMissing:
      "Manca l'identificazione della posizione. Scansiona di nuovo il codice QR.",
  },
};

const getCurrentLanguage = () => {
  const stored = localStorage.getItem(LANG_KEY);
  return SUPPORTED_LANGS.includes(stored) ? stored : "sq";
};

const getUIText = () => uiText[getCurrentLanguage()] || uiText.sq;

const getDisplayLocationLabel = () => {
  const t = getUIText();
  const label = locationInfo?.type === "table" ? t.table : t.umbrella;
  return `${label} ${locationInfo?.number ?? "—"}`;
};

const showMessage = (text, variant = "success") => {
  messageArea.textContent = text;
  messageArea.className = `messages message-${variant}`;
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
const getLocalizedCategory = (item, lang) =>
  getLocalizedValue(item, "category", lang);
const getLocalizedNote = (item, lang) => getLocalizedValue(item, "note", lang);
const getLocalizedPriceLabel = (item) => `${item.price} LEK`;

const getSearchTerm = () =>
  menuSearch ? menuSearch.value.trim().toLowerCase() : "";

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const scrollToCategory = (categoryKey) => {
  const target = document.getElementById(`category-${slugify(categoryKey)}`);
  if (!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const getMenuCategories = () => {
  const lang = getCurrentLanguage();
  const categories = [];

  menuData.forEach((item) => {
    if (!item.active) return;

    const existing = categories.find((entry) => entry.key === item.category);
    if (existing) return;

    categories.push({
      key: item.category,
      label: getLocalizedCategory(item, lang) || item.category,
    });
  });

  return categories;
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
  const t = getUIText();

  cartTotalEl.textContent = `${t.total}: ${total} LEK`;

  if (!entries.length) {
    cartItemsEl.textContent = t.noItems;
    return;
  }

  const itemCount = entries.reduce((sum, entry) => sum + entry.qty, 0);
  const itemLabel = itemCount === 1 ? t.itemCountSingle : t.itemCountPlural;

  cartItemsEl.innerHTML = `
    <div class="cart-summary-count">
      ${itemCount} ${itemLabel}
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
  const searchTerm = getSearchTerm();
  const categories = {};

  menuData.forEach((item) => {
    if (!item.active) return;

    const localizedName = getLocalizedName(item, lang) || item.name;
    const localizedNote = getLocalizedNote(item, lang);
    const localizedCategory = getLocalizedCategory(item, lang) || item.category;

    const haystack =
      `${localizedName} ${localizedNote} ${localizedCategory}`.toLowerCase();
    if (searchTerm && !haystack.includes(searchTerm)) return;

    const key = item.category;

    if (!categories[key]) {
      categories[key] = {
        key,
        label: localizedCategory,
        items: [],
      };
    }

    categories[key].items.push(item);
  });

  const groups = Object.values(categories);

  if (menuSearchEmpty) {
    const t = getUIText();
    menuSearchEmpty.textContent = t.searchEmpty;
    menuSearchEmpty.hidden = groups.length > 0;
  }

  menuGrid.innerHTML = groups
    .map(
      (group) => `
      <div class="category-block" id="category-${slugify(group.key)}" data-category-key="${group.key}">
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

const renderCategoryShortcuts = () => {
  if (!categoryShortcutsEl) return;

  const categories = getMenuCategories();
  const searchTerm = getSearchTerm();

  if (searchTerm || !categories.length) {
    categoryShortcutsEl.innerHTML = "";
    return;
  }

  categoryShortcutsEl.innerHTML = `
    <div class="shortcut-list">
      ${categories
        .map(
          (category) => `
            <button
              type="button"
              class="shortcut-chip"
              data-category-target="${category.key}"
            >
              ${category.label}
            </button>
          `
        )
        .join("")}
    </div>
  `;
};

const updateStaticLabels = () => {
  const t = getUIText();

  if (umbrellaLabelText) {
    umbrellaLabelText.textContent =
      locationInfo?.type === "table" ? t.table : t.umbrella;
  }
  if (callBtn) callBtn.textContent = t.callWaiter;
  if (sendOrderBtn) sendOrderBtn.textContent = t.sendOrder;
  if (quickMenuTitle) quickMenuTitle.textContent = t.quickMenu;
  if (cartTitleEl) cartTitleEl.textContent = t.cart;
  if (orderNote) orderNote.placeholder = t.notePlaceholder;
  if (menuSearch) menuSearch.placeholder = t.searchPlaceholder;
  if (menuSearchEmpty) menuSearchEmpty.textContent = t.searchEmpty;
};

const refreshMenuDisplay = () => {
  updateLanguageButtons();
  updateStaticLabels();
  buildMenu();
  renderCart();
  renderCategoryShortcuts();
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

if (categoryShortcutsEl) {
  categoryShortcutsEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-target]");
    if (!button) return;

    scrollToCategory(button.dataset.categoryTarget);
  });
}

if (menuSearch) {
  menuSearch.addEventListener("input", () => {
    buildMenu();
    renderCategoryShortcuts();
  });
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
  });
});

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

refreshMenuDisplay();

if (locationInfo) {
  umbrellaEl.textContent = locationInfo.number;
  callBtn.disabled = false;
  sendOrderBtn.disabled = false;

  callBtn.addEventListener("click", async () => {
    const t = getUIText();

    if (!tryOncePer(`lastWaiter_${locationInfo.type}_${locationInfo.number}`, 12000)) {
      showMessage(t.msgWaitBeforeCall, "error");
      return;
    }

    callBtn.disabled = true;
    showMessage(t.msgSendingWaiter);

    try {
      await waiterCalls.add({
        ...buildLocationPayload(),
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        source: "qr",
      });
      showMessage(t.msgWaiterRequested(getDisplayLocationLabel()));
    } catch (error) {
      console.error(error);
      showMessage(t.msgWaiterFailed, "error");
    } finally {
      setTimeout(() => {
        callBtn.disabled = false;
      }, 12000);
    }
  });

  sendOrderBtn.addEventListener("click", async () => {
    const t = getUIText();
    const { entries, total } = calculateCart();

    if (!entries.length) {
      showMessage(t.msgAddItemsFirst, "error");
      return;
    }

    if (!tryOncePer(`lastOrder_${locationInfo.type}_${locationInfo.number}`, 12000)) {
      showMessage(t.msgWaitBeforeOrder, "error");
      return;
    }

    sendOrderBtn.disabled = true;
    showMessage(t.msgSendingOrder);

    try {
      const payloadItems = entries.map((entry) => ({
        id: entry.id,
        name: entry.displayName,
        qty: entry.qty,
        price: entry.price,
        subtotal: entry.price * entry.qty,
      }));

      await ordersRef.add({
        ...buildLocationPayload(),
        items: payloadItems,
        note: orderNote.value.trim(),
        total,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        source: "qr",
      });

      Object.keys(cart).forEach((key) => {
        cart[key] = 0;
      });

      document.querySelectorAll(".qty-value").forEach((el) => {
        el.textContent = "0";
      });

      orderNote.value = "";
      refreshMenuDisplay();
      showMessage(t.msgOrderSent(getDisplayLocationLabel()));
    } catch (error) {
      console.error(error);
      showMessage(t.msgOrderFailed, "error");
    } finally {
      setTimeout(() => {
        sendOrderBtn.disabled = false;
      }, 12000);
    }
  });
} else {
  const t = getUIText();

  umbrellaEl.textContent = "—";

  if (helperText) {
    helperText.textContent = t.msgUmbrellaNotIdentified;
  }

  showMessage(t.msgUmbrellaMissing, "error");
}
