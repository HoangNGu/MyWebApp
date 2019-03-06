import "./css/main.css";
import * as signalR from "@aspnet/signalr";
const divMessages = document.querySelector("#divMessages");
const divParticpants = document.querySelector("#divUsers");
const tbNickname = document.querySelector("#tbNickname");
const tbMessage = document.querySelector("#tbMessage");
const btnSend = document.querySelector("#btnSend");
var mutedUsers = [];
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();
connection.start().catch(err => document.write(err));
connection.on("messageReceived", (nickname, message) => {
    if (mutedUsers.indexOf(nickname, 0) == -1) {
        let m = document.createElement("div");
        m.innerHTML =
            `<div class=${nickname}.message-author>${nickname + ":"}</div><div class=${nickname}.message-author>${message}</div>`;
        divMessages.appendChild(m);
        divMessages.scrollTop = divMessages.scrollHeight;
    }
});
connection.on("newParticipant", (nickname) => {
    let p = document.createElement("div");
    let m = document.createElement("div");
    p.innerHTML =
        `<label id="lblMessage" for= "btnMute" > ${nickname} </label>      
        <input type="checkbox" id=${nickname}.btnMute > Mute/Unmute </input>`;
    divParticpants.appendChild(p);
    divParticpants.scrollTop = divParticpants.scrollHeight;
    m.innerHTML =
        `<div">${nickname + " has joined the chat!"}</div>`;
    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
    document.getElementById(nickname + ".btnMute").addEventListener("click", function () {
        muteUser(nickname);
    });
});
tbMessage.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        send();
    }
});
btnSend.addEventListener("click", send);
function muteUser(nickname) {
    var checkbox = document.getElementById(nickname + ".btnMute");
    if (checkbox.checked) {
        mutedUsers.push(nickname);
        alert("The user " + nickname + " is now muted");
        let elements = document.getElementsByClassName(nickname + ".message-author");
        for (var i in elements) {
            elements[i].style.display = "none";
        }
    }
    else {
        const index = mutedUsers.indexOf(nickname, 0);
        if (index > -1) {
            mutedUsers.splice(index, 1);
        }
        alert("The user " + nickname + " is now unmuted");
        let elements = document.getElementsByClassName(nickname + ".message-author");
        for (var i in elements) {
            elements[i].style.display = "inline";
        }
    }
}
function send() {
    if (tbNickname.value != "") {
        connection.send("newMessage", tbNickname.value, tbMessage.value)
            .then(() => tbMessage.value = "");
    }
    else {
        let m = document.createElement("div");
        m.innerHTML =
            `<div class="message-error">${"Please enter a Nickname"}</div>`;
        divMessages.appendChild(m);
        divMessages.scrollTop = divMessages.scrollHeight;
    }
}
