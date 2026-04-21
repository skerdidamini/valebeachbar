(() => {
  "use strict";

  const auth = window.firebaseAuth;
  const db = window.firebaseDB;
  const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

  const els = {
    financeApp: document.getElementById("financeApp"),
    loadingOverlay: document.getElementById("loadingOverlay"),
    toastArea: document.getElementById("toastArea"),

    sessionUser: document.getElementById("sessionUser"),
    logoutBtn: document.getElementById("logoutBtn"),

    cardIncomeToday: document.getElementById("cardIncomeToday"),
    cardExpensesToday: document.getElementById("cardExpensesToday"),
    cardNetToday: document.getElementById("cardNetToday"),
    cardEntriesToday: document.getElementById("cardEntriesToday"),

    tabButtons: Array.from(document.querySelectorAll(".tab-btn[data-tab]")),
    tabPanels: Array.from(document.querySelectorAll(".tab-panel[data-tab-panel]")),

    incomeForm: document.getElementById("incomeForm"),
    incomeAmount: document.getElementById("incomeAmount"),
    incomeCategory: document.getElementById("incomeCategory"),
    umbrellaCountWrap: document.getElementById("umbrellaCountWrap"),
    incomeUmbrellaCount: document.getElementById("incomeUmbrellaCount"),
    incomePaymentMethod: document.getElementById("incomePaymentMethod"),
    incomeSaveBtn: document.getElementById("incomeSaveBtn"),
    incomeFormMsg: document.getElementById("incomeFormMsg"),
    incomeFilters: document.getElementById("incomeFilters"),
    incomeTotalLabel: document.getElementById("incomeTotalLabel"),
    incomeTotalAmount: document.getElementById("incomeTotalAmount"),
    incomeTbody: document.getElementById("incomeTbody"),

    expenseForm: document.getElementById("expenseForm"),
    expenseAmount: document.getElementById("expenseAmount"),
    expenseType: document.getElementById("expenseType"),
    expenseTypeCustomWrap: document.getElementById("expenseTypeCustomWrap"),
    expenseTypeCustom: document.getElementById("expenseTypeCustom"),
    expenseSupplier: document.getElementById("expenseSupplier"),
    expenseSupplierCustomWrap: document.getElementById("expenseSupplierCustomWrap"),
    expenseSupplierCustom: document.getElementById("expenseSupplierCustom"),
    expensePaymentMethod: document.getElementById("expensePaymentMethod"),
    expenseNote: document.getElementById("expenseNote"),
    expenseSaveBtn: document.getElementById("expenseSaveBtn"),
    expenseFormMsg: document.getElementById("expenseFormMsg"),
    expenseFilters: document.getElementById("expenseFilters"),
    expenseTotalLabel: document.getElementById("expenseTotalLabel"),
    expenseTotalAmount: document.getElementById("expenseTotalAmount"),
    expenseTbody: document.getElementById("expenseTbody")
  };

  const state = {
    currentAuthUser: null,
    currentProfile: null,
    activeTab: "income",
    incomeRange: "today",
    expenseRange: "today",
    overview: {
      incomeToday: 0,
      expenseToday: 0,
      incomeCountToday: 0,
      expenseCountToday: 0
    },
    unsub: {
      overviewIncome: null,
      overviewExpenses: null,
      incomeList: null,
      expenseList: null
    }
  };

  function safeText(value) {
    return value == null ? "" : String(value);
  }

  function formatMoneyALL(amount) {
    const num = Number(amount || 0);
    try {
      return new Intl.NumberFormat("sq-AL", {
        style: "currency",
        currency: "ALL",
        maximumFractionDigits: 0
      }).format(num);
    } catch {
      return `${Math.round(num)} ALL`;
    }
  }

  function formatTime(ts) {
    if (!ts) return "—";
    const date = ts.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
    if (!date) return "—";
    try {
      return new Intl.DateTimeFormat("sq-AL", { hour: "2-digit", minute: "2-digit" }).format(date);
    } catch {
      const h = String(date.getHours()).padStart(2, "0");
      const m = String(date.getMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }
  }

  function rangeLabel(rangeKey) {
    if (rangeKey === "today") return "Sot";
    if (rangeKey === "week") return "Kjo javë";
    if (rangeKey === "month") return "Ky muaj";
    return "—";
  }

  function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function startOfTomorrow() {
    const d = startOfDay(new Date());
    d.setDate(d.getDate() + 1);
    return d;
  }

  function startOfWeekMonday(date) {
    const d = startOfDay(date);
    const day = d.getDay(); // 0=Sun, 1=Mon
    const diff = (day + 6) % 7; // Monday -> 0, Sunday -> 6
    d.setDate(d.getDate() - diff);
    return d;
  }

  function startOfMonth(date) {
    const d = startOfDay(date);
    d.setDate(1);
    return d;
  }

  function getRange(rangeKey) {
    const now = new Date();
    const end = startOfTomorrow();

    if (rangeKey === "today") return { start: startOfDay(now), end };
    if (rangeKey === "week") return { start: startOfWeekMonday(now), end };
    if (rangeKey === "month") return { start: startOfMonth(now), end };

    return { start: startOfDay(now), end };
  }

  function setBusy(isBusy) {
    els.financeApp?.setAttribute("aria-busy", isBusy ? "true" : "false");
    if (els.loadingOverlay) els.loadingOverlay.style.display = isBusy ? "grid" : "none";
  }

  function toast(kind, title, msg) {
    if (!els.toastArea) return;
    const toastEl = document.createElement("div");
    toastEl.className = `toast ${kind === "success" ? "is-success" : kind === "error" ? "is-error" : ""}`;
    toastEl.innerHTML = `<p class="title">${safeText(title)}</p><p class="msg">${safeText(msg)}</p>`;
    els.toastArea.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 3400);
  }

  function setInlineMsg(el, message, kind) {
    if (!el) return;
    el.textContent = message || "";
    el.style.color = kind === "error" ? "var(--bad)" : kind === "success" ? "var(--good)" : "var(--muted)";
  }

  function setActiveButtons(container, selector, activeKey) {
    if (!container) return;
    container.querySelectorAll(selector).forEach((btn) => {
      const key = btn.getAttribute("data-range") || btn.getAttribute("data-tab");
      btn.classList.toggle("is-active", key === activeKey);
    });
  }

  function setActiveTab(tabKey) {
    state.activeTab = tabKey;
    els.tabButtons.forEach((btn) => btn.classList.toggle("is-active", btn.getAttribute("data-tab") === tabKey));
    els.tabPanels.forEach((panel) =>
      panel.classList.toggle("is-active", panel.getAttribute("data-tab-panel") === tabKey)
    );
    setTimeout(() => (tabKey === "income" ? els.incomeAmount?.focus() : els.expenseAmount?.focus()), 0);
  }

  function buildUmbrellaCountOptions() {
    if (!els.incomeUmbrellaCount) return;
    const max = 120;
    const frag = document.createDocumentFragment();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Zgjidh…";
    placeholder.disabled = true;
    placeholder.selected = true;
    frag.appendChild(placeholder);
    for (let i = 1; i <= max; i += 1) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = String(i);
      frag.appendChild(opt);
    }
    els.incomeUmbrellaCount.innerHTML = "";
    els.incomeUmbrellaCount.appendChild(frag);
  }

  function toggleUmbrellaCount() {
    const isCadra = els.incomeCategory?.value === "Cadra";
    els.umbrellaCountWrap?.classList.toggle("is-hidden", !isCadra);
    if (els.incomeUmbrellaCount) {
      els.incomeUmbrellaCount.required = Boolean(isCadra);
      if (!isCadra) els.incomeUmbrellaCount.value = "";
    }
  }

  function toggleExpenseTypeCustom() {
    const isOther = els.expenseType?.value === "Të tjera";
    els.expenseTypeCustomWrap?.classList.toggle("is-hidden", !isOther);
    if (els.expenseTypeCustom) {
      els.expenseTypeCustom.required = Boolean(isOther);
      if (!isOther) els.expenseTypeCustom.value = "";
    }
  }

  function toggleExpenseSupplierCustom() {
    const isOther = els.expenseSupplier?.value === "Të tjerë";
    els.expenseSupplierCustomWrap?.classList.toggle("is-hidden", !isOther);
    if (els.expenseSupplierCustom) {
      els.expenseSupplierCustom.required = Boolean(isOther);
      if (!isOther) els.expenseSupplierCustom.value = "";
    }
  }

  function stopSubscriptions() {
    Object.values(state.unsub).forEach((unsub) => {
      try {
        unsub?.();
      } catch {}
    });
    state.unsub.overviewIncome = null;
    state.unsub.overviewExpenses = null;
    state.unsub.incomeList = null;
    state.unsub.expenseList = null;
  }

  function getDisplayType(expense) {
    if (!expense) return "";
    if (expense.type === "Të tjera") return expense.typeCustom || "Të tjera";
    return expense.type || "";
  }

  function getDisplaySupplier(expense) {
    if (!expense) return "";
    if (expense.supplier === "Të tjerë") return expense.supplierCustom || "Të tjerë";
    return expense.supplier || "";
  }

  function renderIncomeTable(items) {
    if (!els.incomeTbody) return;
    els.incomeTbody.innerHTML = "";
    if (!items.length) {
      els.incomeTbody.innerHTML = `<tr><td colspan="6" class="empty">Nuk ka të dhëna.</td></tr>`;
      return;
    }
    for (const item of items) {
      const umbrella = item.category === "Cadra" ? safeText(item.umbrellaCount || "—") : "—";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatTime(item.createdAt)}</td>
        <td>${formatMoneyALL(item.amount)}</td>
        <td>${safeText(item.category)}</td>
        <td>${umbrella}</td>
        <td>${safeText(item.paymentMethod)}</td>
        <td><button type="button" class="danger-btn" data-action="delete-income" data-id="${item.id}">Fshi</button></td>
      `;
      els.incomeTbody.appendChild(tr);
    }
  }

  function renderExpenseTable(items) {
    if (!els.expenseTbody) return;
    els.expenseTbody.innerHTML = "";
    if (!items.length) {
      els.expenseTbody.innerHTML = `<tr><td colspan="7" class="empty">Nuk ka të dhëna.</td></tr>`;
      return;
    }
    for (const item of items) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatTime(item.createdAt)}</td>
        <td>${formatMoneyALL(item.amount)}</td>
        <td>${safeText(getDisplayType(item))}</td>
        <td>${safeText(getDisplaySupplier(item))}</td>
        <td>${safeText(item.paymentMethod || "—")}</td>
        <td>${safeText(item.note || "—")}</td>
        <td><button type="button" class="danger-btn" data-action="delete-expense" data-id="${item.id}">Fshi</button></td>
      `;
      els.expenseTbody.appendChild(tr);
    }
  }

  function updateIncomeTotal(rangeKey, totalAmount, count) {
    if (els.incomeTotalLabel) els.incomeTotalLabel.textContent = `Totali (${rangeLabel(rangeKey)}) · ${count}`;
    if (els.incomeTotalAmount) els.incomeTotalAmount.textContent = formatMoneyALL(totalAmount);
  }

  function updateExpenseTotal(rangeKey, totalAmount, count) {
    if (els.expenseTotalLabel) els.expenseTotalLabel.textContent = `Totali (${rangeLabel(rangeKey)}) · ${count}`;
    if (els.expenseTotalAmount) els.expenseTotalAmount.textContent = formatMoneyALL(totalAmount);
  }

  function recomputeEntriesToday() {
    return (state.overview.incomeCountToday || 0) + (state.overview.expenseCountToday || 0);
  }

  function updateOverviewCards() {
    const income = state.overview.incomeToday;
    const expenses = state.overview.expenseToday;
    const net = income - expenses;
    const entries = recomputeEntriesToday();
    if (els.cardIncomeToday) els.cardIncomeToday.textContent = formatMoneyALL(income);
    if (els.cardExpensesToday) els.cardExpensesToday.textContent = formatMoneyALL(expenses);
    if (els.cardNetToday) {
      els.cardNetToday.textContent = formatMoneyALL(net);
      els.cardNetToday.style.color = net >= 0 ? "var(--good)" : "var(--bad)";
    }
    if (els.cardEntriesToday) els.cardEntriesToday.textContent = String(entries);
  }

  function subscribeOverview() {
    const { start, end } = getRange("today");
    const startTs = firebase.firestore.Timestamp.fromDate(start);
    const endTs = firebase.firestore.Timestamp.fromDate(end);
    const incomeQuery = db
      .collection("income_entries")
      .where("createdAt", ">=", startTs)
      .where("createdAt", "<", endTs);
    const expenseQuery = db
      .collection("expenses")
      .where("createdAt", ">=", startTs)
      .where("createdAt", "<", endTs);

    state.unsub.overviewIncome = incomeQuery.onSnapshot(
      (snap) => {
        let sum = 0;
        let count = 0;
        snap.forEach((doc) => {
          const data = doc.data();
          if (data?.status === "deleted") return;
          count += 1;
          sum += Number(data.amount || 0);
        });
        state.overview.incomeToday = sum;
        state.overview.incomeCountToday = count;
        updateOverviewCards();
      },
      (err) => {
        console.error("Overview income listener error", err);
        toast("error", "Gabim", "Nuk u lexuan të ardhurat (sot).");
      }
    );

    state.unsub.overviewExpenses = expenseQuery.onSnapshot(
      (snap) => {
        let sum = 0;
        let count = 0;
        snap.forEach((doc) => {
          const data = doc.data();
          if (data?.status === "deleted") return;
          count += 1;
          sum += Number(data.amount || 0);
        });
        state.overview.expenseToday = sum;
        state.overview.expenseCountToday = count;
        updateOverviewCards();
      },
      (err) => {
        console.error("Overview expense listener error", err);
        toast("error", "Gabim", "Nuk u lexuan shpenzimet (sot).");
      }
    );
  }

  function subscribeIncomeList(rangeKey) {
    state.unsub.incomeList?.();
    const { start, end } = getRange(rangeKey);
    const startTs = firebase.firestore.Timestamp.fromDate(start);
    const endTs = firebase.firestore.Timestamp.fromDate(end);
    const query = db
      .collection("income_entries")
      .where("createdAt", ">=", startTs)
      .where("createdAt", "<", endTs)
      .orderBy("createdAt", "desc")
      .limit(250);

    els.incomeTbody.innerHTML = `<tr><td colspan="6" class="empty">Duke ngarkuar…</td></tr>`;
    state.unsub.incomeList = query.onSnapshot(
      (snap) => {
        const items = [];
        let total = 0;
        snap.forEach((doc) => {
          const data = doc.data();
          if (data?.status === "deleted") return;
          items.push({ id: doc.id, ...data });
          total += Number(data.amount || 0);
        });
        updateIncomeTotal(rangeKey, total, items.length);
        renderIncomeTable(items);
      },
      (err) => {
        console.error("Income list listener error", err);
        els.incomeTbody.innerHTML = `<tr><td colspan="6" class="empty">Gabim gjatë leximit.</td></tr>`;
        toast("error", "Gabim", "Nuk u lexuan të ardhurat.");
      }
    );
  }

  function subscribeExpenseList(rangeKey) {
    state.unsub.expenseList?.();
    const { start, end } = getRange(rangeKey);
    const startTs = firebase.firestore.Timestamp.fromDate(start);
    const endTs = firebase.firestore.Timestamp.fromDate(end);
    const query = db
      .collection("expenses")
      .where("createdAt", ">=", startTs)
      .where("createdAt", "<", endTs)
      .orderBy("createdAt", "desc")
      .limit(250);

    els.expenseTbody.innerHTML = `<tr><td colspan="7" class="empty">Duke ngarkuar…</td></tr>`;
    state.unsub.expenseList = query.onSnapshot(
      (snap) => {
        const items = [];
        let total = 0;
        snap.forEach((doc) => {
          const data = doc.data();
          if (data?.status === "deleted") return;
          items.push({ id: doc.id, ...data });
          total += Number(data.amount || 0);
        });
        updateExpenseTotal(rangeKey, total, items.length);
        renderExpenseTable(items);
      },
      (err) => {
        console.error("Expense list listener error", err);
        els.expenseTbody.innerHTML = `<tr><td colspan="7" class="empty">Gabim gjatë leximit.</td></tr>`;
        toast("error", "Gabim", "Nuk u lexuan shpenzimet.");
      }
    );
  }

  async function softDelete(collection, docId) {
    if (!state.currentAuthUser) return;
    const ok = window.confirm("Je i sigurt që do ta fshish? (Do bëhet vetëm soft delete)");
    if (!ok) return;
    try {
      await db.collection(collection).doc(docId).update({
        status: "deleted",
        deletedAt: serverTimestamp(),
        deletedBy: state.currentAuthUser.uid
      });
      toast("success", "U fshi", "U bë soft delete.");
    } catch (err) {
      console.error("Soft delete error", err);
      toast("error", "Gabim", "Nuk u fshi dot.");
    }
  }

  async function handleIncomeSubmit(event) {
    event.preventDefault();
    setInlineMsg(els.incomeFormMsg, "");
    if (!state.currentAuthUser || !state.currentProfile) {
      setInlineMsg(els.incomeFormMsg, "Nuk je i loguar.", "error");
      return;
    }
    const amount = Number(els.incomeAmount?.value || 0);
    const category = els.incomeCategory?.value || "";
    const paymentMethod = els.incomePaymentMethod?.value || "";
    const umbrellaCount = category === "Cadra" ? els.incomeUmbrellaCount?.value || "" : "";
    if (!amount || amount <= 0) {
      setInlineMsg(els.incomeFormMsg, "Vendos shuma (e vlefshme).", "error");
      els.incomeAmount?.focus();
      return;
    }
    if (!category) {
      setInlineMsg(els.incomeFormMsg, "Zgjidh kategori.", "error");
      els.incomeCategory?.focus();
      return;
    }
    if (category === "Cadra" && !umbrellaCount) {
      setInlineMsg(els.incomeFormMsg, "Zgjidh Nr. Cadrave.", "error");
      els.incomeUmbrellaCount?.focus();
      return;
    }
    if (!paymentMethod) {
      setInlineMsg(els.incomeFormMsg, "Zgjidh pagesën.", "error");
      els.incomePaymentMethod?.focus();
      return;
    }

    els.incomeSaveBtn.disabled = true;
    try {
      await db.collection("income_entries").add({
        amount,
        category,
        umbrellaCount: String(umbrellaCount || ""),
        paymentMethod,
        createdAt: serverTimestamp(),
        createdBy: state.currentAuthUser.uid,
        createdByName: String(state.currentProfile.name || state.currentAuthUser.email || ""),
        status: "active"
      });
      els.incomeForm?.reset();
      toggleUmbrellaCount();
      setInlineMsg(els.incomeFormMsg, "U ruajt.", "success");
      toast("success", "Sukses", "U shtua e ardhura.");
      els.incomeAmount?.focus();
    } catch (err) {
      console.error("Income save error", err);
      setInlineMsg(els.incomeFormMsg, "Gabim gjatë ruajtjes.", "error");
      toast("error", "Gabim", "Nuk u ruajt e ardhura.");
    } finally {
      els.incomeSaveBtn.disabled = false;
    }
  }

  async function handleExpenseSubmit(event) {
    event.preventDefault();
    setInlineMsg(els.expenseFormMsg, "");
    if (!state.currentAuthUser || !state.currentProfile) {
      setInlineMsg(els.expenseFormMsg, "Nuk je i loguar.", "error");
      return;
    }

    const amount = Number(els.expenseAmount?.value || 0);
    const type = els.expenseType?.value || "";
    const typeCustom = (els.expenseTypeCustom?.value || "").trim();
    const supplier = els.expenseSupplier?.value || "";
    const supplierCustom = (els.expenseSupplierCustom?.value || "").trim();
    const paymentMethod = els.expensePaymentMethod?.value || "";
    const note = (els.expenseNote?.value || "").trim();

    if (!amount || amount <= 0) {
      setInlineMsg(els.expenseFormMsg, "Vendos shuma (e vlefshme).", "error");
      els.expenseAmount?.focus();
      return;
    }
    if (!type) {
      setInlineMsg(els.expenseFormMsg, "Zgjidh lloj.", "error");
      els.expenseType?.focus();
      return;
    }
    if (type === "Të tjera" && !typeCustom) {
      setInlineMsg(els.expenseFormMsg, "Shkruaj lloj (custom).", "error");
      els.expenseTypeCustom?.focus();
      return;
    }
    if (!supplier) {
      setInlineMsg(els.expenseFormMsg, "Zgjidh furnitor.", "error");
      els.expenseSupplier?.focus();
      return;
    }
    if (supplier === "Të tjerë" && !supplierCustom) {
      setInlineMsg(els.expenseFormMsg, "Shkruaj furnitor (custom).", "error");
      els.expenseSupplierCustom?.focus();
      return;
    }

    els.expenseSaveBtn.disabled = true;
    try {
      await db.collection("expenses").add({
        amount,
        type,
        typeCustom: String(typeCustom || ""),
        supplier,
        supplierCustom: String(supplierCustom || ""),
        paymentMethod: String(paymentMethod || ""),
        note: String(note || ""),
        createdAt: serverTimestamp(),
        createdBy: state.currentAuthUser.uid,
        createdByName: String(state.currentProfile.name || state.currentAuthUser.email || ""),
        status: "active"
      });
      els.expenseForm?.reset();
      toggleExpenseTypeCustom();
      toggleExpenseSupplierCustom();
      setInlineMsg(els.expenseFormMsg, "U ruajt.", "success");
      toast("success", "Sukses", "U shtua shpenzimi.");
      els.expenseAmount?.focus();
    } catch (err) {
      console.error("Expense save error", err);
      setInlineMsg(els.expenseFormMsg, "Gabim gjatë ruajtjes.", "error");
      toast("error", "Gabim", "Nuk u ruajt shpenzimi.");
    } finally {
      els.expenseSaveBtn.disabled = false;
    }
  }

  async function loadProfileOrDeny(user) {
    const snap = await db.collection("users").doc(user.uid).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  }

  function attachUIListeners() {
    els.logoutBtn?.addEventListener("click", async () => {
      try {
        await auth.signOut();
      } finally {
        window.location.replace("/admin/");
      }
    });

    els.tabButtons.forEach((btn) => btn.addEventListener("click", () => setActiveTab(btn.getAttribute("data-tab"))));
    els.incomeCategory?.addEventListener("change", toggleUmbrellaCount);
    els.expenseType?.addEventListener("change", toggleExpenseTypeCustom);
    els.expenseSupplier?.addEventListener("change", toggleExpenseSupplierCustom);
    els.incomeForm?.addEventListener("submit", handleIncomeSubmit);
    els.expenseForm?.addEventListener("submit", handleExpenseSubmit);

    els.incomeFilters?.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-range]");
      if (!btn) return;
      const rangeKey = btn.getAttribute("data-range");
      if (!rangeKey || rangeKey === state.incomeRange) return;
      state.incomeRange = rangeKey;
      setActiveButtons(els.incomeFilters, "button[data-range]", rangeKey);
      subscribeIncomeList(rangeKey);
      els.incomeAmount?.focus();
    });

    els.expenseFilters?.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-range]");
      if (!btn) return;
      const rangeKey = btn.getAttribute("data-range");
      if (!rangeKey || rangeKey === state.expenseRange) return;
      state.expenseRange = rangeKey;
      setActiveButtons(els.expenseFilters, "button[data-range]", rangeKey);
      subscribeExpenseList(rangeKey);
      els.expenseAmount?.focus();
    });

    els.incomeTbody?.addEventListener("click", (event) => {
      const btn = event.target.closest('button[data-action="delete-income"]');
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      if (id) softDelete("income_entries", id);
    });

    els.expenseTbody?.addEventListener("click", (event) => {
      const btn = event.target.closest('button[data-action="delete-expense"]');
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      if (id) softDelete("expenses", id);
    });
  }

  function initAfterLogin() {
    state.overview.incomeToday = 0;
    state.overview.expenseToday = 0;
    state.overview.incomeCountToday = 0;
    state.overview.expenseCountToday = 0;

    buildUmbrellaCountOptions();
    toggleUmbrellaCount();
    toggleExpenseTypeCustom();
    toggleExpenseSupplierCustom();
    setActiveTab("income");
    setActiveButtons(els.incomeFilters, "button[data-range]", state.incomeRange);
    setActiveButtons(els.expenseFilters, "button[data-range]", state.expenseRange);
    subscribeOverview();
    subscribeIncomeList(state.incomeRange);
    subscribeExpenseList(state.expenseRange);
    setBusy(false);
    setTimeout(() => els.incomeAmount?.focus(), 0);
  }

  function attachAuthGate() {
    if (!auth || !db) {
      toast("error", "Gabim", "Firebase nuk është konfiguruar.");
      return;
    }

    setBusy(true);

    auth.onAuthStateChanged(async (user) => {
      stopSubscriptions();
      state.currentAuthUser = user || null;
      state.currentProfile = null;
      if (!user) {
        window.location.replace("/admin/");
        return;
      }
      try {
        const profile = await loadProfileOrDeny(user);
        if (!profile) {
          await auth.signOut();
          window.location.replace("/admin/");
          return;
        }
        state.currentProfile = profile;
      } catch (err) {
        await auth.signOut();
        window.location.replace("/admin/");
        return;
      }
      if (els.sessionUser) {
        const role = state.currentProfile.role ? ` (${state.currentProfile.role})` : "";
        els.sessionUser.textContent = `${state.currentProfile.name || user.email || "User"}${role}`;
      }
      initAfterLogin();
    });
  }

  function init() {
    attachUIListeners();
    attachAuthGate();
  }

  init();
})();
