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
const callsQuery = db
  .collection("waiter_calls")
  .where("status", "in", ["pending", "seen"])
  .orderBy("createdAt", "desc");
const ordersQuery = db
  .collection("orders")
  .where("status", "in", ["pending", "seen"])
  .orderBy("createdAt", "desc");

const callsContainer = document.getElementById("callsList");
const ordersContainer = document.getElementById("ordersList");

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Time unavailable";
  const date = timestamp.toDate ? timestamp.toDate() : timestamp;
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(date);
};

const createCallCard = (doc) => {
  const data = doc.data();
  const status = (data.status || "pending").toLowerCase();
  const card = document.createElement("article");
  card.className = "call-card";

  const info = document.createElement("div");
  info.className = "call-info";
  const umbrella = document.createElement("strong");
  umbrella.textContent = `Umbrella ${data.umbrella ?? "—"}`;
  const time = document.createElement("span");
  time.textContent = formatTimestamp(data.createdAt);
  const badge = document.createElement("span");
  badge.className = `status-pill status-${status}`;
  badge.textContent = status;
  info.append(umbrella, time, badge);

  const actions = document.createElement("div");
  actions.className = "call-actions";
  const seenBtn = document.createElement("button");
  seenBtn.textContent = "Seen";
  seenBtn.disabled = status === "seen";
  seenBtn.addEventListener("click", async () => {
    try {
      await db.collection("waiter_calls").doc(doc.id).update({ status: "seen" });
    } catch (error) {
      console.error("Error marking seen:", error);
    }
  });
  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.addEventListener("click", async () => {
    try {
      await db.collection("waiter_calls").doc(doc.id).update({ status: "done" });
    } catch (error) {
      console.error("Error completing call:", error);
    }
  });
  actions.append(seenBtn, doneBtn);

  card.append(info, actions);
  return card;
};

const renderCalls = (docs, container) => {
  if (!docs.length) {
    container.innerHTML = '<p class="placeholder">No current requests.</p>';
    return;
  }
  container.innerHTML = "";
  docs.forEach((doc) => {
    container.appendChild(createCallCard(doc));
  });
};

const renderOrders = (docs) => {
  if (!docs.length) {
    ordersContainer.innerHTML = '<p class="placeholder">No active orders.</p>';
    return;
  }
  ordersContainer.innerHTML = "";
  docs.forEach((doc) => {
    const data = doc.data();
    const status = (data.status || "pending").toLowerCase();
    const card = document.createElement("article");
    card.className = "call-card";

    const info = document.createElement("div");
    info.className = "call-info";
    const umbrella = document.createElement("strong");
    umbrella.textContent = `Umbrella ${data.umbrella ?? "—"}`;
    const time = document.createElement("span");
    time.textContent = formatTimestamp(data.createdAt);
    const badge = document.createElement("span");
    badge.className = `status-pill status-${status}`;
    badge.textContent = status;
    info.append(umbrella, time, badge);

    const itemsList = document.createElement("div");
    itemsList.className = "order-items";
    (data.items || []).forEach((item) => {
      const line = document.createElement("span");
      line.textContent = `${item.name} x${item.qty}`;
      itemsList.appendChild(line);
    });

    const note = document.createElement("p");
    note.className = "order-note";
    note.textContent = data.note ? `Note: ${data.note}` : "";

    const totalRow = document.createElement("p");
    totalRow.className = "total-row";
    totalRow.textContent = `Total: ${data.total || 0} LEK`;

    const actions = document.createElement("div");
    actions.className = "call-actions";
    const seenBtn = document.createElement("button");
    seenBtn.textContent = "Seen";
    seenBtn.disabled = status === "seen";
    seenBtn.addEventListener("click", async () => {
      try {
        await db.collection("orders").doc(doc.id).update({ status: "seen" });
      } catch (error) {
        console.error("Error marking order seen:", error);
      }
    });
    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.addEventListener("click", async () => {
      try {
        await db.collection("orders").doc(doc.id).update({ status: "done" });
      } catch (error) {
        console.error("Error completing order:", error);
      }
    });
    actions.append(seenBtn, doneBtn);

    card.append(info, itemsList, note, totalRow, actions);
    ordersContainer.appendChild(card);
  });
};

callsQuery.onSnapshot(
  (snapshot) => renderCalls(snapshot.docs, callsContainer),
  (error) => {
    console.error("Realtime listener failed:", error);
    callsContainer.innerHTML = '<p class="placeholder">Unable to load calls.</p>';
  }
);

ordersQuery.onSnapshot(
  (snapshot) => renderOrders(snapshot.docs),
  (error) => {
    console.error("Realtime listener failed:", error);
    ordersContainer.innerHTML = '<p class="placeholder">Unable to load orders.</p>';
  }
);
