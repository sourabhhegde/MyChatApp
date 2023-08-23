const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const wordToEmoji = {
  "woah": "😲",
  "hey": "👋",
  "lol": "😂",
  "like": "🤍",
  "congratulations": "🎉",
  "react":"🔯"  
  // Replace "woah" with the corresponding emoji
  // Add more word-emoji mappings as needed
};

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('message', (msg) => {
    const originalMsg = msg; // Store the original message
    
    // Convert the message to lowercase for case-insensitive comparison
    msg = msg.toLowerCase();
    
    // Check if the message contains the word "woah" and replace it with the emoji
    for (const word in wordToEmoji) {
      if (msg.includes(word)) {
        msg = msg.replace(word, wordToEmoji[word]);
      }
    }
    
    io.emit('message', msg); // Broadcast the modified message (with emoji) to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
