// Firebase Configuration (Public Demo Realtime Database)
const firebaseConfig = {
    databaseURL: "https://chinevachat-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

let currentUser = "";
let currentRoom = "";

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-chat-btn");
    const sendBtn = document.getElementById("send-btn");
    const msgInput = document.getElementById("message-input");
    const logoutBtn = document.getElementById("logout-btn");

    startBtn.onclick = () => {
        const username = document.getElementById("username-input").value.trim();
        const room = document.getElementById("room-input").value.trim() || "main-room";

        if (!username) {
            alert("Kripya apna naam bharein!");
            return;
        }

        currentUser = username;
        currentRoom = room;

        document.getElementById("my-display-name").innerText = `User: ${currentUser}`;
        document.getElementById("room-display-name").innerText = `Room: ${currentRoom}`;
        document.getElementById("chat-avatar").src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(currentUser)}`;

        document.getElementById("login-screen").classList.remove("active");
        document.getElementById("chat-screen").classList.add("active");

        listenForMessages();
    };

    sendBtn.onclick = () => {
        const text = msgInput.value.trim();
        if (text !== "") {
            sendMessage(text);
            msgInput.value = "";
        }
    };

    msgInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendBtn.click();
        }
    });

    logoutBtn.onclick = () => {
        location.reload();
    };
});

// Send Message to Firebase Realtime Database
function sendMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgData = {
        sender: currentUser,
        text: text,
        time: time,
        timestamp: Date.now()
    };

    db.ref("rooms/" + currentRoom).push(msgData);
}

// Listen for Realtime Messages from Firebase
function listenForMessages() {
    const chatBody = document.getElementById("chat-body");
    chatBody.innerHTML = "";

    db.ref("rooms/" + currentRoom).on("child_added", (snapshot) => {
        const data = snapshot.val();
        renderMessage(data);
    });
}

// Render Message
function renderMessage(data) {
    const chatBody = document.getElementById("chat-body");
    const msgDiv = document.createElement("div");
    
    const isMe = data.sender === currentUser;
    msgDiv.className = `msg ${isMe ? 'sent' : 'received'}`;

    msgDiv.innerHTML = `
        <span class="sender-name">${data.sender}</span>
        ${data.text}
        <span class="msg-meta">${data.time} ${isMe ? '✓✓' : ''}</span>
    `;

    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}
