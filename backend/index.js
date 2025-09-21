import express from 'express'
import dotenv from 'dotenv'
dotenv.config() 

import connectDB from './config/db.js';
import { authRouter } from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { userRouter } from './routes/user.routes.js';
import { shopRouter } from './routes/shop.routes.js';
import { itemRouter } from './routes/item.routes.js';
import { orderRouter } from './routes/order.routes.js';

import http from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './socket.js';

const app = express();
const server = http.createServer(app)

const io = new Server(server,{
  cors:{
    origin: "https://vingo-8hz8.onrender.com",
    methods:["GET","POST"],
    credentials:true
  }
})

app.set('io', io);

app.use(cors({
  origin: "https://vingo-8hz8.onrender.com",  // React frontend URL
  credentials: true                 // Allow credentials (cookies, auth headers)
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/shop', shopRouter);
app.use('/api/item', itemRouter);
app.use('/api/order',orderRouter)

const port = process.env.PORT || 5000;

socketHandler(io)
server.listen(port, () => {
    connectDB()
    console.log(`Server is running on port ${port}`);
});
