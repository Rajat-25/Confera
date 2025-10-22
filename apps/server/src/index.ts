import 'dotenv/config';
import express from 'express';
import http from 'http';
import { WsCommunicationSingleton } from './ws-server.js';

const PORT = process.env.PORT || 3005;
const app = express();
const server = http.createServer(app);

app.use(express.json());

WsCommunicationSingleton.getInstance(server);

server.listen(PORT, () => {
  console.log(`\n Websocket Server is running on Port: ${PORT} `);
});
