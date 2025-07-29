(function() {
  // === CONFIGURACIÓN PERSONALIZABLE ===
  const CHATBOT_LOGO = "https://www.svgrepo.com/show/339963/chat-bot.svg"; // Cambia la URL por tu logo si quieres
  const CHATBOT_TITLE = "nocodecreative.io"; // Nombre que aparece en el header
  const PRIMARY_COLOR = "#854fff"; // Color principal (lila)
  const WEBHOOK_URL = "https://TU_WEBHOOK_N8N.com/webhook/ejemplo"; // Pon aquí tu webhook n8n
  // ================================

  // INYECTAR ESTILOS
  const style = document.createElement('style');
  style.textContent = `
    #simple-chatbot-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 100000;
      background: ${PRIMARY_COLOR}; width: 60px; height: 60px;
      border-radius: 50%; box-shadow: 0 4px 24px rgba(60,0,100,0.09);
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      transition: box-shadow 0.2s; border: none;
    }
    #simple-chatbot-btn img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; background: #fff; }
    #simple-chatbot-window {
      display: none; position: fixed; bottom: 100px; right: 30px; width: 360px;
      max-width: 98vw; max-height: 75vh; z-index: 100001; background: #fff;
      border-radius: 20px; box-shadow: 0 8px 38px rgba(80,50,120,0.17);
      border: 1.5px solid #eee; flex-direction: column; overflow: hidden;
      font-family: 'Inter', Arial, sans-serif; transition: box-shadow 0.3s;
      animation: fadeInChat 0.25s;
    }
    @keyframes fadeInChat { from{transform:scale(.96);opacity:.4} to{transform:scale(1);opacity:1} }
    #chatbot-header {
      background: ${PRIMARY_COLOR}; color: #fff; padding: 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1.5px solid #eee;
    }
    #chatbot-header img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; background: #fff; border: 2px solid #fff; }
    #chatbot-header .close { margin-left: auto; font-size: 20px; cursor: pointer; opacity: .8; font-weight: bold; }
    #chatbot-messages {
      flex: 1; padding: 16px 14px 8px 14px; background: #f7f6fc; overflow-y: auto;
      min-height: 120px; max-height: 280px; display: flex; flex-direction: column; gap: 10px;
    }
    .msg { max-width: 82%; padding: 10px 13px; font-size: 15px; border-radius: 15px 15px 15px 6px; margin-bottom: 2px; box-sizing: border-box; word-break: break-word; }
    .msg.bot { align-self: flex-start; background: #ede5fa; color: #441e87; border-radius: 14px 14px 7px 16px; }
    .msg.user { align-self: flex-end; background: ${PRIMARY_COLOR}; color: #fff; border-radius: 12px 16px 12px 4px; }
    #chatbot-form { display: flex; gap: 8px; border-top: 1.5px solid #ececec; background: #fff; padding: 10px; }
    #chatbot-input { flex: 1; border: none; border-radius: 8px; padding: 9px 12px; font-size: 15px; background: #f6f6fc; color: #181818; outline: none; }
    #chatbot-send { background: ${PRIMARY_COLOR}; color: #fff; border: none; border-radius: 7px; font-size: 16px; padding: 0 16px; cursor: pointer; font-weight: 600; transition: background 0.15s; }
    #chatbot-send:active { background: #5d2ba8; }
    @media (max-width: 500px) {
      #simple-chatbot-window { width: 99vw; right:0; left:0; bottom: 0; border-radius: 0; }
    }
  `;
  document.head.appendChild(style);

  // CREA BOTÓN DE CHAT
  const btn = document.createElement('button');
  btn.id = "simple-chatbot-btn";
  btn.ariaLabel = "Abrir chat";
  btn.innerHTML = `<img src="${CHATBOT_LOGO}" alt="Logo" id="chatbot-fab-logo">`;
  document.body.appendChild(btn);

  // CREA VENTANA DEL CHAT
  const windowEl = document.createElement('div');
  windowEl.id = "simple-chatbot-window";
  windowEl.innerHTML = `
    <div id="chatbot-header">
      <img src="${CHATBOT_LOGO}" alt="Logo" id="chatbot-header-logo">
      <span id="chatbot-header-title">${CHATBOT_TITLE}</span>
      <span class="close" id="chatbot-close-btn">&times;</span>
    </div>
    <div id="chatbot-messages">
      <div class="msg bot" id="bot-start">
        ¡Hola! ¿Cómo puedo ayudarte hoy?<br>Si tienes alguna pregunta sobre nuestros servicios, ¡escríbeme aquí!
      </div>
    </div>
    <form id="chatbot-form">
      <input id="chatbot-input" type="text" autocomplete="off" maxlength="250" placeholder="Escribe tu mensaje aquí..." required>
      <button id="chatbot-send" type="submit">Enviar</button>
    </form>
  `;
  document.body.appendChild(windowEl);

  // EVENTOS DE ABRIR/CERRAR
  btn.onclick = () => windowEl.style.display = "flex";
  windowEl.querySelector("#chatbot-close-btn").onclick = () => windowEl.style.display = "none";

  // ENVÍO DE MENSAJES
  const form = windowEl.querySelector('#chatbot-form');
  const input = windowEl.querySelector('#chatbot-input');
  const messages = windowEl.querySelector('#chatbot-messages');
  function appendMsg(txt, who="bot") {
    const div = document.createElement('div');
    div.className = "msg " + who;
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
})();
