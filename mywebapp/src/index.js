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
var participants = [];
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();
connection.start().catch(function (err) { return document.write(err); });
connection.on("ConnectionEstablished", function () {
    displayMessage("Connection to the server established", false);
});
connection.on("messageReceived", function (nickname, message) {
    if (participants.indexOf(nickname, 0) == -1) { //Check if the participant has already spoken in the chat session
        NewParticipants(nickname);
    }
    if (mutedUsers.indexOf(nickname, 0) == -1) { //Check if the participant is muted or not before keeping the message in chat history
        var m = document.createElement("div");
        m.innerHTML =
            "<div class=" + nickname + ".message-author>" + ("[" + nickname + "] " + message) + "</div>";
        var color = document.getElementById(nickname + ".input-zone-color");
        m.style.color = color.value;
        divMessages.appendChild(m);
        divMessages.scrollTop = divMessages.scrollHeight;
    }
});
function NewParticipants(nickname) {
    // Handle the list of participants
    participants.push(nickname);
    var p = document.createElement("div");
    var m = document.createElement("div");
    if (tbNickname.value != nickname) {
        p.innerHTML =
            "\n        <div style=\"display: flex; justify-content: space-around\">\n        <label style = \"width:100px; overflow: hidden;\" class = " + nickname + ".participant-nickname id=\"lblMessage\"> " + nickname + " </label>      \n        <input type=\"color\" id=" + nickname + ".input-zone-color value=\"#000000\">\n        <input type=\"checkbox\" id=" + nickname + ".btnMute ></input>\n        <label for=" + nickname + ".btnMute></label>\n        </div>\n        ";
        divParticpants.appendChild(p);
        divParticpants.scrollTop = divParticpants.scrollHeight;
        document.getElementById(nickname + ".btnMute").addEventListener("click", function () {
            MuteUser(nickname);
        });
        document.getElementById(nickname + ".input-zone-color").addEventListener("input", function () {
            ChangeColor(nickname);
        });
    }
    else {
        p.innerHTML =
            "<div style=\"display: flex; justify-content: space-around\">\n            <div style = \"width:100px; overflow: hidden;\" class = " + nickname + ".participant-nickname> " + nickname + " </div>\n            <input  type=\"color\" id=" + nickname + ".input-zone-color value=\"#000000\">\n            </div>";
        divParticpants.appendChild(p);
        divParticpants.scrollTop = divParticpants.scrollHeight;
        document.getElementById(nickname + ".input-zone-color").addEventListener("input", function () {
            ChangeColor(nickname);
        });
    }
    displayMessage(nickname + " has joined the chat!", true);
}
function ChangeColor(nickname) {
    var colorWell = document.getElementById(nickname + ".input-zone-color");
    var elements = document.getElementsByClassName(nickname + ".message-author");
    for (var i in elements) {
        elements[i].style.color = colorWell.value;
    }
}
function MuteUser(nickname) {
    var checkbox = document.getElementById(nickname + ".btnMute");
    if (checkbox.checked) {
        mutedUsers.push(nickname);
        alert("The user " + nickname + " is now muted");
        var elements = document.getElementsByClassName(nickname + ".message-author"); //Hide messages of muted user
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
        var elements = document.getElementsByClassName(nickname + ".message-author"); //Display messages of muted user
        for (var i in elements) {
            elements[i].style.display = "inline";
        }
    }
}
function Send() {
    if (tbNickname.value != "") {
        connection.send("newMessage", tbNickname.value, tbMessage.value)
            .then(function () { return tbMessage.value = ""; });
    }
    else {
        displayMessage("Please enter a Nickname", true);
    }
}
tbMessage.addEventListener("keyup", function (e) {
    if (e.keyCode == 13) {
        Send();
    }
});
btnSend.addEventListener("click", Send);
function displayMessage(message, isNotification) {
    var m = document.createElement("div");
    if (isNotification) {
        m.innerHTML =
            "<div class=\"message-error\">" + message + "</div>";
    }
    else {
        m.innerHTML =
            "<div>" + message + "</div>";
    }
    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
}
