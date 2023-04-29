const socket = io();

let localUsername;

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresa tu nombre de usuario",
  inputValidator: (value) => {
    return !value && "Es obligatorio instroducir un nombre de usuario";
  },
  allowOutsideClick: false,
}).then((result) => {
  username = result.value;
  localUsername = result.value;
  socket.emit("new-user", username);
});

const chatInput = document.getElementById("chat-input");
const messageElement = document.getElementById("messages-panel");

chatInput.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") {
    let messages = "";
    const inputMessage = chatInput.value;
    if (inputMessage.trim().length > 0) {
      //let timestamp = new Date().toISOString();
      socket.emit("chat-message", {
        user: localUsername,
        message: inputMessage,
      });
      messages += `<b>${localUsername}:</b> ${inputMessage}</br>`;
      messageElement.innerHTML = messages;
    }
    chatInput.value = "";
  }
});
