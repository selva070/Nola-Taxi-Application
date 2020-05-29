const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
global.io = io; //Global Declaration Socket

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');


const db = require("./models");

db.mongoose
    .connect(process.env.MONGO_DD, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        // storeLessonWatchedDuration();

        // initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


app.use(express.static(path.join(`${__dirname}`)))

const routes = require('./routes');

//app.get('/', (req, res) => res.send('Hello World!'))

app.use(function (req, res, next) {

    //res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "http://localhost:3006");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(cors());
app.use(routes);

server.listen(process.env.APP_PORT, () => console.log(`Example app listening on port ${process.env.APP_PORT}!`))