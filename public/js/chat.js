const socket = io();

const buttonShareLocation = document.querySelector("#location");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar");
const messageTemplate = document.querySelector("#message-template");
const sidebarTemplate = document.querySelector("#sidebar-template");
const form = document.querySelector("#form");

const query = window.location.search;

const params = new URLSearchParams(query);

function pageScroll() {
  let elem = document.getElementById("messages");
  elem.scrollTop = elem.scrollHeight;
}

socket.on("message", ({ text, createdAt, user }) => {
  console.log("From server:", text);
  const html = Mustache.render(messageTemplate.innerHTML, {
    message: text,
    createdAt: moment(createdAt).format("h:mm a"),
    user,
  });
  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", ({ text, createdAt, user }) => {
  // console.log("From server:", url);
  const html = Mustache.render(messageTemplate.innerHTML, {
    url: text,
    createdAt: moment(createdAt).format("h:mm a"),
    user,
  });
  messages.insertAdjacentHTML("beforeend", html);
  pageScroll();
});
socket.on("roomData", ({ users, room }) => {
  console.log(users);
  const html = Mustache.render(sidebarTemplate.innerHTML, {
    room,
    users,
  });
  sidebar.innerHTML = html;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.elements.message;
  const sendButton = e.target.elements.send;
  input.disabled = true;
  sendButton.disabled = true;

  socket.emit("sendMessage", input.value, (msg) => {
    input.value = "";
    if (msg) {
      input.disabled = false;
      input.focus();
      sendButton.disabled = false;

      const html = Mustache.render(messageTemplate.innerHTML, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format("h:mm a"),
        user: msg.user,
      });
      return messages.insertAdjacentHTML("beforeend", html);
    }
    input.disabled = false;
    input.focus();
    sendButton.disabled = false;
    console.log("Message Delivered!");
    pageScroll();
  });
});

buttonShareLocation.addEventListener("click", () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;

    socket.emit(
      "sendLocation",
      { lat: crd.latitude, lon: crd.longitude },
      () => {
        console.log("Location shared!");
      }
    );
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
  buttonShareLocation.disabled = true;
  buttonShareLocation.textContent = "Shared!";
});

socket.emit(
  "join",
  {
    username: params.get("username").toLowerCase().trim(),
    room: params.get("room").toLowerCase().trim(),
  },
  (error) => {
    if (error) {
      window.location.replace("/index.html");
      alert(error);
    }
  }
);
