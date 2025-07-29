(function() {
  // ===== PERSONALIZACIÓN RÁPIDA =====
  const CHATBOT_LOGO = "https://www.svgrepo.com/show/339963/chat-bot.svg";
  const CHATBOT_TITLE = "nocodecreative.io";
  const PRIMARY_COLOR = "#854fff";
  const DARK_MODE = false; // true = oscuro, false = claro
  const WEBHOOK_URL = "https://TU_WEBHOOK_N8N.com/webhook/ejemplo";
  // ===================================

  // ESTILOS ULTRA MINIMALISTAS
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --chatbot-primary: ${PRIMARY_COLOR};
      --chatbot-bg: ${DARK_MODE ? "#191724" : "#fff"};
      --chatbot-msg-bg: ${DARK_MODE ? "#232136" : "#f4f3fc"};
      --chatbot-bot-text: ${DARK_MODE ? "#fff" : "#5936b4"};
      --chatbot-user-bg: ${DARK_MODE ? "#353144" : PRIMARY_COLOR};
      --chatbot-user-text: #fff;
      --chatbot-header-bg: var(--chatbot-primary);
      --chatbot-header-text: #fff;
      --chatbot-border-radius: 32px;
      --chatbot-shadow: 0 8px 38px rgba(60,30,90,0.18);
      --chatbot-msg-radius: 20px;
    }
    #cbw-fab {
      position: fixed; bottom: 36px; right: 36px; z-index: 100000;
      background: var(--chatbot-primary); width: 72px; height: 72px;
      border-radius: 50%; box-shadow: var(--chatbot-shadow);
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      border: none; transition: box-shadow 0.15s, background 0.15s;
    }
    #cbw-fab img { width: 40px; height: 40px; object-fit: cover; border-radius: 12px; background: #fff; }
    #cbw-window {
      display: none; position: fixed; bottom: 120px; right: 44px; width: 420px; max-width: 99vw;
      max-height: 75vh; z-index: 100001; background: var(--chatbot-bg);
      border-radius: var(--chatbot-border-radius);
      box-shadow: var(--chatbot-shadow); overflow: hidden;
      font-family: 'Inter', Arial, sans-serif;
      animation: cbwOpen 0.23s;
      flex-direction: column;
    }
    @keyframes cbwOpen { from{transform:scale(.95);opacity:.5} to{transform:scale(1);opacity:1} }
    #cbw-header {
      background: var(--chatbot-header-bg); color: var(--chatbot-header-text);
      padding: 22px 32px 16px 28px; display: flex; align-items: center; gap: 15px;
      border-top-left-radius: var(--chatbot-border-radius);
      border-top-right-radius: var(--chatbot-border-radius);
      font-size: 1.14em; font-weight: 700; letter-spacing: 0.01em;
    }
    #cbw-header img { width: 34px; height: 34px; border-radius: 9px; object-fit: cover; background: #fff; border: 2px solid #fff; }
    #cbw-header .cbw-title { flex:1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #cbw-header .cbw-close { font-size: 26px; cursor: pointer; opacity: .9; font-weight: 700; margin-left: 8px; line-height: 0.9; }
    #cbw-messages {
      flex: 1; padding: 22px 20px 10px 20px; background: var(--chatbot-bg);
      overflow-y: auto; display: flex; flex-direction: column; gap: 12px; min-height: 120px; max-height: 370px;
    }
    .cbw-msg {
      max-width: 92%; padding: 15px 20px; font-size: 1.08em;
      border-radius: var(--chatbot-msg-radius);
      margin-bottom: 2px; word-break: break-word; box-sizing: border-box;
      transition: background 0.15s;
    }
    .cbw-msg.bot {
      align-self: flex-start; background: var(--chatbot-msg-bg); color: var(--chatbot-bot-text);
      border-bottom-left-radius: 8px;
    }
    .cbw-msg.user {
      align-self: flex-end; background: var(--chatbot-user-bg); color: var(--chatbot-user-text);
      border-bottom-right-radius: 8px;
    }
    #cbw-form {
      display: flex; gap: 10px; border-top: none; background: var(--chatbot-bg);
      padding: 18px 18px 18px 18px;
      border-bottom-left-radius: var(--chatbot-border-radius);
      border-bottom-right-radius: var(--chatbot-border-radius);
    }
    #cbw-input {
      flex: 1; border: none; border-radius: 13px;
      padding: 15px 15px; font-size: 1.1em; background: var(--chatbot-msg-bg);
      color: var(--chatbot-bot-text); outline: none;
      transition: background 0.15s;
    }
    #cbw-send {
      background: var(--chatbot-primary); color: #fff; border: none; border-radius: 10px;
      font-size: 1.14em; padding: 0 22px; cursor: pointer; font-weight: 600;
      transition: background 0.14s;
    }
    #cbw-send:active { background: #5d2ba8; }
    @media (max-width: 600px) {
      #cbw-window { width: 100vw !important; right:0 !important; left:0 !important; border-radius: 0 !important; }
    }
  `;
  document.head.appendChild(style);

  // FAB BUTTON
  const fab = document.createElement('button');
  fab.id = "cbw-fab";
  fab.ariaLabel = "Abrir chat";
  fab.innerHTML = `<img src="${CHATBOT_LOGO}" alt="Logo">`;
  document.body.appendChild(fab);

  // WINDOW
  const windowEl = document.createElement('div');
  windowEl.id = "cbw-window";
  windowEl.innerHTML = `
    <div id="cbw-header">
      <img src="${CHATBOT_LOGO}" alt="Logo">
      <span class="cbw-title">${CHATBOT_TITLE}</span>
      <span class="cbw-close" id="cbw-close-btn">&times;</span>
    </div>
    <div id="cbw-messages">
      <div class="cbw-msg bot">
        ¡Hola! ¿Cómo puedo ayudarte hoy?<br>
        Si tienes alguna pregunta sobre nuestros servicios, ¡escríbeme aquí!
      </div>
    </div>
    <form id="cbw-form" autocomplete="off">
      <input id="cbw-input" type="text" maxlength="250" placeholder="Escribe tu mensaje aquí..." required>
      <button id="cbw-send" type="submit">Enviar</button>
    </form>
  `;
  document.body.appendChild(windowEl);

  // FAB abre/cierra (toggle)
  function toggleChat() {
    if (windowEl.style.display === "flex") {
      windowEl.style.display = "none";
    } else {
      windowEl.style.display = "flex";
    }
  }
  fab.onclick = toggleChat;
  windowEl.querySelector("#cbw-close-btn").onclick = toggleChat;

  // LÓGICA DE CHAT
  const form = windowEl.querySelector('#cbw-form');
  const input = windowEl.querySelector('#cbw-input');
  const messages = windowEl.querySelector('#cbw-messages');
  function appendMsg(txt, who="bot") {
    const div = document.createElement('div');
    div.className = "cbw-msg " + who;
    div.innerText = txt;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  form.onsubmit = async e => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    appendMsg(msg, "user");
    input.value = "";
    appendMsg("...", "bot");
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: msg })
      });
      const data = await res.json();
      messages.removeChild(messages.lastChild);
      appendMsg(data.respuesta || "Lo siento, no entendí la respuesta.", "bot");
    } catch {
      messages.removeChild(messages.lastChild);
      appendMsg("Ha ocurrido un error. Inténtalo más tarde.", "bot");
    }
  };

  // Cambia theme dinámicamente desde fuera (opcional)
  window.ChatbotWidgetTheme = function({ dark = null, color = null }) {
    if (dark !== null) {
      document.documentElement.style.setProperty('--chatbot-bg', dark ? "#191724" : "#fff");
      document.documentElement.style.setProperty('--chatbot-msg-bg', dark ? "#232136" : "#f4f3fc");
      document.documentElement.style.setProperty('--chatbot-bot-text', dark ? "#fff" : "#5936b4");
      document.documentElement.style.setProperty('--chatbot-user-bg', dark ? "#353144" : PRIMARY_COLOR);
    }
    if (color) {
      document.documentElement.style.setProperty('--chatbot-primary', color);
      document.documentElement.style.setProperty('--chatbot-header-bg', color);
      document.documentElement.style.setProperty('--chatbot-user-bg', color);
      document.getElementById('cbw-fab').style.background = color;
      document.getElementById('cbw-send').style.background = color;
    }
  };

})();
