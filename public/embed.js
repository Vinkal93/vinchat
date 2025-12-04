// Embeddable Chatbot Widget
// Add this script to any website: <script src="YOUR_DOMAIN/embed.js" data-bot-id="BOT_ID"></script>

(function() {
  'use strict';

  // Get configuration from script tag
  const script = document.currentScript;
  const botId = script?.getAttribute('data-bot-id');
  const position = script?.getAttribute('data-position') || 'bottom-right';
  const primaryColor = script?.getAttribute('data-color') || '#6366f1';

  if (!botId) {
    console.error('Chatbot Widget: data-bot-id is required');
    return;
  }

  // Create styles
  const styles = document.createElement('style');
  styles.textContent = `
    .chatbot-widget-container {
      position: fixed;
      ${position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      ${position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }

    .chatbot-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${primaryColor}, #14b8a6);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .chatbot-toggle-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
    }

    .chatbot-toggle-btn svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    .chatbot-window {
      position: absolute;
      ${position.includes('right') ? 'right: 0;' : 'left: 0;'}
      bottom: 70px;
      width: 380px;
      height: 520px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: chatbot-slide-up 0.3s ease;
    }

    .chatbot-window.open {
      display: flex;
    }

    @keyframes chatbot-slide-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .chatbot-header {
      background: linear-gradient(135deg, ${primaryColor}, #14b8a6);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chatbot-header-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chatbot-header-avatar svg {
      width: 24px;
      height: 24px;
      fill: white;
    }

    .chatbot-header-info h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .chatbot-header-info p {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }

    .chatbot-close-btn {
      margin-left: auto;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .chatbot-close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .chatbot-close-btn svg {
      width: 18px;
      height: 18px;
      fill: white;
    }

    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chatbot-message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
    }

    .chatbot-message.user {
      background: ${primaryColor};
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .chatbot-message.bot {
      background: #f3f4f6;
      color: #1f2937;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }

    .chatbot-message.typing {
      display: flex;
      gap: 4px;
      padding: 16px;
    }

    .chatbot-message.typing span {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      animation: chatbot-bounce 1.4s infinite ease-in-out;
    }

    .chatbot-message.typing span:nth-child(1) { animation-delay: 0s; }
    .chatbot-message.typing span:nth-child(2) { animation-delay: 0.2s; }
    .chatbot-message.typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes chatbot-bounce {
      0%, 80%, 100% { transform: scale(0.8); }
      40% { transform: scale(1.2); }
    }

    .chatbot-input-area {
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }

    .chatbot-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .chatbot-input:focus {
      border-color: ${primaryColor};
    }

    .chatbot-send-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: ${primaryColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .chatbot-send-btn:hover {
      background: ${primaryColor}dd;
    }

    .chatbot-send-btn:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .chatbot-send-btn svg {
      width: 20px;
      height: 20px;
      fill: white;
    }

    .chatbot-powered-by {
      text-align: center;
      padding: 8px;
      font-size: 11px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }

    .chatbot-powered-by a {
      color: ${primaryColor};
      text-decoration: none;
    }

    @media (max-width: 480px) {
      .chatbot-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px);
        max-height: 600px;
      }
    }
  `;
  document.head.appendChild(styles);

  // Create widget HTML
  const container = document.createElement('div');
  container.className = 'chatbot-widget-container';
  container.innerHTML = `
    <div class="chatbot-window" id="chatbot-window-${botId}">
      <div class="chatbot-header">
        <div class="chatbot-header-avatar">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
        <div class="chatbot-header-info">
          <h3>AI Assistant</h3>
          <p>Online • Ready to help</p>
        </div>
        <button class="chatbot-close-btn" id="chatbot-close-${botId}">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <div class="chatbot-messages" id="chatbot-messages-${botId}">
        <div class="chatbot-message bot">Hello! 👋 How can I help you today?</div>
      </div>
      <div class="chatbot-input-area">
        <input type="text" class="chatbot-input" id="chatbot-input-${botId}" placeholder="Type your message...">
        <button class="chatbot-send-btn" id="chatbot-send-${botId}">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="chatbot-powered-by">
        Powered by <a href="${window.location.origin}" target="_blank">ChatBot Builder</a>
      </div>
    </div>
    <button class="chatbot-toggle-btn" id="chatbot-toggle-${botId}">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
    </button>
  `;
  document.body.appendChild(container);

  // Get elements
  const toggleBtn = document.getElementById(`chatbot-toggle-${botId}`);
  const closeBtn = document.getElementById(`chatbot-close-${botId}`);
  const chatWindow = document.getElementById(`chatbot-window-${botId}`);
  const messagesContainer = document.getElementById(`chatbot-messages-${botId}`);
  const input = document.getElementById(`chatbot-input-${botId}`);
  const sendBtn = document.getElementById(`chatbot-send-${botId}`);

  let isOpen = false;

  // Toggle chat window
  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWindow.classList.toggle('open', isOpen);
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    chatWindow.classList.remove('open');
  });

  // Add message to chat
  function addMessage(content, isUser) {
    const message = document.createElement('div');
    message.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
    message.textContent = content;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show typing indicator
  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chatbot-message bot typing';
    typing.id = `chatbot-typing-${botId}`;
    typing.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hide typing indicator
  function hideTyping() {
    const typing = document.getElementById(`chatbot-typing-${botId}`);
    if (typing) typing.remove();
  }

  // Send message
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = '';
    sendBtn.disabled = true;

    showTyping();

    // Simulate response (in production, this would call your API)
    setTimeout(() => {
      hideTyping();
      const responses = [
        "Thank you for your message! I'm here to help.",
        "That's a great question! Let me find that information for you.",
        "I understand. Based on our knowledge base, here's what I found...",
        "I'd be happy to assist you with that!",
        "Let me look into that for you."
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage(response, false);
      sendBtn.disabled = false;
    }, 1000 + Math.random() * 1000);
  }

  // Event listeners
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
