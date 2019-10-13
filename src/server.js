const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {};

mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack-bhjpw.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
    /*socket.on('omi', data => {
        console.log(data);
    });*/

    /*setTimeout(() => {
        socket.emit('hello', 'World');
    }, 4000);*/
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, 'uploads')));
app.use(routes);

server.listen(3333);

// get, post, put, delete

// req.query = acessar query params (para filtros)
/*app.get('/users', (req, res) =>{
    return res.json({ idade: req.query.idade });
});*/

// req.params = acessar route params (para edição e delete)
/*app.put('/users/:id', (req, res) =>{
    return res.json({ id: req.params.id });
});*/

// req.body = acessar corpo da requisição (para criação, edição)
/*app.post('/users', (req, res) =>{
    return res.json(req.body);
});*/