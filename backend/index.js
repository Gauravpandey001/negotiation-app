require('dotenv').config();
const connectDB = require('./database/connect');

connectDB();
const AcceptedOffer = require('./models/AcceptedOffer');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json()); 
const acceptedOffersRoute = require('./routes/acceptedOffers');
app.use('/offers', acceptedOffersRoute);

const server = http.createServer(app);

// ✅ Initialize io here
const io = new Server(server, {
  cors: {
    origin: "*", // update this to your frontend domain in production
    methods: ["GET", "POST"]
  }
});

const rooms = {}; // { roomCode: { users: [{ id, username }], offers: [] } }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', (username, callback) => {
    const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();

    rooms[roomCode] = {
      users: [{ id: socket.id, username }],
      offers: [],
    };

    socket.join(roomCode);
    callback({ success: true, roomCode });
    console.log(`${username} created room ${roomCode}`);
  });

  socket.on('join-room', ({ roomCode, username }, callback) => {
    const room = rooms[roomCode];

    if (!room) {
      return callback({ success: false, message: 'Room does not exist.' });
    }

    if (room.users.length >= 2) {
      return callback({ success: false, message: 'Room is full.' });
    }

    room.users.push({ id: socket.id, username });
    socket.join(roomCode);
    io.to(roomCode).emit('user-joined', room.users);
    callback({ success: true, roomCode });
    console.log(`${username} joined room ${roomCode}`);
  });

  socket.on('new-offer', ({ roomCode, offer }) => {
    const room = rooms[roomCode];
    if (room) {
      room.offers.push({ ...offer, status: 'pending' });
      io.to(roomCode).emit('offer-updated', room.offers);
    }
  });

  const AcceptedOffer = require('./models/AcceptedOffer'); // Make sure this path is correct

  socket.on("accept-offer", async ({ roomCode, index, acceptedBy }) => {
    const room = rooms[roomCode];
    if (room && room.offers[index]) {
      room.offers[index].status = "accepted";
      room.offers[index].acceptedBy = acceptedBy;
  
      io.to(roomCode).emit("offer-updated", room.offers);
  
      const acceptedOffer = {
        roomCode,
        message: room.offers[index].message,
        from: room.offers[index].from,
        acceptedBy,
        timestamp: new Date(),
      };
  
      try {
        await AcceptedOffer.create(acceptedOffer);
        console.log("✅ Offer saved to DB:", acceptedOffer);
      } catch (error) {
        console.error("❌ Failed to save offer:", error.message);
      }
  
      io.to(roomCode).emit("offer-finalized", {
        roomCode,
        acceptedOffer: room.offers[index],
      });
    }
  });

  socket.on('typing', ({ roomCode, username }) => {
    socket.to(roomCode).emit('user-typing', { username });
  });
  
  socket.on('stop-typing', ({ roomCode }) => {
    socket.to(roomCode).emit('user-stop-typing');
  });

  socket.on('decline-offer', ({ roomCode, index }) => {
    const room = rooms[roomCode];
    if (room && room.offers[index]) {
      room.offers[index].status = 'declined';
      io.to(roomCode).emit('offer-updated', room.offers);
    }
  });

  socket.on('disconnect', () => {
    for (const [roomCode, room] of Object.entries(rooms)) {
      const userIndex = room.users.findIndex((u) => u.id === socket.id);
      if (userIndex !== -1) {
        room.users.splice(userIndex, 1);
        io.to(roomCode).emit('user-joined', room.users);
        if (room.users.length === 0) delete rooms[roomCode];
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

app.get("/offers/:roomCode", async (req, res) => {
  const { roomCode } = req.params;
  try {
    const offers = await AcceptedOffer.find({ roomCode }).sort({ acceptedAt: -1 });
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch offers", error });
  }
});
app.get("/", (req, res) => {
  res.send("Backend is working!");
});
// ✅ Start the server
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
