import "./css/main.css";
import * as signalR from "@aspnet/signalr";

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const divParticpants: HTMLDivElement = document.querySelector("#divUsers");
const tbNickname: HTMLInputElement = document.querySelector("#tbNickname");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");
var mutedUsers: Array<string> = [];
var participants: Array<string> = [];
var mySessionNickname: Array<string> = [];

const connection = new signalR.HubConnectionBuilder()
	.withUrl("/hub")
	.build();

connection.start().catch(err => document.write(err));

connection.on("ConnectionEstablished", () => {
    displayMessage("Connection to the server established",false);
});

connection.on("messageReceived", (nickname: string, message: string) => {

    if (participants.indexOf(nickname, 0) == -1) { //Check if the participant has already spoken in the chat session
        NewParticipants(nickname);
    }
    if (mutedUsers.indexOf(nickname, 0) == -1) { //Check if the participant is muted or not before keeping the message in chat history
        let m = document.createElement("div");
	    m.innerHTML =
            `<div class=${nickname}.message-author>${"[" + nickname + "] " + message}</div>`;
        var color = <HTMLInputElement>document.getElementById(nickname + ".input-zone-color");
        m.style.color = color.value;
	    divMessages.appendChild(m);
        divMessages.scrollTop = divMessages.scrollHeight;

    }
});

function NewParticipants(nickname: string) {
    // Handle the list of participants
    participants.push(nickname);
    let p = document.createElement("div");
    let m = document.createElement("div");

    if (tbNickname.value != nickname) {
        p.innerHTML =
            `
        <div style="display: flex; justify-content: space-around">
        <label style = "width:100px; overflow: hidden;" class = ${nickname}.participant-nickname id="lblMessage"> ${nickname} </label>      
        <input type="color" id=${nickname}.input-zone-color value="#000000">
        <input type="checkbox" id=${nickname}.btnMute ></input>
        <label for=${nickname}.btnMute></label>
        </div>
        `;
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
            `<div style="display: flex; justify-content: space-around">
            <div style = "width:100px; overflow: hidden;" class = ${nickname}.participant-nickname> ${nickname} </div>
            <input  type="color" id=${nickname}.input-zone-color value="#000000">
            </div>`;

        divParticpants.appendChild(p);
        divParticpants.scrollTop = divParticpants.scrollHeight;

        document.getElementById(nickname + ".input-zone-color").addEventListener("input", function () {
            ChangeColor(nickname);
        });
    }
    displayMessage(nickname + " has joined the chat!", true);

}

function ChangeColor(nickname: string) {
    var colorWell = <HTMLInputElement>document.getElementById(nickname + ".input-zone-color");

    let elements = document.getElementsByClassName(nickname + ".message-author") as HTMLCollectionOf<HTMLElement>
    for (var i in elements) {
        elements[i].style.color = colorWell.value;
    }}

function MuteUser(nickname: string) {
    var checkbox = <HTMLInputElement> document.getElementById(nickname + ".btnMute");
    if (checkbox.checked) { 
        mutedUsers.push(nickname);
        alert("The user " + nickname + " is now muted");
        let elements = document.getElementsByClassName(nickname + ".message-author") as HTMLCollectionOf<HTMLElement> //Hide messages of muted user
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
        let elements = document.getElementsByClassName(nickname + ".message-author") as HTMLCollectionOf<HTMLElement> //Display messages of muted user
        for (var i in elements) {
            elements[i].style.display = "inline";
        }
        
    }
    
    
}

function Send() {
    if (tbNickname.value != "") {
        connection.send("newMessage", tbNickname.value, tbMessage.value)
            .then(() => tbMessage.value = "");
    }
    else {
        displayMessage("Please enter a Nickname",true);
    }
}

tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.keyCode == 13) {
        Send();
    }
});


btnSend.addEventListener("click", Send);

function displayMessage(message: string, isNotification: boolean) {
    let m = document.createElement("div");

    if (isNotification) {
        m.innerHTML =
            `<div class="message-error">${message}</div>`;
    }
    else {
        m.innerHTML =
            `<div>${message}</div>`;
    }
    

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;

}




