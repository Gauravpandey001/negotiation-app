import { useNavigate } from "react-router-dom";
import { useState } from "react";
import socket from "../utils/socket";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'idle' | 'create' | 'join'>('idle');

  const handleCreate = () => {
    if (!username.trim()) return alert("Please enter your name");
    socket.emit('create-room', username, (response: any) => {
      if (response.success) {
        navigate('/negotiation', {
          state: { roomCode: response.roomCode, username }
        });
      } else {
        alert("Failed to create room");
      }
    });
  };

  const handleJoin = () => {
    if (!username.trim() || !roomCode.trim()) return alert("Enter name and room code");
    socket.emit('join-room', { username, roomCode }, (response: any) => {
      if (response.success) {
        navigate('/negotiation', {
          state: { roomCode: response.roomCode, username }
        });
      } else {
        alert(response.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">💬 Real-Time Negotiation</h1>

        {mode === 'idle' && (
          <>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-4 transition"
              onClick={() => setMode('create')}
            >
              Create Room
            </button>
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
              onClick={() => setMode('join')}
            >
              Join Room
            </button>
          </>
        )}

        {(mode === 'create' || mode === 'join') && (
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Name"
              className="w-full border px-4 py-2 rounded"
            />
            {mode === 'join' && (
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Room Code"
                className="w-full border px-4 py-2 rounded"
              />
            )}
            <div className="flex justify-between gap-2">
              <button
                className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
                onClick={() => setMode('idle')}
              >
                Back
              </button>
              <button
                className={`w-1/2 text-white py-2 rounded ${
                  mode === 'create' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                }`}
                onClick={mode === 'create' ? handleCreate : handleJoin}
              >
                {mode === 'create' ? 'Create' : 'Join'}
              </button>
              
            </div>
          </div>
        )}
        {mode === 'idle' && (
  <button
    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded mt-4"
    onClick={() => {
      const room = prompt("Enter Room Code to view past deals:");
      if (room && room.trim()) {
        navigate(`/past-deals/${room.trim().toUpperCase()}`);
      }
    }}
  >
    📜 View Past Deals
  </button>
)}
      </div>
    </div>
  );
};

export default Home;