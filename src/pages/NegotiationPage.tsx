import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../utils/socket";

interface Offer {
  message: string;
  from: string;
  status: "pending" | "accepted" | "declined";
}

const NegotiationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { roomCode, username } = state || {};

  const [offerText, setOfferText] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!roomCode || !username) {
      navigate("/");
      return;
    }

    // Receive updated offers
    socket.on("offer-updated", (data) => {
      setOffers(data);
    });

    // Receive list of users in the room
    socket.on("user-joined", (users) => {
      setParticipants(users.map((u: any) => u.username));
    });

    socket.on("offer-finalized", (data) => {
        navigate("/final", { state: data });
      });

    socket.on("user-typing", (data) => {
       if (data.username !== username) {
        console.log("USer is typing");
        setTypingUser(data.username);
       }
    });
      
    socket.on("user-stop-typing", () => {
        setTypingUser(null);
    });
      


    return () => {
        socket.off("offer-updated");
        socket.off("user-joined");
        socket.off("offer-finalized");
        socket.off("user-typing");
        socket.off("user-stop-typing");
      };
  }, []);

  const handleSendOffer = () => {
    if (offerText.trim() === "") return;

    socket.emit("new-offer", {
      roomCode,
      offer: {
        message: offerText,
        from: username,
      },
    });

    setOfferText("");
  };

  const handleAccept = (index: number) => {
    socket.emit("accept-offer", {
      roomCode,
      index,
      acceptedBy: username,
    });
  };

  const handleDecline = (index: number) => {
    socket.emit("decline-offer", { roomCode, index });
  };
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOfferText(e.target.value);
    socket.emit("typing", { roomCode, username });
  
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { roomCode });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">Room: <span className="text-blue-600">{roomCode}</span></h1>
        <p className="text-center mb-4 text-gray-700">👥 {participants.join(" & ")}</p>

        <div className="bg-white shadow rounded p-4 mb-6">
          <h2 className="font-semibold mb-2">💬 Offers</h2>
          {offers.length === 0 ? (
            <p className="text-gray-500">No offers yet.</p>
          ) : (
            <ul className="space-y-3">
              {offers.map((offer, idx) => (
                <li
                  key={idx}
                  className="border rounded p-3 flex justify-between items-center bg-gray-100"
                >
                  <div>
                    <p className="font-medium">{offer.message}</p>
                    <p className="text-sm text-gray-600">From: {offer.from}</p>
                    <p className={`text-xs mt-1 font-semibold ${
                      offer.status === "pending" ? "text-yellow-600" :
                      offer.status === "accepted" ? "text-green-600" :
                      "text-red-600"
                    }`}>
                      {offer.status}
                    </p>
                  </div>
                  {offer.status === "pending" && offer.from !== username && (
  <div className="space-x-2">
    <button
      onClick={() => handleAccept(idx)}
      className="px-2 py-1 bg-green-500 text-white rounded text-sm"
    >
      Accept
    </button>
    <button
      onClick={() => handleDecline(idx)}
      className="px-2 py-1 bg-red-500 text-white rounded text-sm"
    >
      Decline
    </button>
  </div>
)}
                </li>
              ))}
            </ul>
          )}
        </div>
        {typingUser && (
  <p className="text-sm text-purple-600 font-medium mt-2">
    ✏️ {typingUser} is typing...
  </p>
)}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type an offer..."
            value={offerText}
            onChange={handleTyping}
            className="flex-1 border px-4 py-2 rounded"
          />
          <button
            onClick={handleSendOffer}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default NegotiationPage;