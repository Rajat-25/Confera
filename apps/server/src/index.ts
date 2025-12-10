import 'dotenv/config';
import express from 'express';
import http from 'http';
import { WsCommunicationSingleton } from './ws/ws-server.js';
const PORT = process.env.SERVER_PORT;
const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Backend is live' });
});

WsCommunicationSingleton.getInstance(server);

server.listen(PORT, () => {
  console.log(`webSocket Server is running on Port: ${PORT} `);
});
