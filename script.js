// Default pre-loaded contacts like WhatsApp
const defaultContacts = [
  { name: 'Rahul', phone: '+91 98765 43210', lastMsg: 'Hey there! Using ChinevaChat', time: '10:30 AM' },
  { name: 'Alex', phone: '+91 87654 32109', lastMsg: 'See you tomorrow 👍', time: '9:15 AM' },
  { name: 'Sumit', phone: '+91 76543 21098', lastMsg: 'Photo 📷', time: 'Yesterday' }
];

window.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('chineva_user');
  
  // Initialize default chats if not present
  if (!localStorage.getItem('chineva_chats')) {
    localStorage.setItem('chineva_chats', JSON.stringify(defaultContacts));
  }

  if (savedUser) {
    showScreen('homeScreen');
    loadChats();
  } else {
    showScreen('loginScreen');
  }
});

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('action') || document.getElementById(screenId).classList.add('active');
}

// Tab Switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    const tabName = tab.getAttribute('data-tab');
    document.getElementById(tabName + 'Tab').classList.add('active');
  });
});

// Login
document.getElementById('loginBtn').addEventListener('click', () => {
  const phone = document.getElementById('phoneNumber').value;
  if (phone.length >= 10) {
    localStorage.setItem('chineva_user', phone);
    showScreen('homeScreen');
    loadChats();
  } else {
    alert('Please enter a valid 10-digit mobile number');
  }
});

// Open Contact List Screen when clicking Floating Chat Button (Instead of pop-up)
document.getElementById('newChatBtn').addEventListener('click', () => {
  showScreen('contactScreen');
  loadContactScreen();
});

document.getElementById('backToHomeBtn').addEventListener('click', () => {
  showScreen('homeScreen');
  loadChats();
});

function loadContactScreen() {
  const list = document.getElementById('allContactsList');
  let contacts = JSON.parse(localStorage.getItem('chineva_chats') || '[]');
  
  list.innerHTML = '';
  contacts.forEach(contact => {
    const initial = contact.name.charAt(0).toUpperCase();
    list.innerHTML += `
      <div class="chat-item" onclick="startChatFromContact('${contact.name}', '${contact.phone}')">
        <div class="avatar">${initial}</div>
        <div class="chat-details">
          <div class="chat-header-row">
            <h4>${contact.name}</h4>
          </div>
          <p>${contact.phone}</p>
        </div>
      </div>
    `;
  });
}

function startChatFromContact(name, phone) {
  openChat(name);
}

// Load Chats on Home Screen
function loadChats() {
  const chatList = document.getElementById('chatList');
  let chats = JSON.parse(localStorage.getItem('chineva_chats') || '[]');

  chatList.innerHTML = '';
  chats.forEach((chat) => {
    const initial = chat.name.charAt(0).toUpperCase();
    chatList.innerHTML += `
      <div class="chat-item" onclick="openChat('${chat.name}')">
        <div class="avatar">${initial}</div>
        <div class="chat-details">
          <div class="chat-header-row">
            <h4>${chat.name}</h4>
            <span>${chat.time || ''}</span>
          </div>
          <p>${chat.lastMsg || 'Tap to chat'}</p>
        </div>
      </div>
    `;
  });
}

let currentChatUser = '';
function openChat(name) {
  currentChatUser = name;
  document.getElementById('activeChatName').innerText = name;
  document.getElementById('activeAvatar').innerText = name.charAt(0).toUpperCase();
  showScreen('chatScreen');
  loadMessages(name);
}

document.getElementById('backBtn').addEventListener('click', () => {
  showScreen('homeScreen');
  loadChats();
});

// Send Message with Double Ticks
document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let messages = JSON.parse(localStorage.getItem(`msgs_${currentChatUser}`) || '[]');
  messages.push({ text, time: timeStr, sender: 'sent' });
  localStorage.setItem(`msgs_${currentChatUser}`, JSON.stringify(messages));

  let chats = JSON.parse(localStorage.getItem('chineva_chats') || '[]');
  chats = chats.map(c => c.name === currentChatUser ? { ...c, lastMsg: text, time: timeStr } : c);
  localStorage.setItem('chineva_chats', JSON.stringify(chats));

  input.value = '';
  loadMessages(currentChatUser);
}

function loadMessages(name) {
  const container = document.getElementById('messagesContainer');
  let messages = JSON.parse(localStorage.getItem(`msgs_${name}`) || '[]');

  container.innerHTML = '';
  messages.forEach(msg => {
    container.innerHTML += `
      <div class="message ${msg.sender}">
        ${msg.text}
        <span class="msg-time">${msg.time} <span class="ticks">✓✓</span></span>
      </div>
    `;
  });
  container.scrollTop = container.scrollHeight;
}