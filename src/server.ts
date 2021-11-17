import express from 'express'
import * as http from 'http'
import ejs from 'ejs'
import {Server} from 'socket.io'

const app = express();
const server = http.createServer(app);
const port = 3000;
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
})

io.on('connection', (socket) => {
    console.log('a user connected');
})

server.listen(port, () => {
    console.log(`Listenning on ${port}`);
});


