import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FinalPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { roomCode, acceptedOffer } = state || {};

  useEffect(() => {
    if (!roomCode || !acceptedOffer) {
      navigate("/");
    }
  }, [roomCode, acceptedOffer, navigate]);

  if (!roomCode || !acceptedOffer) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Offer Accepted!</h1>
        <p className="text-gray-700 mb-2"><strong>Room Code:</strong> {roomCode}</p>
        <p className="text-gray-700 mb-2"><strong>Offer:</strong> "{acceptedOffer.message}"</p>
        <p className="text-gray-700"><strong>Accepted By:</strong> {acceptedOffer.acceptedBy}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start New Session
        </button>
        <button
  onClick={() => navigate(`/past-deals/${roomCode}`)}
  className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
>
  View Past Deals
</button>
      </div>
    </div>
  );
};

export default FinalPage;