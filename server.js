import express from "express";
require('dotenv').config();
import cors from 'cors';
import bodyParser from 'body-parser';
import initRoutes from "./src/routes";
import connect from './src/config/connectDB';


const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

initRoutes(app)
connect()



const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log("Server is running on port " + port)
})
