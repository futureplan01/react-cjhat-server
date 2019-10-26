const express = require('express');
const cors = require('cors');
const db = require('./model/connectDB');
const bodyParser = require('body-parser');
const routes = require('./routes/api');
const app = express();
let port = process.env.PORT || 7555;

db.connect();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use((req,res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
})
app.use('/',routes);
const server = app.listen(port,()=>{
    console.log("Server running on http://localhost:" + port);
})


const io = require("socket.io").listen(server);

io.on("connection", (client)=>{
    console.log("a user is connected");
    client.on("disconnect", ()=>{
        console.log("user has disconnected");
    });
    client.on("server", msg =>{
        client.broadcast.emit("user", msg);
        console.log(msg);
    });
})


