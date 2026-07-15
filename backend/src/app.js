const express = require('express');
const app = express();
const path = require("path");

require("dotenv").config();
const main = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const errorMiddleware = require('./middleware/errorMiddleware');

const authRouter = require('./routes/userAuthentication')
const userRouter = require('./routes/user.routes')
const teamRouter = require('./routes/teams.routes')
const workflowRouter = require('./routes/workflow.routes');
const requestRouter = require('./routes/request.routes');

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "http://localhost:4200", credentials: true}));

app.use('/employee', authRouter)
app.use('/user', userRouter)
app.use('/teams', teamRouter)
app.use('/workflow', workflowRouter)
app.use('/requests', requestRouter)

app.use(errorMiddleware)

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
