const PRICE_PER_UMBRELLA = 600;
const umbrellaRows = [13, 13, 13, 13, 13, 13, 13, 9];
const TOTAL_UMBRELLAS = umbrellaRows.reduce((sum, row) => sum + row, 0);

let auth = null;
let db = null;
let reservationsRef = null;
let auditRef = null;
let usersRef = null;

let appInitialized = false;
let authListenerAttached = false;
let listenersActive = false;
let reservationsUnsub = null;
let auditUnsub = null;
let usersUnsub = null;

let reservations = [];
let auditEvents = [];
let userDocs = [];
let currentUser = null;
let selectedDate = new Date();
let selectedUmbrella = null;
let loginNoticeOverride = "";

let loginOverlay = null;
let loginForm = null;
let logoutBtn = null;
let todayBtn = null;
let displayedDate = null;
let calendarGrid = null;
let umbrellaRowsContainer = null;
let reservedCountEl = null;
let occupiedCountEl = null;
let freeCountEl = null;
let revenueTotalEl = null;
let detailStatus = null;
let selectedUmbrellaLabel = null;
let reserveForm = null;
let markOccupiedBtn = null;
let markArrivedBtn = null;
let releaseUmbrellaBtn = null;
let deleteEntryBtn = null;
let detailLog = null;
let staffTotalsEl = null;
let auditLogEl = null;
let reportReservedEl = null;
let reportOccupiedEl = null;
let reportRevenueEl = null;
let reportReleasedEl = null;
let userListEl = null;
let userForm = null;
let sessionUser = null;
let loginMessage = null;
let domCached = false;
let appStarted = false;
const STATUS_DEFAULT_MESSAGE = "Enter your email to continue.";

function cacheDOMElements() {
  if (domCached) return;
  domCached = true;

  loginOverlay = document.getElementById("loginOverlay");
  loginForm = document.getElementById("loginForm");
  logoutBtn = document.getElementById("logoutBtn");
  todayBtn = document.getElementById("todayBtn");
  displayedDate = document.getElementById("displayedDate");
  calendarGrid = document.getElementById("calendarGrid");
  umbrellaRowsContainer = document.getElementById("umbrellaRows");
  reservedCountEl = document.getElementById("reservedCount");
  occupiedCountEl = document.getElementById("occupiedCount");
  freeCountEl = document.getElementById("freeCount");
  revenueTotalEl = document.getElementById("revenueTotal");
  detailStatus = document.getElementById("detailStatus");
  selectedUmbrellaLabel = document.getElementById("selectedUmbrellaLabel");
  reserveForm = document.getElementById("reserveForm");
  markOccupiedBtn = document.getElementById("markOccupiedBtn");
  markArrivedBtn = document.getElementById("markArrivedBtn");
  releaseUmbrellaBtn = document.getElementById("releaseUmbrellaBtn");
  deleteEntryBtn = document.getElementById("deleteEntryBtn");
  detailLog = document.getElementById("detailLog");
  staffTotalsEl = document.getElementById("staffTotals");
  auditLogEl = document.getElementById("auditLog");
  reportReservedEl = document.getElementById("reportReserved");
  reportOccupiedEl = document.getElementById("reportOccupied");
  reportRevenueEl = document.getElementById("reportRevenue");
  reportReleasedEl = document.getElementById("reportReleased");
  userListEl = document.getElementById("userList");
  userForm = document.getElementById("userForm");
  sessionUser = document.getElementById("sessionUser");
  loginMessage = document.getElementById("loginMessage");
}

function startApp() {
  if (appStarted) return;
  appStarted = true;
  cacheDOMElements();
  waitForFirebase();
}

function waitForFirebase() {
  if (window.firebaseAuth && window.firebaseDB) {
    auth = window.firebaseAuth;
    db = window.firebaseDB;
    reservationsRef = db.collection("reservations");
    auditRef = db.collection("auditLogs");
    usersRef = db.collection("users");

    console.log("Firebase loaded");
    init();
    return;
  }

  console.log("Waiting for Firebase...");
  setTimeout(waitForFirebase, 100);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getEntries(date) {
  const key = formatDateKey(date);
  return reservations.filter((entry) => entry.date === key);
}

function getEntry(date, umbrellaNumber) {
  return getEntries(date).find((entry) => entry.umbrellaNumber === umbrellaNumber);
}

function pulseElement(el) {
  if (!el) return;
  el.classList.add("pulse");
  setTimeout(() => el.classList.remove("pulse"), 280);
}

function updateDisplayedDate() {
  if (!displayedDate) return;
  const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
  displayedDate.textContent = selectedDate.toLocaleDateString("en-GB", options);
}

function showLoginMessage(text) {
  loginNoticeOverride = text || "";
  if (loginMessage) {
    loginMessage.textContent = loginNoticeOverride || STATUS_DEFAULT_MESSAGE;
  }
}

function resetLoginMessage() {
  loginNoticeOverride = "";
  if (loginMessage) {
    loginMessage.textContent = STATUS_DEFAULT_MESSAGE;
  }
}

function handleRealtimeError(context, error) {
  console.error(`Realtime ${context} listener error`, error);
  alert(`Unable to load ${context} data: ${error?.message || "unknown error"}`);
}

function getGuestHistoryCount(name) {
  if (!name) return 0;
  const normalized = name.trim().toLowerCase();
  return reservations.reduce((total, entry) => {
    if (!entry.guestName) return total;
    const match = entry.guestName.trim().toLowerCase() === normalized;
    return total + (match ? 1 : 0);
  }, 0);
}

function getGuestBadge(name) {
  const total = getGuestHistoryCount(name);
  if (total >= 5) return "Regular guest";
  if (total >= 2) return "Returning guest";
  return "";
}

function sumRevenue(entries) {
  return entries.reduce((total, entry) => total + (Number(entry.amount) || 0), 0);
}

function gatherGuestDetails(existingEntry = null, allowEmptyName = false) {
  if (!reserveForm) return null;
  const formData = new FormData(reserveForm);
  const rawName = existingEntry?.guestName || formData.get("guestName") || "";
  const guestName = rawName.trim();
  if (!guestName && !allowEmptyName) return null;

  const phone = existingEntry?.phone || (formData.get("phone") || "").trim();
  const guestCount = existingEntry?.guestCount || (formData.get("guestCount") || "").trim();
  let notes = existingEntry?.notes || "";
  const formNotes = formData.get("notes");

  if (formNotes && formNotes.trim()) {
    notes = formNotes.trim();
  }

  if (!notes && !existingEntry) {
    notes = "Walk-in arrival";
  }

  return { guestName, phone, guestCount, notes };
}

function resolveName(id) {
  return (userDocs.find((user) => user.id === id) || {}).name || "Unknown";
}

async function audit(action, entry) {
  if (!auditRef || !entry) return;

  const payload = {
    action,
    umbrellaNumber: entry.umbrellaNumber,
    timestamp: new Date().toISOString(),
    date: entry.date || formatDateKey(selectedDate),
    userName: currentUser ? `${currentUser.name} (${currentUser.role})` : "Unknown",
    userId: currentUser?.id || null,
  };

  try {
    await auditRef.add(payload);
  } catch (error) {
    console.error("Audit log failed", error);
  }
}

function renderCalendar() {
  if (!calendarGrid) return;
  calendarGrid.innerHTML = "";
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, month, day);
    const key = formatDateKey(date);
    const button = document.createElement("button");

    button.className = getDayColorClass(key);
    if (formatDateKey(selectedDate) === key) button.classList.add("active");

    button.textContent = day;
    button.addEventListener("click", () => {
      selectedDate = date;
      selectedUmbrella = null;
      updateDisplayedDate();
      renderAll();
    });

    calendarGrid.appendChild(button);
  }
}

function getDayColorClass(key) {
  const count = reservations.filter(
    (entry) =>
      entry.date === key &&
      (entry.status === "reserved" || entry.status === "occupied")
  ).length;

  return count >= 71 ? "red" : "green";
}

function renderUmbrellas() {
  if (!umbrellaRowsContainer) return;
  umbrellaRowsContainer.innerHTML = "";
  let umbrellaNumber = 1;

  umbrellaRows.forEach((count) => {
    const row = document.createElement("div");
    row.className = "umbrella-row";

    for (let i = 0; i < count; i += 1) {
      const currentUmbrella = umbrellaNumber;
      const box = document.createElement("div");
      box.className = "umbrella-box";
      box.dataset.number = currentUmbrella;

      const entry = getEntry(selectedDate, currentUmbrella);
      const visualStatus = !entry || entry.status === "released" ? "free" : entry.status;

      box.classList.add(visualStatus);
      box.textContent = currentUmbrella;

      if (Number(selectedUmbrella) === currentUmbrella) box.classList.add("active");

      box.addEventListener("click", (event) => {
        selectedUmbrella = Number(event.currentTarget.dataset.number);
        renderAll();
      });

      row.appendChild(box);
      umbrellaNumber += 1;
    }

    umbrellaRowsContainer.appendChild(row);
  });
}

function isBusyStatus(status) {
  return status === "reserved" || status === "occupied";
}

function renderStats() {
  if (!reservedCountEl || !occupiedCountEl || !freeCountEl || !revenueTotalEl) return;
  const entries = getEntries(selectedDate);
  const reserved = entries.filter((entry) => entry.status === "reserved").length;
  const occupied = entries.filter((entry) => entry.status === "occupied").length;

  reservedCountEl.textContent = reserved;
  occupiedCountEl.textContent = occupied;
  freeCountEl.textContent = TOTAL_UMBRELLAS - reserved - occupied;
  const revenue = sumRevenue(entries);
  revenueTotalEl.textContent = revenue;

  pulseElement(reservedCountEl);
  pulseElement(occupiedCountEl);
  pulseElement(freeCountEl);
  pulseElement(revenueTotalEl);
}

function renderDetailPanel() {
  if (!detailStatus || !selectedUmbrellaLabel || !detailLog) return;
  detailLog.innerHTML = "";
  selectedUmbrellaLabel.textContent = selectedUmbrella
    ? `Umbrella ${selectedUmbrella}`
    : "Select an umbrella";

  const entry = selectedUmbrella ? getEntry(selectedDate, selectedUmbrella) : null;
  detailStatus.className = "detail-status";

  if (!entry || entry.status === "released") {
    detailStatus.textContent = "Free";
    detailStatus.classList.add("free");
    detailLog.textContent = "Select a free umbrella to reserve or occupy.";
    reserveForm?.reset();
    return;
  }

  const guestLabel = entry.guestName || "Walk-in";
  detailStatus.textContent = `${entry.status.toUpperCase()} � ${guestLabel}`;
  detailStatus.classList.add(entry.status);

  const badge = getGuestBadge(entry.guestName);
  const history = [];

  if (badge) history.push(`<span class="guest-tag">${badge}</span>`);
  if (entry.phone) history.push(`Phone: ${entry.phone}`);
  if (entry.guestCount) history.push(`Guests: ${entry.guestCount}`);
  if (entry.notes) history.push(`Notes: ${entry.notes}`);
  if (entry.createdAt) {
    history.push(
      `Created by ${resolveName(entry.createdBy)} at ${new Date(entry.createdAt).toLocaleString()}`
    );
  }
  if (entry.occupiedAt) {
    history.push(
      `Occupied by ${resolveName(entry.occupiedBy)} at ${new Date(entry.occupiedAt).toLocaleString()}`
    );
  }

  detailLog.innerHTML = history.map((line) => `<div>${line}</div>`).join("");

  if (reserveForm) {
    reserveForm.querySelector('[name="guestName"]').value = entry.guestName || "";
    reserveForm.querySelector('[name="phone"]').value = entry.phone || "";
    reserveForm.querySelector('[name="guestCount"]').value = entry.guestCount || "";
    reserveForm.querySelector('[name="notes"]').value = entry.notes || "";
  }

  pulseElement(detailStatus);
}

function renderStaffTotals() {
  if (!staffTotalsEl) return;
  const totals = {};

  reservations.forEach((entry) => {
    if (entry.status !== "occupied") return;

    const owner = entry.occupiedBy || entry.createdBy;
    if (!owner) return;

    if (!totals[owner]) {
      totals[owner] = { occupied: 0, revenue: 0 };
    }

    totals[owner].occupied += 1;
    totals[owner].revenue += PRICE_PER_UMBRELLA;
  });

  staffTotalsEl.innerHTML = "";

  const displayUsers = [...userDocs];
  if (currentUser && !displayUsers.find((user) => user.id === currentUser.id)) {
    displayUsers.push(currentUser);
  }

  displayUsers.forEach((user) => {
    const stats = totals[user.id] || { occupied: 0, revenue: 0 };
    const card = document.createElement("div");

    card.className = "list-card";
    card.innerHTML = `<p>${user.name}</p><strong>Occupied: ${stats.occupied}</strong><small>Revenue: ${stats.revenue}</small>`;
    staffTotalsEl.appendChild(card);
  });
}

function renderReport() {
  if (!reportReservedEl || !reportOccupiedEl || !reportRevenueEl || !reportReleasedEl) return;
  const entries = getEntries(selectedDate);
  const reserved = entries.filter((entry) => entry.status === "reserved").length;
  const occupied = entries.filter((entry) => entry.status === "occupied").length;

  reportReservedEl.textContent = reserved;
  reportOccupiedEl.textContent = occupied;
  const reportRevenue = sumRevenue(entries);
  reportRevenueEl.textContent = reportRevenue;
  reportReleasedEl.textContent = auditEvents.filter(
    (event) => event.action === "Release" && event.date === formatDateKey(selectedDate)
  ).length;
}

function renderAuditLog() {
  if (!auditLogEl) return;
  auditLogEl.innerHTML = "";

  if (!currentUser || currentUser.role !== "admin") {
    auditLogEl.innerHTML = '<div class="audit-note">Audit log is visible to admins only.</div>';
    return;
  }

  auditEvents.slice(0, 8).forEach((event) => {
    const item = document.createElement("div");
    item.className = "audit-item";
    item.textContent = `${event.action} � Umbrella ${event.umbrellaNumber} � ${event.userName} � ${event.timestamp}`;
    auditLogEl.appendChild(item);
  });

  pulseElement(auditLogEl.querySelector(".audit-item"));
}

function renderUserList() {
  if (!userListEl) return;
  userListEl.innerHTML = "";

  const displayUsers = [...userDocs];
  if (currentUser && !displayUsers.find((user) => user.id === currentUser.id)) {
    displayUsers.push(currentUser);
  }

  displayUsers.forEach((user) => {
    const card = document.createElement("div");
    card.className = "list-card";
    card.innerHTML = `<p>${user.name}</p><small>${user.role.toUpperCase()}</small><span>${user.username}</span>`;
    userListEl.appendChild(card);
  });
}

function updateActions() {
  if (!markArrivedBtn || !markOccupiedBtn || !releaseUmbrellaBtn || !deleteEntryBtn) return;
  const entry = selectedUmbrella ? getEntry(selectedDate, selectedUmbrella) : null;
  const activeEntry = entry && entry.status !== "released" ? entry : null;

  if (!currentUser) {
    markArrivedBtn.disabled = true;
    markOccupiedBtn.disabled = true;
    releaseUmbrellaBtn.disabled = true;
    deleteEntryBtn.disabled = true;
    return;
  }

  markArrivedBtn.disabled =
    !activeEntry || activeEntry.status !== "reserved" || !canEdit(activeEntry);

  markOccupiedBtn.disabled = !!(activeEntry && activeEntry.status === "occupied");
  releaseUmbrellaBtn.disabled = !activeEntry || !canEdit(activeEntry);
  deleteEntryBtn.disabled = !activeEntry || !canEdit(activeEntry);
}

function canEdit(entry) {
  if (!currentUser) return false;
  return currentUser.role === "admin" || entry.createdBy === currentUser.id;
}

async function handleReserve(event) {
  event.preventDefault();
  if (!currentUser || !selectedUmbrella) return;

  const existing = getEntry(selectedDate, selectedUmbrella);
  const activeExisting = existing && existing.status !== "released" ? existing : null;

  if (activeExisting && !canEdit(activeExisting)) {
    return alert("Only the creator or admin can edit this reservation.");
  }

  const formData = new FormData(reserveForm);
  const guestName = (formData.get("guestName") || "").trim();
  if (!guestName) return alert("Guest name is required");

  const dateKey = formatDateKey(selectedDate);
  const payload = {
    umbrellaNumber: selectedUmbrella,
    status: "reserved",
    guestName,
    phone: (formData.get("phone") || "").trim(),
    guestCount: (formData.get("guestCount") || "").trim(),
    notes: (formData.get("notes") || "").trim(),
    createdByUid: activeExisting?.createdByUid || activeExisting?.createdBy || currentUser.id,
    amount: 0,
    createdBy: activeExisting?.createdBy || currentUser.id,
    createdAt: activeExisting?.createdAt || new Date().toISOString(),
    date: dateKey,
  };

  const docId = activeExisting?.id || `${dateKey}-${selectedUmbrella}`;
  const docRef = reservationsRef?.doc(docId);

  if (!docRef) return alert("Reservations are not configured.");

  try {
    if (!reservationsRef || !db) throw new Error("Firestore not ready");

    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(docRef);
      const currentStatus = snapshot.exists ? snapshot.data().status : null;

      if (
        currentStatus &&
        isBusyStatus(currentStatus) &&
        (!activeExisting || snapshot.id !== activeExisting.id)
      ) {
        throw new Error("This umbrella is already booked for that date.");
      }

      transaction.set(docRef, payload);
    });

    await audit(activeExisting ? "Update reservation" : "Reserve", payload);
    reserveForm?.reset();
  } catch (error) {
    console.error("Reserve error:", error);
    alert(
      error.message.includes("booked")
        ? "Umbrella already booked for that date. Refresh to see the latest availability."
        : `Could not save reservation: ${error?.message || "unknown error"}`
    );
  }
}
async function handleOccupy(arrived = false) {
  if (!currentUser || !selectedUmbrella) return;

  const entry = getEntry(selectedDate, selectedUmbrella);
  if (entry && entry.status === "occupied") return;

  if (entry && entry.status === "reserved" && !canEdit(entry)) {
    return alert("Only the creator or admin can update this reservation.");
  }

  if (arrived && (!entry || entry.status !== "reserved")) {
    return alert("You can only mark a reservation as arrived.");
  }

  const allowEmptyName = !entry;
  const guestDetails = gatherGuestDetails(entry, allowEmptyName);
  if (!guestDetails) {
    return alert("Guest name is required to mark an umbrella as occupied.");
  }

  const dateKey = formatDateKey(selectedDate);
  const payload = {
    umbrellaNumber: selectedUmbrella,
    status: "occupied",
    ...guestDetails,
    createdByUid: entry?.createdByUid || entry?.createdBy || currentUser.id,
    createdBy: entry?.createdBy || currentUser.id,
    createdAt: entry?.createdAt || new Date().toISOString(),
    occupiedBy: currentUser.id,
    occupiedAt: new Date().toISOString(),
    amount: PRICE_PER_UMBRELLA,
    date: dateKey,
  };

  const docId = entry?.id || `${dateKey}-${selectedUmbrella}`;
  const docRef = reservationsRef?.doc(docId);

  if (!docRef) return alert("Reservations are not configured.");

  try {
    if (!reservationsRef || !db) throw new Error("Firestore not ready");

    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(docRef);
      const currentStatus = snapshot.exists ? snapshot.data().status : null;

      if (arrived && currentStatus !== "reserved") {
        throw new Error("A reservation must be in reserved status before marking arrival.");
      }

      if (!arrived && currentStatus === "occupied") {
        throw new Error("Umbrella is already occupied.");
      }

      transaction.set(docRef, payload);
    });

    await audit(arrived ? "Arrived" : "Occupy", payload);
  } catch (error) {
    console.error("Occupy error:", error);
    alert(
      error.message.includes("already")
        ? "Umbrella already reserved or occupied. Refresh to see the latest availability."
        : `Could not update occupancy: ${error?.message || "unknown error"}`
    );
  }
}

async function handleRelease() {
  if (!currentUser || !selectedUmbrella) return;

  const entry = getEntry(selectedDate, selectedUmbrella);
  if (!entry) return alert("No reservation to release.");
  if (!canEdit(entry)) return alert("Only the creator or admin can release this umbrella.");

  try {
    if (!reservationsRef) throw new Error("Firestore not ready");

    await reservationsRef.doc(entry.id).update({
      status: "released",
      releasedAt: new Date().toISOString(),
      releasedBy: currentUser.id,
    });

    await audit("Release", { ...entry, status: "released" });
    selectedUmbrella = null;
    renderAll();
  } catch (error) {
    console.error("Release error:", error);
    alert(`Could not release umbrella: ${error?.message || "unknown error"}`);
  }
}

async function handleDelete() {
  if (!currentUser || !selectedUmbrella) return;

  const entry = getEntry(selectedDate, selectedUmbrella);
  if (!entry) return alert("No reservation to delete.");
  if (!canEdit(entry)) return alert("Only the creator or admin can delete this entry.");

  try {
    if (!reservationsRef) throw new Error("Firestore not ready");

    await reservationsRef.doc(entry.id).delete();
    await audit("Delete", entry);
    selectedUmbrella = null;
    renderAll();
  } catch (error) {
    console.error("Delete error:", error);
    alert(`Could not delete entry: ${error?.message || "unknown error"}`);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  event.stopPropagation();

  if (!auth) {
    showLoginMessage("Authentication is not available.");
    return false;
  }

  const formData = new FormData(loginForm);
  const email = (formData.get("email") || "").trim();
  const password = (formData.get("password") || "").trim();

  try {
    await auth.signInWithEmailAndPassword(email, password);
    resetLoginMessage();
  } catch (error) {
    console.error(error);
    showLoginMessage("Invalid credentials.");
  }

  return false;
}

async function handleLogout() {
  if (!auth) return;

  stopRealtimeListeners();

  try {
    await auth.signOut();
    resetLoginMessage();
  } catch (error) {
    console.error(error);
  }
}

async function handleUserForm(event) {
  event.preventDefault();

  if (!currentUser || currentUser.role !== "admin" || !usersRef) return;

  const formData = new FormData(userForm);
  const name = (formData.get("name") || "").trim();
  const username = (formData.get("username") || "").trim();
  const authUid = (formData.get("authUid") || "").trim();
  const role = formData.get("role");

  if (!name || !username || !authUid) return;

  const duplicate = userDocs.find((user) => user.username === username);
  if (duplicate) return alert("Username taken");

  try {
    if (!authUid) {
      return alert("Firebase UID is required for linking this profile.");
    }

    const docRef = usersRef.doc(authUid);
    const snapshot = await docRef.get();

    if (snapshot.exists) {
      return alert("A profile already exists for that Firebase UID.");
    }

    await docRef.set({
      name,
      username,
      role,
      authUid,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    });

    userForm.reset();
  } catch (error) {
    console.error(error);
    alert("Could not create user.");
  }
}

function renderAll() {
  renderCalendar();
  renderUmbrellas();
  renderStats();
  renderDetailPanel();
  renderStaffTotals();
  renderReport();
  renderAuditLog();
  renderUserList();
  updateActions();
}

function subscribeReservations() {
  if (!reservationsRef) return;

  reservationsUnsub?.();

  reservationsUnsub = reservationsRef
    .orderBy("date")
    .orderBy("umbrellaNumber")
    .onSnapshot(
      (snapshot) => {
        reservations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        renderAll();
      },
      (error) => handleRealtimeError("reservations", error)
    );
}

function subscribeAuditLog() {
  if (!auditRef) return;

  auditUnsub?.();

  auditUnsub = auditRef
    .orderBy("timestamp", "desc")
    .limit(20)
    .onSnapshot(
      (snapshot) => {
        auditEvents = snapshot.docs.map((doc) => doc.data());
        renderAll();
      },
      (error) => handleRealtimeError("audit log", error)
    );
}

function subscribeUsers() {
  if (!usersRef) return;

  usersUnsub?.();

  usersUnsub = usersRef.onSnapshot(
    (snapshot) => {
      userDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      renderAll();
    },
    (error) => handleRealtimeError("users list", error)
  );
}

function startRealtimeListeners() {
  if (listenersActive) return;

  if (!reservationsRef || !auditRef || !usersRef) {
    showLoginMessage("Firestore is not configured.");
    return;
  }

  listenersActive = true;
  subscribeReservations();
  subscribeAuditLog();
  subscribeUsers();
}

function stopRealtimeListeners() {
  reservationsUnsub?.();
  auditUnsub?.();
  usersUnsub?.();

  reservationsUnsub = null;
  auditUnsub = null;
  usersUnsub = null;
  listenersActive = false;
}

function attachAuthListener() {
  if (authListenerAttached || !auth) {
    if (!auth) showLoginMessage("Authentication is not configured.");
    return;
  }

  authListenerAttached = true;

  auth.onAuthStateChanged(async (user) => {
    stopRealtimeListeners();

    if (!user) {
      currentUser = null;
      if (sessionUser) sessionUser.textContent = "Not logged in";
      loginOverlay?.classList.remove("hidden");
      if (!loginNoticeOverride) resetLoginMessage();
      renderAll();
      return;
    }

    if (!usersRef) {
      showLoginMessage("User data is not available.");
      await auth.signOut();
      return;
    }

    try {
      const docSnapshot = await usersRef.doc(user.uid).get();

      if (!docSnapshot.exists) {
        showLoginMessage("Access denied. Your account is not registered.");
        await auth.signOut();
        return;
      }

      currentUser = { id: docSnapshot.id, ...docSnapshot.data() };
    } catch (error) {
      console.error("Failed to load user profile", error);
      showLoginMessage("Unable to load user profile.");
      await auth.signOut();
      return;
    }

    if (sessionUser) sessionUser.textContent = `${currentUser.name} (${currentUser.role})`;
    loginOverlay?.classList.add("hidden");
    resetLoginMessage();
    startRealtimeListeners();
    renderAll();
  });
}

function init() {
  if (appInitialized) return;
  appInitialized = true;

  if (loginForm) {
    loginForm.setAttribute("action", "javascript:void(0);");
    loginForm.setAttribute("method", "post");
    loginForm.addEventListener("submit", handleLogin);
  }

  logoutBtn?.addEventListener("click", handleLogout);
  reserveForm?.addEventListener("submit", handleReserve);
  markOccupiedBtn?.addEventListener("click", () => handleOccupy(false));
  markArrivedBtn?.addEventListener("click", () => handleOccupy(true));
  releaseUmbrellaBtn?.addEventListener("click", handleRelease);
  deleteEntryBtn?.addEventListener("click", handleDelete);
  todayBtn?.addEventListener("click", () => {
    selectedDate = new Date();
    selectedUmbrella = null;
    updateDisplayedDate();
    renderAll();
  });
  userForm?.addEventListener("submit", handleUserForm);

  if (sessionUser) sessionUser.textContent = "Not logged in";
  resetLoginMessage();
  updateDisplayedDate();
  attachAuthListener();
  renderAll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}



