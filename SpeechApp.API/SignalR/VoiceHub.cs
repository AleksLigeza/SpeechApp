using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace SpeechApp.API.SignalR
{
    public class VoiceHub : Hub
    {
        private static IConfiguration _config;
        private static IHubContext<VoiceHub> _hubContext;
        private static Dictionary<string, ConnectionInfo> _connections;

        private List<string> phrases = new List<string>
        {
            "up",
            "down",
            "left",
            "right",
            "reset"
        };

        public VoiceHub(IConfiguration configuration, IHubContext<VoiceHub> ctx)
        {
            if (_config == null)
                _config = configuration;

            if (_connections == null)
                _connections = new Dictionary<string, ConnectionInfo>();

            if (_hubContext == null)
                _hubContext = ctx;
        }

        public async void AudioStart()
        {
            var audioStream = new VoiceAudioStream();
            var audioFormat = AudioStreamFormat.GetWaveFormatPCM(16000, 16, 1);
            var audioConfig = AudioConfig.FromStreamInput(audioStream, audioFormat);
            var speechConfig = SpeechConfig.FromSubscription(_config["SpeechApiKey"], _config["SpeechRegion"]);
            var speechClient = new SpeechRecognizer(speechConfig, audioConfig);
            var phraseList = PhraseListGrammar.FromRecognizer(speechClient);
            foreach(var phrase in phrases)
            {
                phraseList.AddPhrase(phrase);
            }

            speechClient.Recognized += _speechClient_Recognized;

            string sessionId = speechClient.Properties.GetProperty(PropertyId.Speech_SessionId);

            var conn = new ConnectionInfo()
            {
                SessionId = sessionId,
                AudioStream = audioStream,
                SpeechClient = speechClient,
            };

            _connections.Add(Context.ConnectionId, conn);

            await speechClient.StartContinuousRecognitionAsync();

            Debug.WriteLine("Audio start message.");
        }

        public void ReceiveAudio(byte[] audioChunk)
        {
            _connections[Context.ConnectionId].AudioStream.Write(audioChunk, 0, audioChunk.Length);
        }

        public async Task SendTranscript(string text, string sessionId)
        {
            var connection = _connections.Where(c => c.Value.SessionId == sessionId).FirstOrDefault();
            await _hubContext.Clients.Client(connection.Key).SendAsync("IncomingTranscript", text);
        }

        private async void _speechClient_Recognized(object sender, SpeechRecognitionEventArgs e)
        {
            var text = new string(e.Result.Text.Where(char.IsLetter).ToArray());
            if (phrases.Contains(text, StringComparer.InvariantCultureIgnoreCase))
            {
                await SendTranscript(e.Result.Text, e.SessionId);
            }
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            var connection = _connections[Context.ConnectionId];
            await connection.SpeechClient.StopContinuousRecognitionAsync();
            connection.SpeechClient.Dispose();
            connection.AudioStream.Dispose();
            _connections.Remove(Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }
    }
}