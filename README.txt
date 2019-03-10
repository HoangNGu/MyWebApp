Hoang Nguyen - Bitcraft Software Developer Position

- .NET Core / TypeScript exercise -
****FOLDER****
***Client***
The web client files written in TypeSript are all contained in the folder:
mywebapp\mywebapp\src

***Server***
The Telnet client handler files written in C# are all contained in the folder:
\mywebapp\mywebapp\TelnetClient

The SignalR hub used in the project written in C# is in the folder
\mywebapp\mywebapp\Hubs


****HOW TO RUN THE PROJECT****
1. Unzip the zip file
2. Run 'mywebapp.sln' with Visual Studio
3. Compile and run the code

To connect additional web clients, open a new tab and connect to the same url
https://localhost:44345/

A telnet client can connect to the server using the address 127.0.0.1 and Port 2001


****NEXT STEPS****
The current code is made in order to answer all the tasks asked in the exercise. However,
Here are a list of task that could be done in order to improve the solution:

As of now, the chat history is 'infinite'. We could add a condition to store only a define
number of message on the window.

According to Task #1-3 "On the left side of the screen, display a list 
of all usernames who sent a message during the current session."

=> Due to that, the disconnection of a user is not properly handled. We could improve this point
by not displaying "all usernames who sent a message during the current session" but by
displaying only Connected user (by deleting from the participants list user that are 
disconnected)

According to Task #1-3 "The list of usernames does not need to
 be persisted between chat sessions" from client point of view

=> This could be improve from a client point of view by loading the list of connected users
on the current session joined when a client connects to the session. 


According to Task #1-4 "You can assume that a user is uniquely identified by its username, 
so that a single client changing its username between messages is actually
considered as multiple users."

=> This could be improve by using the Connection ID created by SignalR to update a user's
username when he changed it.