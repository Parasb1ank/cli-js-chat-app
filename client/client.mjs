import { io } from "socket.io-client"; 
import { createInterface } from "readline";

const socket = io('http://localhost:3000'); // Initialize Client by connecting to address of Server
const rl = createInterface({ 
    input: process.stdin,
    output: process.stdout,
});
const nickname = process.argv[2] ? process.argv[2] : "anonymous";

console.log("Connecting to the Server.....");

socket.on('connect', () => { 
    console.log(`[ INFO ]: Welcome ${nickname}`);
    
    socket.emit("join",{"sender":nickname});

    rl.on('line', (input) => {
        
        if (input === "ls!") {
            socket.emit("list",{"sender": nickname} );
        } else if (input === "q!") {
            socket.emit("quit",{"sender":nickname });
        } else {
            let data = { "sender": nickname,"msg": input }
            socket.emit('b-data',data); 
        }
    });
});

// Displays List of connected Clients
socket.on("list", (data) => { 
    console.log("[ INFO ]: List of Client Connected:");
    for(var i=0; i< data.users.length; i++) {
        console.log(`\t${i+1}. ${data.users[i]}`);
    }
});

// Displays Newly connected Client
socket.on('join',(data) => {
    console.log(`[ INFO ]: ${data.sender} has joined the chat`);
})

// Displays Broadcasted message recieved from server
socket.on("broadcast", (data) => {
    console.log(`${data.sender}: ${data.msg}`);
})

// Displays Disconnected Client INFO
socket.on("quit", (data) => {
    console.log(`[ INFO ]: ${data.sender} quit the chat`)
})

socket.on("disconnect", (reason) => { 
    console.log(`[ INFO ]: Client disconnected, reason: ${reason}`);
})
