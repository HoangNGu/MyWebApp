using System.Threading;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.Hosting;

namespace mywebapp
{
    public class Program
    {
        public static bool isConnected = false;
        public static Thread SocketThread = new Thread(Server);
       


        public static void Main(string[] args)
        {
            
            SocketThread.Start();
            isConnected = true;
            BuildWebHost(args).Run();
        }
        
    

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>().Build();


        public static void Server()

        {
            TelnetClientHandler.Server();
        }



    }
}
