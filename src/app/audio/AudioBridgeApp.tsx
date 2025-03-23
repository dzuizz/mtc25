import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, UploadCloud, Smartphone, Laptop, CheckCircle, RefreshCw, Download } from 'lucide-react';

const AudioBridgeApp = () => {
  const [activeView, setActiveView] = useState<'phone' | 'laptop'>('phone');
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [transferState, setTransferState] = useState<'not-started' | 'transferring' | 'completed'>('not-started');
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [transferProgress, setTransferProgress] = useState<number>(0);

  // Audio recording references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioURLRef = useRef<string | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (audioStreamRef.current) {
        const tracks = audioStreamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }

      if (audioURLRef.current) {
        URL.revokeObjectURL(audioURLRef.current);
      }
    };
  }, []);

  // Start recording function
  const startRecording = async () => {
    try {
      // Reset any previous recording
      audioChunksRef.current = [];

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Set up data handling
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

        // Create URL for the audio blob
        if (audioURLRef.current) {
          URL.revokeObjectURL(audioURLRef.current);
        }

        audioURLRef.current = URL.createObjectURL(audioBlob);

        // Stop all tracks
        if (audioStreamRef.current) {
          const tracks = audioStreamRef.current.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };

      // Start recording
      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingDuration(0);

      // Start duration timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check your browser permissions.");
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setRecordingState('recorded');
    }
  };

  // Reset recording function
  const resetRecording = () => {
    if (audioURLRef.current) {
      URL.revokeObjectURL(audioURLRef.current);
      audioURLRef.current = null;
    }

    if (audioStreamRef.current) {
      const tracks = audioStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
    }

    setRecordingState('idle');
    setRecordingDuration(0);
    setTransferState('not-started');
    setTransferProgress(0);
    setPlaybackState('idle');
    setPlaybackProgress(0);

    audioChunksRef.current = [];
  };

  // Start transfer function
  const startTransfer = () => {
    setTransferState('transferring');
    let progress = 0;

    // Simulate transfer progress
    const interval = setInterval(() => {
      progress += 5;
      setTransferProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTransferState('completed');
        // Auto-switch to laptop view when transfer completes
        setActiveView('laptop');
      }
    }, 200);
  };

  // Control playback
  const startPlayback = () => {
    if (!audioURLRef.current) return;

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioURLRef.current);

      // Add event listeners
      audioElementRef.current.addEventListener('ended', () => {
        setPlaybackState('idle');
        setPlaybackProgress(0);
      });

      audioElementRef.current.addEventListener('timeupdate', () => {
        if (audioElementRef.current) {
          setPlaybackProgress(Math.floor(audioElementRef.current.currentTime));
        }
      });
    }

    setPlaybackState('playing');
    audioElementRef.current.play();
  };

  const pausePlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setPlaybackState('paused');
    }
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Download audio file
  const downloadAudio = () => {
    if (!audioURLRef.current) return;

    const a = document.createElement('a');
    a.href = audioURLRef.current;
    a.download = `recording-${new Date().toISOString().slice(0, 10)}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const PhoneView = () => (
    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-xl w-64 mx-auto">
      {/* Phone header with notch */}
      <div className="bg-black h-6 relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-24 h-5 bg-black rounded-b-xl"></div>
      </div>

      {/* App content */}
      <div className="bg-gradient-to-b from-blue-600 to-purple-700 p-4 h-96">
        <div className="text-white text-center mb-4">
          <h2 className="text-xl font-bold">Audio Bridge</h2>
          <p className="text-xs opacity-75">Record and transfer audio</p>
        </div>

        {/* Recording UI */}
        <div className="bg-black bg-opacity-30 rounded-xl p-4 mb-4">
          <div className="flex flex-col items-center">
            {recordingState === 'idle' && (
              <button
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Mic size={28} className="text-white" />
              </button>
            )}

            {recordingState === 'recording' && (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                  <p className="text-white">Recording...</p>
                </div>
                <p className="text-white text-2xl mb-2">{formatTime(recordingDuration)}</p>
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <Square size={24} className="text-white" />
                </button>
              </div>
            )}

            {recordingState === 'recorded' && (
              <div className="flex flex-col items-center">
                <p className="text-white mb-2">Recording completed</p>
                <p className="text-white text-2xl mb-2">{formatTime(recordingDuration)}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={resetRecording}
                    className="p-2 rounded-full bg-gray-500 flex items-center justify-center"
                  >
                    <RefreshCw size={20} className="text-white" />
                  </button>
                  <button
                    onClick={startPlayback}
                    className="p-2 rounded-full bg-blue-500 flex items-center justify-center"
                  >
                    <Play size={20} className="text-white ml-1" />
                  </button>
                  <button
                    onClick={startTransfer}
                    className="px-4 py-2 rounded-lg bg-green-500 flex items-center justify-center"
                    disabled={transferState !== 'not-started'}
                  >
                    <UploadCloud size={20} className="text-white mr-2" />
                    <span className="text-white">Transfer</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transfer status */}
        {transferState !== 'not-started' && (
          <div className="bg-black bg-opacity-30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm">
                {transferState === 'transferring' ? 'Transferring to laptop...' : 'Transfer complete'}
              </p>
              {transferState === 'completed' && <CheckCircle size={16} className="text-green-400" />}
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${transferProgress}%` }}
              ></div>
            </div>
            {transferState === 'completed' && (
              <p className="text-green-300 text-xs mt-2 text-center">
                Ready to play on your laptop
              </p>
            )}
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className="bg-black h-8 flex justify-center items-center">
        <div className="w-24 h-1 bg-gray-500 rounded-full"></div>
      </div>
    </div>
  );

  const LaptopView = () => (
    <div className="bg-gray-800 rounded-t-xl overflow-hidden shadow-xl w-full max-w-md mx-auto">
      {/* Screen bezel */}
      <div className="bg-gray-800 h-4 relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 top-1 w-2 h-2 bg-gray-900 rounded-full"></div>
      </div>

      {/* Screen content */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 p-5 h-72">
        <div className="text-gray-800 text-center mb-4">
          <h2 className="text-xl font-bold">Audio Bridge</h2>
          <p className="text-xs opacity-75">Desktop Receiver</p>
        </div>

        {transferState !== 'completed' ? (
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="mb-4">
              <Laptop size={48} className="text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Waiting for audio...</h3>
            <p className="text-sm text-gray-500">
              Record audio on your phone and transfer it to play here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Smartphone size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Recording from Phone</h3>
                  <p className="text-sm text-gray-500">{formatTime(recordingDuration)}</p>
                </div>
              </div>
              <button
                onClick={downloadAudio}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                title="Download recording"
              >
                <Download size={18} className="text-gray-700" />
              </button>
            </div>

            {/* Audio player */}
            <div className="mb-4">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${recordingDuration > 0 ? (playbackProgress / recordingDuration) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatTime(playbackProgress)}</span>
                <span>{formatTime(recordingDuration)}</span>
              </div>
            </div>

            <div className="flex justify-center">
              {playbackState === 'idle' || playbackState === 'paused' ? (
                <button
                  onClick={startPlayback}
                  className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Play size={24} className="text-white ml-1" />
                </button>
              ) : (
                <button
                  onClick={pausePlayback}
                  className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Pause size={24} className="text-white" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard area */}
      <div className="bg-gray-700 h-6"></div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-md mx-auto mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">Audio Bridge</h1>
        <p className="text-gray-600 text-center mb-6">Record on phone, play on laptop</p>

        {/* Device toggle */}
        <div className="bg-white rounded-lg shadow-md p-2 flex justify-center mb-6">
          <button
            onClick={() => setActiveView('phone')}
            className={`px-4 py-2 rounded-lg flex items-center ${activeView === 'phone' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
          >
            <Smartphone size={20} className="mr-2" />
            Phone View
          </button>
          <button
            onClick={() => setActiveView('laptop')}
            className={`px-4 py-2 rounded-lg flex items-center ${activeView === 'laptop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
          >
            <Laptop size={20} className="mr-2" />
            Laptop View
          </button>
        </div>
      </div>

      {activeView === 'phone' ? <PhoneView /> : <LaptopView />}

      {/* Instructions */}
      <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md p-4">
        <h3 className="font-medium mb-2">How it works:</h3>
        <ol className="text-sm text-gray-600 space-y-2 pl-5 list-decimal">
          <li>Record audio using the microphone button (requires microphone permission)</li>
          <li>Press stop when finished recording</li>
          <li>Click the transfer button to simulate sending to your laptop</li>
          <li>The app will automatically switch to laptop view</li>
          <li>Play the audio on your &quot;laptop&quot; with the play button</li>
          <li>You can also download the audio file for safekeeping</li>
        </ol>
        <p className="text-sm text-gray-600 mt-4 bg-yellow-50 p-2 rounded">
          <strong>Note:</strong> This web app directly records and plays audio in your browser.
          In a real production app, the audio would actually transfer between devices using WebRTC,
          WebSockets, or cloud storage.
        </p>
      </div>
    </div>
  );
};

export default AudioBridgeApp;
