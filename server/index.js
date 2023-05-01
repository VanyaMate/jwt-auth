require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');


const PORT = process.env.PORT || 5000;
const app = express();

const start = function () {
    try {
        app.listen(PORT, () => console.log('Server started on', PORT));
    }
    catch (e) {
        console.log(`Server start error`, e);
    }
}

start();