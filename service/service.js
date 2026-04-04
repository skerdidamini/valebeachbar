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
const callsRef = db
  .collection("waiter_calls")
  .where("status", "in", ["pending", "seen"])
  .orderBy("createdAt", "desc");
const container = document.getElementById("callsList");

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

const renderCalls = (docs) => {
  if (!docs.length) {
    container.innerHTML = '<p class="placeholder">No current requests.</p>';
    return;
  }

  container.innerHTML = "";
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

    const statusBadge = document.createElement("span");
    statusBadge.className = `status-pill status-${status}`;
    statusBadge.textContent = status;

    info.appendChild(umbrella);
    info.appendChild(time);
    info.appendChild(statusBadge);

    const controls = document.createElement("div");
    controls.className = "call-actions";

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

    controls.appendChild(seenBtn);
    controls.appendChild(doneBtn);

    card.appendChild(info);
    card.appendChild(controls);
    container.appendChild(card);
  });
};

callsRef.onSnapshot(
  (snapshot) => {
    const docs = snapshot.docs;
    renderCalls(docs);
  },
  (error) => {
    console.error("Realtime listener failed:", error);
    container.innerHTML =
      '<p class="placeholder">Unable to load calls. Check connectivity.</p>';
  }
);
