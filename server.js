import express from "express";
require('dotenv').config();
import cors from 'cors';
import initRoutes from "./src/routes";
import connect from './src/config/connectDB';


const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initRoutes(app)
connect()



const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log("Server is running on port " + port)
})
