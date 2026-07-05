const express = require('express');
const app = express();
const path = require("path");

require("dotenv").config();
const main = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const authRouter = require('./routes/userAuthentication')

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));

app.use('/employee', authRouter)

const healthRoutes = require("./routes/health.routes");
app.use("/api/health", healthRoutes);

const initializeConnection = async () => {
    try {
        await main(); // Mongo
        console.log(" DB Connected");

        app.listen(process.env.PORT, () => {
            console.log('Server Running: '+process.env.PORT);
        });

    } catch (err) {
        console.log(" Error:", err.message);
    }
};
initializeConnection()
