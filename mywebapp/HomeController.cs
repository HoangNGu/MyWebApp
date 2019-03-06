using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRWebPack.Hubs;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mywebapp
{
    public class HomeController : Controller
    {


        private IHubContext<ChatHub> _hubContext
        {
            get;
            set;
        }

        public HomeController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public Task CnewMessage(string username, string message)
        {
            {
                if (!ChatHub.participants.Contains(username))
                {
                    ChatHub.participants.Add(username);
                    return _hubContext.Clients.All.SendAsync("newParticipant", username);
                }
                return _hubContext.Clients.All.SendAsync("messageReceived", username, message);
            }
        }


    }
}
