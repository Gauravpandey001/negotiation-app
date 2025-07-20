import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5050'); // adjust if backend is hosted elsewhere

const NegotiationRoom = () => {
  const [offer, setOffer] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('receive-offer', (data: string) => {
      setMessages(prev => [...prev, `Other: ₹${data}`]);
    });

    return () => {
      socket.off('receive-offer');
    };
  }, []);

  const sendOffer = () => {
    if (offer.trim() === '') return;

    socket.emit('send-offer', offer);
    setMessages(prev => [...prev, `You: ₹${offer}`]);
    setOffer('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">💬 Real-Time Negotiation</h2>

      <div className="h-40 overflow-y-auto border border-gray-300 p-2 mb-4 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1 text-sm">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          className="flex-1 border px-3 py-1 rounded"
          value={offer}
          onChange={e => setOffer(e.target.value)}
          placeholder="Enter your offer (₹)"
        />
        <button
          onClick={sendOffer}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default NegotiationRoom;
