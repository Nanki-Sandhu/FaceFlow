
import { Server } from "socket.io";
let connections = {}
let messages = {}
let timeOnline = {}

   const connectToSocket = (server) => {
    const io = new Server(server,{
        cors:{
            origin:"*",
            methods:["GET","POST"],
            allowedHeaders:["*"],
            credentials:true
        }
    });
    // Listens for incoming socket connections
    io.on("connection", (socket) => {
        // When a client emits a 'join-call' event with a specific 'path', this handler is triggered
        console.log("Something connected");
        socket.on("join-call", (path) => {
            // If there are no existing connections for this 'path', create an empty array to hold the socket IDs
            if (connections[path] === undefined) {
                connections[path] = [];
            }
            // Add the current socket's ID to the array of connected clients for this 'path'
            connections[path].push(socket.id);
            //console.log(`Client ${socket.id} joined path: ${path}`);
            
            // Record the current time as the time the socket joined the server (time online)
            timeOnline[socket.id] = new Date();
            // Loop through all the sockets currently connected to this 'path' (call/room)
            for (let a = 0; a < connections[path].length; a++) {
                // Emit the 'user-joined' event to all clients in the 'path', notifying them of the new user
                //console.log("Total: "+connections[path][a]);
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }
        })

        // Listen for the "signal" event emitted by a client
        socket.on("signal", (toId, messages) => {
            // Forward the "signal" event to the target client (identified by 'toId')
            io.to(toId).emit("signal", socket.id, messages);
        });

        // Listen for a "chat-message" event emitted by a client
        socket.on("chat-message", (data, sender) => {
            // Iterate over all rooms (keys) in the 'connections' object to find the room the sender belongs to.
            const [matchingRoom, found] = Object.entries(connections).reduce(([room, isFound], [roomKey, roomValue]) => {
               // console.log("Iterating room:", roomKey, "with value:", roomValue); 
                if (!isFound && roomValue.includes(socket.id)) {
                    return [roomKey, true];
                }
                return [room, isFound];
            }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }
                // Add the new chat message to the message history for that room
                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                //console.log("message", matchingRoom, ":", sender, data);
                 // Loop through each socket ID in the current room and emit the "chat-messages" event to them
                connections[matchingRoom].forEach(element => {
                    // Emit the message to each client in the room
                    io.to(element).emit("chat-messages", data, sender, socket.id)
                });
            }

        });

        socket.on("disconnect", () => {
            // 1. Calculate the time difference between when the socket joined and when it disconnected
            var diffTime = Math.abs(timeOnline[socket.id] - new Date());
            
            var key;  // To store the key (room) where the socket was connected
            
            // 2. Loop through the connections object to find which room the socket was in
            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                // 'k' is the room key, and 'v' is the array of socket IDs in that room
                
                // 3. Check if the current socket ID is in the current room (v)
                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k;  // Set 'key' to the room name where the socket was found
                        
                        // 4. Notify all users in the room that this socket has left
                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit('user-left', socket.id);  // Emit "user-left" event
                        }
                        
                        // 5. Remove the socket from the room's list of connected sockets
                        var index = connections[key].indexOf(socket.id);  // Find the index of the socket
                        connections[key].splice(index, 1);  // Remove the socket from the array
                        
                        // 6. If the room is now empty, delete the room from the 'connections' object
                        if (connections[key].length === 0) {
                            delete connections[key];  // Remove the room from 'connections'
                        }
                    }
                }
            }
        });
    });
}
export default connectToSocket;