using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace mywebapp
{
    public class TelnetHubClient
    {

        public bool bClientConnected = false;
        public List<string> mutedUser = new List<string>();
        public List<string> participants = new List<string>();

        public string login { get; set; }
        public string sData { get; set; }

        private StreamWriter sWriter;
        private StreamReader sReader;

        public TelnetHubClient(TcpClient client)
        {
            /// <summary>
            /// This class handles the interaction with the telnet TCP client.
            /// </summary>
            /// <param name="res"></param>
            /// 
            this.sWriter = new StreamWriter(client.GetStream(), Encoding.ASCII);
            this.sReader = new StreamReader(client.GetStream(), Encoding.ASCII);
            this.sData = null;
            this.login = "";
        }

        public void SendMessage(String message)
        {
            sWriter.WriteLine(message);
            sWriter.Flush();
        }

        public void Unmute()
        {
            if (mutedUser.Any())
            {
                string message = "Which user do you want to unmute ? ";
                foreach (string user in mutedUser)
                {
                    message += Environment.NewLine + user;
                }
                SendMessage(message);
                string userToUnmute = sReader.ReadLine();
                if (mutedUser.Contains(userToUnmute))
                {
                    mutedUser.Remove(userToUnmute);
                    SendMessage(userToUnmute + " has been unmuted");
                }
                else
                {
                    SendMessage("The user does not exist or is not muted");
                }

            }
            else
            {
                SendMessage("You did not mute anyone in the current session");
            }

        }

        public void Mute()
        {
            if (participants.Any())
            {
                string message = "Which user do you want to mute ? ";
                foreach (string user in participants)
                {
                    message += Environment.NewLine + user;
                }
                SendMessage(message);
                string userToMute = sReader.ReadLine();
                if (participants.Contains(userToMute))
                {
                    mutedUser.Add(userToMute);
                    SendMessage(userToMute + " has been muted");
                }
                else if (userToMute == login)
                {
                    SendMessage("You can not mute yourself");
                }
                else
                {
                    SendMessage("The user does not exist in the current session");
                }

            }
            else
            {
                SendMessage("There are no other participants in the session");
            }

        }

        public void ReadLine()
        {
            sData = sReader.ReadLine();
        }

        public void HandshakeConnection()
        {
            SendMessage("Welcome to BitCraft Chat! What is your name?");

            while (login == "" || login.Contains(" "))
            {
                ReadLine();
                if (sData.Contains(" "))
                {
                    SendMessage("Please use a login without spaces");
                }
                else
                {
                    login = sData;
                }
            }

            SendMessage("login set to: " + login + Environment.NewLine +
                "Enter command \"/mute\" to mute a user and \"/quit\" to leave the chat");
        }

        public void DiscardBuffer()
        {
            sReader.Read();
            sReader.DiscardBufferedData();
        }
    }
}
