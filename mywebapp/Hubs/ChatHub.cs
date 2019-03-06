using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace SignalRWebPack.Hubs
{
    public class ChatHub : Hub
    {
        public static List<String> participants = new List<String>();
        protected static IHubContext<ChatHub> _hubContext;

        public ChatHub(IHubContext<ChatHub> context)
        {
            _hubContext = context;
        }

        public async Task newMessage(string username, string message)
        {
            if (!participants.Contains(username))
            {
                participants.Add(username);
                await Clients.All.SendAsync("newParticipant", username);
                
            }
            await Clients.All.SendAsync("messageReceived", username, message);
        }

        public static void Static_newMessage(string username, string message)
        {

            if (!participants.Contains(username))
            {
                participants.Add(username);
                _hubContext.Clients.All.SendAsync("newParticipant", username);
            }
            _hubContext.Clients.All.SendAsync("messageReceived", username, message);
        }


    }
}
