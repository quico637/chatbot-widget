(function() {
  // 1. LEE CONFIGURACIÓN DEL USUARIO (window.ChatWidgetConfig)
  const cfg = window.ChatWidgetConfig || {};
  const webhookUrl = cfg.webhook?.url || "";
  const logo = cfg.branding?.logo || "https://www.svgrepo.com/show/339963/chat-bot.svg";
  const botName = cfg.branding?.name || "Chatbot";
  const welcomeText = cfg.branding?.welcomeText || "¡Hola! ¿Cómo puedo ayudarte hoy?";
  const responseTime = cfg.branding?.responseTimeText || "";
  const primaryColor = cfg.style?.primaryColor || "#854fff";
  const secondaryColor = cfg.style?.secondaryColor || "#6b3fd4";
  const bgColor = cfg.style?.backgroundColor || "#fff";
  const fontColor = cfg.style?.fontColor || "#333";
  const darkMode = !!cfg.style?.darkMode;
  const chatWidth = parseInt(cfg.style?.width,10) || 420;
  const chatHeight = parseInt(cfg.style?.height,10) || 600;
  const position = cfg.style?.position === "left" ? "left" : "right";

  // 2. ESTILOS MINIMALISTAS Y PERSONALIZABLES
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --chatbot-primary: ${primaryColor};
      --chatbot-secondary: ${secondaryColor};
      --chatbot-bg: ${bgColor};
      --chatbot-font: ${fontColor};
      --chatbot-bot-bg: ${darkMode ? "#232136" : "#f4f3fc"};
      --chatbot-user-bg: ${darkMode ? "#353144" : primaryColor};
      --chatbot-header-bg: ${primaryColor};
      --chatbot-header-text: #fff;
      --chatbot-msg-radius: 18px;
    }
    #cbw-fab {
      position: fixed; bottom: 36px; ${position}: 36px; z-index: 100000;
      background: var(--chatbot-primary); width: 70px; height: 70px;
      border-radius: 50%; box-shadow: 0 8px 36px rgba(60,30,90,0.13);
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      border: none; transition: box-shadow 0.15s, background 0.15s;
    }
    #cbw-fab img { width: 34px; height: 34px; object-fit: cover; border-radius: 11px; background: #fff; }
    #cbw-window {
      display: none; position: fixed; bottom: 120px; ${position}: 44px;
      width: ${chatWidth}px; max-width: 98vw; height: ${chatHeight}px; max-height: 80vh;
      z-index: 100001; background: var(--chatbot-bg); border-radius: 28px;
      box-shadow: 0 8px 38px rgba(60,30,90,0.17); overflow: hidden;
      font-family: 'Inter', Arial, sans-serif; animation: cbwOpen 0.22s;
      flex-direction: column; color: var(--chatbot-font);
    }
    @keyframes cbwOpen { from{transform:scale(.95);opacity:.5} to{transform:scale(1);opacity:1} }
    #cbw-header {
      background: var(--chatbot-header-bg); color: var(--chatbot-header-text);
      padding: 22px 32px 16px 28px; display: flex; align-items: center; gap: 15px;
      border-top-left-radius: 28px; border-top-right-radius: 28px;
      font-size: 1.13em; font-weight: 700; letter-spacing: 0.01em;
    }
    #cbw-header img { width: 32px; height: 32px; border-radius: 9px; object-fit: cover; background: #fff; border: 2px solid #fff; }
    #cbw-header .cbw-title { flex:1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #cbw-header .cbw-close { font-size: 26px; cursor: pointer; opacity: .95; font-weight: 700; margin-left: 8px; line-height: 0.9; }
    #cbw-messages {
      flex: 1; padding: 22px 20px 10px 20px; background: var(--chatbot-bg);
      overflow-y: auto; display: flex; flex-direction: column; gap: 12px; min-height: 120px;
    }
    .cbw-msg {
      max-width: 90%; padding: 15px 20px; font-size: 1.08em;
      border-radius: var(--chatbot-msg-radius); margin-bottom: 2px; word-break: break-word; box-sizing: border-box;
      transition: background 0.15s;
    }
    .cbw-msg.bot {
      align-self: flex-start; background: var(--chatbot-bot-bg); color: var(--chatbot-font);
      border-bottom-left-radius: 7px;
    }
    .cbw-msg.user {
      align-self: flex-end; background: var(--chatbot-user-bg); color: #fff; border-bottom-right-radius: 8px;
    }
    #cbw-form {
      display: flex; gap: 10px; background: var(--chatbot-bg); padding: 18px 18px 18px 18px;
      border-bottom-left-radius: 28px; border-bottom-right-radius: 28px;
    }
    #cbw-input {
      flex: 1; border: none; border-radius: 13px; padding: 15px 15px;
      font-size: 1.07em; background: var(--chatbot-bot-bg); color: var(--chatbot-font); outline: none;
      transition: background 0.15s;
    }
    #cbw-send {
      background: var(--chatbot-primary); color: #fff; border: none; border-radius: 10px;
      font-size: 1.12em; padding: 0 22px; cursor: pointer; font-weight: 600;
      transition: background 0.14s;
    }
    #cbw-send:active { background: var(--chatbot-secondary); }
    .cbw-response-time {
      color: #868a95; font-size: 0.97em; margin-top: 2px; padding-left: 2px; letter-spacing: 0.02em;
    }
    @media (max-width: 600px) {
      #cbw-window { width: 100vw !important; ${position}:0 !important; left:0 !important; border-radius: 0 !important; }
    }
  `;
  document.head.appendChild(style);

  // 3. FAB
  const fab = document.createElement('button');
  fab.id = "cbw-fab";
  fab.ariaLabel = "Abrir chat";
  fab.innerHTML = `<img src="${logo}" alt="Logo">`;
  document.body.appendChild(fab);

  // 4. VENTANA
  const windowEl = document.createElement('div');
  windowEl.id = "cbw-window";
  windowEl.innerHTML = `
    <div id="cbw-header">
      <img src="${logo}" alt="Logo">
      <span class="cbw-title">${botName}</span>
      <span class="cbw-close" id="cbw-close-btn">&times;</span>
    </div>
    <div id="cbw-messages">
      <div class="cbw-msg bot">${welcomeText}</div>
      ${responseTime ? `<div class="cbw-response-time">${responseTime}</div>` : ""}
    </div>
    <form id="cbw-form" autocomplete="off">
      <input id="cbw-input" type="text" maxlength="250" placeholder="Escribe tu mensaje aquí..." required>
      <button id="cbw-send" type="submit">Enviar</button>
    </form>
  `;
  document.body.appendChild(windowEl);

  // 5. FAB abre/cierra (toggle)
  function toggleChat() {
    windowEl.style.display = (windowEl.style.display === "flex" ? "none" : "flex");
  }
  fab.onclick = toggleChat;
  windowEl.querySelector("#cbw-close-btn").onclick = toggleChat;

  // 6. LÓGICA DE CHAT
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
      const res = await fetch(webhookUrl, {
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

})();
