import express from "express";
require('dotenv').config();
import cors from 'cors';
import bodyParser from 'body-parser';
import initRoutes from "./src/routes";
import connect from './src/config/connectDB';
import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 8080
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
    }
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

initRoutes(app)
connect()


io.on("connection", (socket) => {
    socket.on('disconnect', () => {
    })

    socket.on('newReportCreated', (data) => {
        socket.broadcast.emit('newReport', data);
    })

    socket.on('newPostCreated', (data) => {
        socket.broadcast.emit('newPost', data);
    })
});


httpServer.listen(port, () => {
    console.log("Server is running on port " + port)
})
