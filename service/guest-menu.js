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

const params = new URLSearchParams(window.location.search);
const umbrellaParam = params.get("u");
const umbrellaEl = document.getElementById("umbrellaNumber");
const helperText = document.getElementById("helperText");
const callBtn = document.getElementById("callWaiterBtn");
const messageArea = document.getElementById("messageArea");

const showMessage = (text, variant = "success") => {
  messageArea.textContent = text;
  messageArea.className = `messages message-${variant}`;
};

if (umbrellaParam && !isNaN(Number(umbrellaParam))) {
  const umbrellaNumber = Number(umbrellaParam);
  umbrellaEl.textContent = umbrellaNumber;
  callBtn.disabled = false;

  callBtn.addEventListener("click", async () => {
    const storageKey = `lastCall_${umbrellaNumber}`;
    const lastCall = Number(localStorage.getItem(storageKey) || "0");
    const now = Date.now();

    if (now - lastCall < 12000) {
      showMessage("Waiter already requested moments ago. Please wait a bit.", "error");
      return;
    }

    callBtn.disabled = true;
    showMessage("Sending your request…");
    try {
      await waiterCalls.add({
        umbrella: umbrellaNumber,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        source: "qr",
      });
      localStorage.setItem(storageKey, String(now));
      showMessage(`Waiter requested for Umbrella ${umbrellaNumber}.`);
    } catch (error) {
      console.error(error);
      showMessage("Something went wrong. Please try again in a moment.", "error");
    } finally {
      setTimeout(() => {
        callBtn.disabled = false;
      }, 12000);
    }
  });
} else {
  umbrellaEl.textContent = "—";
  helperText.textContent =
    "Umbrella not identified. Please scan the QR code on your umbrella again.";
  showMessage("Umbrella missing. Scan the QR code again.", "error");
}
