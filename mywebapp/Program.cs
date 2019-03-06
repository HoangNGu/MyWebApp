using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using SignalRWebPack.Hubs;

namespace mywebapp
{
    public class Program
    {
        public static bool isConnected = false;
        public static Thread SocketThread = new Thread(Server);
        private static TcpListener OneTcpListener;
        public static HomeController hc;
        public static IHubContext<ChatHub> HubContext;


        public static void Main(string[] args)
        {
            
            SocketThread.Start();
            isConnected = true;
            BuildWebHost(args).Run();
        }
        
    

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>().Build();


        
            

        





    }
}
