require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connect } = require('mongoose');
const router = require('./router/index');


const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

const start = async function () {
    try {
        await connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log('[MongoDB] Connected'));
        app.listen(PORT, () => console.log('[Server] Start on', PORT));
    }
    catch (e) {
        console.log(`[Server] Error`, e);
    }
}

start();