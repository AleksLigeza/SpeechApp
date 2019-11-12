using Microsoft.CognitiveServices.Speech;

namespace SpeechApp.API.SignalR
{
    public class ConnectionInfo
    {
        public string SessionId;
        public SpeechRecognizer SpeechClient;
        public VoiceAudioStream AudioStream;
    }
}