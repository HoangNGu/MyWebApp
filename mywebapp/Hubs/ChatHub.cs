using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace SignalRWebPack.Hubs
{
    public class ChatHub : Hub
    {
        public List<String> sessionParticipants = new List<String>();


        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("ConnectionEstablished");
            await base.OnConnectedAsync();
        }


        public async Task NewMessage(string username, string message)
        {
            await Clients.All.SendAsync("messageReceived", username, message);
        }


    }
}
