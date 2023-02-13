const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const peopleCount = document.getElementById("people-count");
const gameBtn = document.querySelector(".game-btn");

// get username and room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
  outputNum(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  render(message);

  //   scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.msg.value;

  socket.emit("chatMessage", message);

  //   clear message
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output message to dom
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function render(message) {
  gameBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`;
    document.querySelector(".chat-messages").appendChild(div);
  });
}

// add rooom name to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to dom
function outputUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}

function outputNum(users) {
  peopleCount.innerHTML = `${
    users.map((user) => `<li> ${user.username}</li>`).length
  }`;
}
