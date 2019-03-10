using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace SignalRWebPack.Hubs
{
    public class ChatHub : Hub
    {
        public List<String> sessionParticipants = new List<String>();
        protected static IHubContext<ChatHub> _hubContext;

        public ChatHub(IHubContext<ChatHub> context)
        {
            _hubContext = context;
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("ConnectionEstablished");
            await base.OnConnectedAsync();
        }

        public async Task NewMessage(string username, string message)
        {
            if (sessionParticipants.IndexOf(username, 0) == -1)
            {
                sessionParticipants.Add(username);
            }
            await Clients.All.SendAsync("messageReceived", username, message);
        }

    }
}
