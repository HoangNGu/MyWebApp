"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./css/main.css");
var signalR = require("@aspnet/signalr");
var divMessages = document.querySelector("#divMessages");
var divParticpants = document.querySelector("#divUsers");
var tbNickname = document.querySelector("#tbNickname");
var tbMessage = document.querySelector("#tbMessage");
var btnSend = document.querySelector("#btnSend");
var mutedUsers = [];
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();
connection.start().catch(function (err) { return document.write(err); });
connection.on("messageReceived", function (nickname, message) {
    if (mutedUsers.indexOf(nickname, 0) == -1) {
        var m = document.createElement("div");
        m.innerHTML =
            "<div class=" + nickname + ".message-author>" + (nickname + ":") + "</div><div class=" + nickname + ".message-author>" + message + "</div>";
        divMessages.appendChild(m);
        divMessages.scrollTop = divMessages.scrollHeight;
    }
});
connection.on("newParticipant", function (nickname) {
    var p = document.createElement("div");
    var m = document.createElement("div");
    p.innerHTML =
        "<label id=\"lblMessage\" for= \"btnMute\" > " + nickname + " </label>      \n        <input type=\"checkbox\" id=" + nickname + ".btnMute > Mute/Unmute </input>";
    divParticpants.appendChild(p);
    divParticpants.scrollTop = divParticpants.scrollHeight;
    m.innerHTML =
        "<div\">" + (nickname + " has joined the chat!") + "</div>";
    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
    document.getElementById(nickname + ".btnMute").addEventListener("click", function () {
        muteUser(nickname);
    });
});
tbMessage.addEventListener("keyup", function (e) {
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
        var elements = document.getElementsByClassName(nickname + ".message-author");
        for (var i in elements) {
            elements[i].style.display = "none";
        }
    }
    else {
        var index = mutedUsers.indexOf(nickname, 0);
        if (index > -1) {
            mutedUsers.splice(index, 1);
        }
        alert("The user " + nickname + " is now unmuted");
        var elements = document.getElementsByClassName(nickname + ".message-author");
        for (var i in elements) {
            elements[i].style.display = "inline";
        }
    }
}
function send() {
    if (tbNickname.value != "") {
        connection.send("newMessage", tbNickname.value, tbMessage.value)
            .then(function () { return tbMessage.value = ""; });
    }
    else {
        var m = document.createElement("div");
        m.innerHTML =
            "<div class=\"message-error\">" + "Please enter a Nickname" + "</div>";
        divMessages.appendChild(m);
        divMessages.scrollTop = divMessages.scrollHeight;
    }
}
