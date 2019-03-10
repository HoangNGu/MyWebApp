using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace mywebapp
{
    public class TelnetClientHandler
    {
        private static TcpListener OneTcpListener;

        public static void Server()

        {
            Int32 port = 2001;

            IPAddress localAddr = IPAddress.Parse("127.0.0.1");

            OneTcpListener = new TcpListener(localAddr, port);

            OneTcpListener.Start();
            Console.WriteLine("TCP server started, waiting telnet clients");
            OneTcpListener.BeginAcceptTcpClient(HandleAsyncConnection, OneTcpListener);

        }

        private async static void HandleAsyncConnection(IAsyncResult res)
        {
            /// <summary>
            /// Handle the communication between the telnet client on the listener with the SignalR hub to use hub methods
            /// following instruction sent through telnet client
            /// </summary>
            /// <param name="res"></param>

            OneTcpListener.BeginAcceptTcpClient(HandleAsyncConnection, OneTcpListener);
            TcpClient client = OneTcpListener.EndAcceptTcpClient(res);
            TelnetHubClient telnetHubClient = new TelnetHubClient(client);
            Console.WriteLine("Telnet Client connected");

            HubConnection connection;
            connection = new HubConnectionBuilder()
                .WithUrl("https://localhost:44345/hub")
                .Build();

            connection.On<string, string>("messageReceived", (user, message) =>
            {
                if (telnetHubClient.bClientConnected == true)
                {
                    if (telnetHubClient.participants.IndexOf(user, 0) == -1 && user != telnetHubClient.login)
                    { //Check if the participant has already spoken in the chat session
                        telnetHubClient.participants.Add(user);
                        telnetHubClient.SendMessage("[" + user + "] has joined the chat");
                    }
                    if (telnetHubClient.mutedUser.IndexOf(user, 0) == -1)
                    { //Check if the participant is muted
                        telnetHubClient.SendMessage("[" + user + "] " + message);
                    }

                }

            });
            connection.Closed += async (error) =>
            {
                await Task.Delay(new Random().Next(0, 5) * 1000);
                await connection.StartAsync();
            };

            try
            {
                await connection.StartAsync();
                //---get the incoming data through a network stream---
                telnetHubClient.bClientConnected = true;

                //Handshake to get Telnet client login
                telnetHubClient.DiscardBuffer();

                telnetHubClient.HandshakeConnection();

                Console.WriteLine("login set to: " + telnetHubClient.sData);

                while (telnetHubClient.bClientConnected && telnetHubClient.sData != "/quit")
                {
                    // reads from stream to discuss with Hub
                    telnetHubClient.ReadLine();
                    if (telnetHubClient.sData == "/quit" || telnetHubClient.sData == null) // Handle client disconnection
                    {
                        telnetHubClient.bClientConnected = false;
                        Console.WriteLine(telnetHubClient.login +" disconnected");
                        telnetHubClient.SendMessage("Disconnected from server");
                        client.GetStream().Close();
                        client.Close();
                    }

                    else if (telnetHubClient.sData == "/mute")
                    {
                        telnetHubClient.Mute();

                    }

                    else if (telnetHubClient.sData == "/unmute")
                    {
                        telnetHubClient.Unmute();

                    }

                    else if (telnetHubClient.bClientConnected == true)
                    {
                        Console.WriteLine(telnetHubClient.login + ": " + telnetHubClient.sData);
                        await connection.SendAsync("newMessage", telnetHubClient.login, telnetHubClient.sData);
                    }
                    
                }
            }
            catch (Exception ex)
            {

            }


        }
    }
}
