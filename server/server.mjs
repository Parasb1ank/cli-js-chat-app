import { Server } from "socket.io";

const io = new Server({/* Options */ } ); // Initialize Server
const PORT = 3000; // Port For Server to listen

/* 
 * On Successful Connection to server by client `connect` event signal is emitted
 * then on that active socket transaction or messaging b/w server client is performed
*/
io.on("connect", (socket) => { 
    socket.on("join", (data) => {
        console.log(`Client: ${data.sender} Connected [ ID: ${socket.id}  ]`);
        socket.broadcast.emit('join',data);
        socket.nickname = data.sender; // Add new property to socket for future use
        console.log(`Number of Clients: ${io.of("/").sockets.size}`);
    })
    // On disconnection of Client or Server `disconnect` event signal is emitted and reason for disconnection
    // is passed to given callback
    socket.on("disconnect", (reason) => {
        console.log(`\n[ INFO ] ${socket.nickname}(${socket.id}) disconnected, reason: ${reason}`);
    })

    // Message to broadcast is recieved from a client and broadcasted to other connected clients
    socket.on('b-data', (data) => { 
        console.log(data)
        socket.broadcast.emit("broadcast",data)
    });

    // Sends the Connected Clients List to Requested Client
    socket.on("list",(data) => {
        let users = [];
        for(const [key,value] of io.of('/').sockets ) {
            users.push(value.nickname);
        }
        socket.emit("list",{"sender":data.sender, "users":users } );
    });

    // Disconnects Client which execute `quit` command
    socket.on("quit", (data) => {
        console.log(`${data.sender} is quitting`);

        socket.broadcast.emit('quit',data);
        socket.disconnect(true);
    })
});

io.listen(PORT);
console.log(`Server is listening on port ${PORT} `);

