'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MessageCircle, Send, Mic } from 'lucide-react';

const LittleEchoApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [replyMode, setReplyMode] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  // Format date to display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock data for mood timeline
  const moodData = [
    { time: '8:00 AM', mood: 'happy', emoji: '😊' },
    { time: '9:30 AM', mood: 'excited', emoji: '🤗' },
    { time: '11:00 AM', mood: 'neutral', emoji: '😐' },
    { time: '12:30 PM', mood: 'sad', emoji: '😔' },
    { time: '1:45 PM', mood: 'frustrated', emoji: '😣' },
    { time: '3:00 PM', mood: 'happy', emoji: '😊' },
    { time: '4:30 PM', mood: 'excited', emoji: '🤗' },
    { time: '5:45 PM', mood: 'sleepy', emoji: '😴' }
  ];

  // Mock data for daily story
  const dailyStory = `Emma had a bright start to her day! She was very excited during morning playtime and shared her toys with friends. Around lunchtime, she seemed a bit sad and missed you, but after naptime, her mood improved dramatically. She spent the afternoon building block towers and laughing with her friends. Today's highlight was when she helped comfort another child who was crying. Before pickup, she was getting sleepy but kept asking when you'd arrive.`;

  // Define mood types
  type MoodType = 'happy' | 'excited' | 'neutral' | 'sad' | 'frustrated' | 'sleepy';

  // Function to get color based on mood
  const getMoodColor = (mood: string): string => {
    const colors: Record<MoodType, string> = {
      happy: 'bg-green-500',
      excited: 'bg-blue-500',
      neutral: 'bg-yellow-400',
      sad: 'bg-purple-400',
      frustrated: 'bg-red-500',
      sleepy: 'bg-indigo-300'
    };

    return (colors as Record<string, string>)[mood] || 'bg-gray-400';
  };

  const handlePreviousDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  const handleReply = (type: string) => {
    setReplyMode(type);
  };

  const handleSendReply = () => {
    // In a real app, this would send the reply to the child
    setReplyMode(null);
  };

  const handleRecording = () => {
    setRecording(!recording);
  };

  // Emoji reactions for quick replies
  const emojiReactions = ['❤️', '👍', '🤗', '😘', '🌟', '🎉'];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* App Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <span className="mr-2">🧸</span> Little Echo
          </h1>
          <button className="p-2 rounded-full bg-indigo-500 text-white">
            <Calendar size={20} />
          </button>
        </div>
      </header>

      {/* Date Navigation */}
      <div className="bg-white p-4 flex justify-between items-center shadow-sm">
        <button
          onClick={handlePreviousDay}
          className="p-2 rounded-full bg-gray-200 text-gray-700"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
        <button
          onClick={handleNextDay}
          className="p-2 rounded-full bg-gray-200 text-gray-700"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Mood Timeline */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Today&apos;s Mood Timeline</h3>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-500">Morning</span>
            <span className="text-xs text-gray-500">Afternoon</span>
            <span className="text-xs text-gray-500">Evening</span>
          </div>
          <div className="flex h-8 mb-4">
            {moodData.map((item, index) => (
              <div
                key={index}
                className={`${getMoodColor(item.mood)} flex-1 first:rounded-l-full last:rounded-r-full`}
                title={`${item.time}: ${item.mood}`}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {moodData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Story */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Emma&apos;s Daily Story</h3>
          <p className="text-gray-700 mb-4">{dailyStory}</p>
          <div className="flex justify-end">
            <button
              onClick={() => handleReply('emoji')}
              className="flex items-center bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full mr-2"
            >
              React with Emoji
            </button>
            <button
              onClick={() => handleReply('voice')}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full"
            >
              <MessageCircle size={18} className="mr-1" />
              Send Voice Reply
            </button>
          </div>
        </div>

        {/* Reply Section - conditionally rendered */}
        {replyMode === 'emoji' && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3">Send an Emoji to Emma</h3>
            <div className="flex justify-between mb-4">
              {emojiReactions.map((emoji, index) => (
                <button
                  key={index}
                  className="text-2xl p-2 hover:bg-gray-100 rounded-full"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSendReply}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full"
              >
                <Send size={18} className="mr-1" />
                Send to Emma
              </button>
            </div>
          </div>
        )}

        {replyMode === 'voice' && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3">Record a Message for Emma</h3>
            <div className="flex justify-center mb-4">
              <button
                onClick={handleRecording}
                className={`p-6 rounded-full ${recording ? 'bg-red-500' : 'bg-indigo-600'} text-white`}
              >
                <Mic size={24} />
              </button>
            </div>
            <p className="text-center text-gray-600 mb-4">
              {recording ? 'Recording... Tap to stop' : 'Tap to start recording'}
            </p>
            {recording && (
              <div className="flex justify-center mb-4">
                <div className="h-4 w-64 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-3/4 animate-pulse"></div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleSendReply}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full"
                disabled={!recording}
              >
                <Send size={18} className="mr-1" />
                Send to Emma
              </button>
            </div>
          </div>
        )}

        {/* Insight Cards */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Today&apos;s Insights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <h4 className="font-medium text-green-800">Top Emotion</h4>
              <p className="text-2xl">😊 Happy</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <h4 className="font-medium text-purple-800">Mood Shifts</h4>
              <p className="text-2xl">3 changes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white border-t border-gray-200 p-3">
        <div className="flex justify-around">
          <button className="p-2 text-indigo-600">
            <div className="flex flex-col items-center">
              <span>📊</span>
              <span className="text-xs mt-1">Timeline</span>
            </div>
          </button>
          <button className="p-2 text-gray-500">
            <div className="flex flex-col items-center">
              <span>📖</span>
              <span className="text-xs mt-1">Stories</span>
            </div>
          </button>
          <button className="p-2 text-gray-500">
            <div className="flex flex-col items-center">
              <span>🔔</span>
              <span className="text-xs mt-1">Alerts</span>
            </div>
          </button>
          <button className="p-2 text-gray-500">
            <div className="flex flex-col items-center">
              <span>⚙️</span>
              <span className="text-xs mt-1">Settings</span>
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LittleEchoApp;
