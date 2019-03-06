using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Connections;

using Microsoft.AspNetCore.Hosting;
using SignalRWebPack.Hubs;

namespace mywebapp
{
    public class Program
    {
        public static bool isConnected = false;
        public static Thread SocketThread = new Thread(Server);
        private static TcpListener OneTcpListener;
        public static HomeController hc;



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
            
            Console.WriteLine("TCP server started");

            Int32 port = 2001;

            IPAddress localAddr = IPAddress.Parse("127.0.0.1");

            OneTcpListener = new TcpListener(localAddr, port);

            OneTcpListener.Start();

            OneTcpListener.BeginAcceptTcpClient(HandleAsyncConnection, OneTcpListener);

        }

        private static void HandleAsyncConnection(IAsyncResult res)
        {
            OneTcpListener.BeginAcceptTcpClient(HandleAsyncConnection, OneTcpListener);
            TcpClient client = OneTcpListener.EndAcceptTcpClient(res);
            Console.WriteLine("Telnet Client connected");

            hc.CnewMessage("test", "test");


            //---get the incoming data through a network stream---
            StreamWriter sWriter = new StreamWriter(client.GetStream(), Encoding.ASCII);
            StreamReader sReader = new StreamReader(client.GetStream(), Encoding.ASCII);
            //proceed
            sWriter.WriteLine("Welcome to the BitCraft Chat! What is your name?");
            sWriter.Flush();
            Boolean bClientConnected = true;
            String sData = null;
            

            sData = sReader.ReadLine();
            string login = sData;
            Console.WriteLine("login set to: " + sData);
            while (bClientConnected)
            {
                // reads from stream
                sData = sReader.ReadLine();
                
                // shows content on the console.
                Console.WriteLine(login + ": " + sData);
                

                // to write something back.
                sWriter.WriteLine("Meaningfull things here");
                sWriter.Flush();
            }

        }





    }
}
