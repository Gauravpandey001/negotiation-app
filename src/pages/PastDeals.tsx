import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Offer {
  message: string;
  from: string;
  acceptedBy: string;
  roomCode: string;
  createdAt: string;
}

const PastDeals = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`https://negotiationbackend.onrender.com/offers/${roomCode}`);
        const data = await res.json();
        setOffers(data);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [roomCode]);

  if (loading) return <p className="text-center mt-10">Loading deals...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Past Accepted Deals for Room <span className="text-blue-600">{roomCode}</span>
      </h1>
      {offers.length === 0 ? (
        <p className="text-center text-gray-500">No accepted deals found.</p>
      ) : (
        <ul className="space-y-4">
          {offers.map((offer, idx) => (
            <li key={idx} className="bg-white shadow p-4 rounded">
              <p className="font-medium">{offer.message}</p>
              <p className="text-sm text-gray-600">
                From: <span className="font-semibold">{offer.from}</span>
              </p>
              <p className="text-sm text-green-600">
                ✅ Accepted By: <span className="font-semibold">{offer.acceptedBy}</span>
              </p>
              <p className="text-xs text-gray-400">{new Date(offer.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PastDeals;
