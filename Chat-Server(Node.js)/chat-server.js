//references used:
// https://www.youtube.com/watch?v=jD7FnbI76Hg&t=1054s
//referred to this for code required for single-room interaction

// https://socket.io/get-started/chat
//referred to this for basic socket io operation

// https://socket.io/docs/v3/rooms/
//reference for room related operation


// Require the packages we will use:
const http = require("http"),
    fs = require("fs");
const { emit } = require("process");

const port = 3456;
const file = "client.html";
// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html, on port 3456:
const server = http.createServer(function (req, res) {
    // This callback runs when a new connection is made to our HTTP server.

    fs.readFile(file, function (err, data) {
        // This callback runs when the client.html file has been read from the filesystem.

        if (err) return res.writeHead(500);
        res.writeHead(200);
        res.end(data);
    });
});
server.listen(port);


const moment = require('moment');


// Import Socket.IO and pass our HTTP server object to it.
const socketio = require("socket.io")(http, {
    wsEngine: 'ws'
});


function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
};
const botName = "Chat Bot";


// Attach our Socket.IO server to our HTTP server to listen
const io = socketio.listen(server);

let users = [];
// let rooms = ["public"];
let publicRoom = { roomName: "public", roomCreator: "", roomPassword: "" };
let rooms = [];
rooms.push(publicRoom);

//join user to chat. create a user object and push to arr
function userJoin(id, username, room, arrayOfBannedRooms) {
    let user = { id, username, room, arrayOfBannedRooms };
    users.push(user);
    return user;
}

//function for creating a new room
function createNewRoom(newRoomName, username, password) {
    let duplicateExists = false;
    for (let i = 0; i < rooms.length; ++i) {
        if (rooms[i].roomName == newRoomName) {
            duplicateExists = true;
        }
    }

    if (duplicateExists) {
        return false;
    }
    else {
        let newRoom = {
            "roomName": newRoomName,
            "roomCreator": username,
            "roomPassword": password
        };

        rooms.push(newRoom);

        console.log(rooms);
        return true;
    }

}

//get current user object by id
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//remove user upon disconnect
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//get all users of room
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

//function for getting the room object by its name
function getRoomObject(roomString) {
    for (let i = 0; i < rooms.length; ++i) {
        if (rooms[i].roomName == roomString) {
            return rooms[i];
        }
    }
};

io.sockets.on("connection", function (socket) {
    // This callback runs when a new Socket.IO connection is established.


    //duplicate username check
    socket.on('check-for-duplicate-username', function (username) {
        let usernameAvailable = true;
        for (let i = 0; i < users.length; ++i) {
            if (users[i].username == username) {
                usernameAvailable = false;

            }
        }

        socket.emit("username-already-exists", usernameAvailable);


    });


    // event for joining room
    socket.on('join-room', function ({ username, room }) {

        let arrBannedRooms = [];

        let user = userJoin(socket.id, username, room, arrBannedRooms);
        //join room
        socket.join(user.room);


        // welcome current user
        socket.emit('message', formatMessage(botName, '[you have joined the "public" room]'));


        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `[${user.username} has joined the chat]`));
        console.log("current room is " + room);


        //send users and room info upon joining
        io.to(user.room).emit('room-users', { room: user.room, users: getRoomUsers(user.room) });
    });


    //event for switching room
    socket.on('switch-room', function (room) {
        let user = getCurrentUser(socket.id);

        let isBanned = false;
        for (let i = 0; i < user.arrayOfBannedRooms.length; ++i) {
            if (room == user.arrayOfBannedRooms[i]) {
                console.log("YOU ARE BANNED FROM THIS ROOM");
                isBanned = true;
            }
        }

        if (isBanned) {
            socket.emit('you-are-banned-alert');
        }
        else {
            if (user.room != room) {


                let roomIsPrivate = false;
                for (let i = 0; i < rooms.length; ++i) {
                    if (rooms[i].roomName == room && rooms[i].roomPassword != '') {
                        console.log("this room is password protected");
                        roomIsPrivate = true;
                        socket.emit('verify-password', room);
                    }
                }

                if (!roomIsPrivate) {

                    let roomObject = getRoomObject(room);
                    if (user.username == roomObject.roomCreator) {
                        socket.emit('is-creator');
                    }
                    else {
                        socket.emit('is-not-creator');
                    }


                    let previousRoom = user.room;
                    let currentRoom = room;


                    socket.leave(user.room);
                    user.room = room;


                    socket.join(user.room);

                    //welcome current user
                    socket.emit('message', formatMessage(botName, `[you switched to ${user.room}]`));


                    //broadcast when a user connects
                    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `[${user.username} has joined the chat]`));
                    console.log("current room is " + room);


                    //send users and room info upon joining
                    // io.emit('room-users', {room: user.room, users: getRoomUsers(user.room)});

                    io.emit('update-room-users-after-user-switches', {});

                    socket.broadcast.to(previousRoom).emit('update-room-users-after-user-switches-previous', { previousRoom: previousRoom, users: getRoomUsers(previousRoom) });
                    socket.broadcast.to(previousRoom).emit('message', formatMessage(botName, `[${user.username} has left the chat]`));



                    io.sockets.in(currentRoom).emit('update-room-users-after-user-switches-current', { currentRoom: currentRoom, users: getRoomUsers(currentRoom) });
                }
            }
        }


    });


    //event for entering private room
    socket.on('password-entered', function ({ enteredPassword, room }) {
        const user = getCurrentUser(socket.id);
        let passwordIsCorrect = false;
        for (let i = 0; i < rooms.length; ++i) {
            if (rooms[i].roomName == room && rooms[i].roomPassword == enteredPassword) {
                passwordIsCorrect = true;
            }
        }


        if (passwordIsCorrect) {
            console.log("CORRECT PASSWORD");

            let roomObject = getRoomObject(room);
            if (user.username == roomObject.roomCreator) {
                socket.emit('is-creator');
            }
            else {
                socket.emit('is-not-creator');
            }

            let previousRoom = user.room;
            let currentRoom = room;


            socket.leave(user.room);
            user.room = room;


            socket.join(user.room);

            //welcome current user
            socket.emit('message', formatMessage(botName, `[Correct password! You switched to ${user.room}]`));


            //broadcast when a user connects
            socket.broadcast.to(user.room).emit('message', formatMessage(botName, `[${user.username} has joined the chat]`));
            console.log("current room is " + room);




            io.emit('update-room-users-after-user-switches', {});

            socket.broadcast.to(previousRoom).emit('update-room-users-after-user-switches-previous', { previousRoom: previousRoom, users: getRoomUsers(previousRoom) });
            socket.broadcast.to(previousRoom).emit('message', formatMessage(botName, `[${user.username} has left the chat]`));



            io.sockets.in(currentRoom).emit('update-room-users-after-user-switches-current', { currentRoom: currentRoom, users: getRoomUsers(currentRoom) });
        }
        else {
            socket.emit('alert-wrong-password');
        }
    });




    // listen for chat-message
    socket.on('chat-message', function (msg) {
        console.log("message:" + msg);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })



    // listen for private message
    socket.on('send-private-message', function ({ privateMessageTarget, privateMessageContent }) {
        let user = getCurrentUser(socket.id);
        console.log(`privateMessageTarget is ${privateMessageTarget} and privateMessageContent is ${privateMessageContent}`);
        let targetID;

        for (let i = 0; i < users.length; ++i) {
            if (users[i].username == privateMessageTarget) {
                targetID = users[i].id;
            }
        }

        socket.to(targetID).emit("message", formatMessage(user.username, "[private] " + privateMessageContent));
        socket.emit("message", formatMessage(botName, "[private message successfully sent]"));

    });



    //list out all rooms
    io.emit('list-all-rooms', rooms.map(({ roomName }) => roomName));



    // // listen when user wants to create a new room
    socket.on('create-new-room', function ({ newRoomName, username, newRoomPassword }) {
        const user = getCurrentUser(socket.id);
        console.log(user.username + " wants to create a new room with the name " + newRoomName + " with the password " + newRoomPassword);

        if (createNewRoom(newRoomName, username, newRoomPassword)) {
            io.emit('list-all-rooms', rooms.map(({ roomName }) => roomName));
            // console.log("hehe " + rooms);
        }
        else {
            socket.emit('duplicate-room');
        }

    });


    //event for kicking a user
    socket.on('kick-user', function (kickTarget) {
        const user = getCurrentUser(socket.id);
        let kickTargetID;
        for (let i = 0; i < users.length; ++i) {
            if (users[i].username == kickTarget) {
                kickTargetID = users[i].id;
                users[i].room = "public";
            }
        }



        io.sockets.connected[kickTargetID].leave(user.room);
        io.sockets.connected[kickTargetID].join("public");


        //to creator and creator's room:
        io.sockets.to(user.room).emit('update-room-users-after-user-switches-previous', { previousRoom: user.room, users: getRoomUsers(user.room) });
        io.sockets.to(user.room).emit('message', formatMessage(botName, `[${kickTarget} was kicked out]`));


        //to the kicked user:
        io.sockets.in("public").emit('update-room-users-after-user-switches-current', { currentRoom: "public", users: getRoomUsers("public") });
        socket.to("public").emit('message', formatMessage(botName, `[${kickTarget} was kicked out and was placed to the public room.]`));
    });

    //event for banning user
    socket.on('ban-user', function (banTarget) {
        const user = getCurrentUser(socket.id);
        let banTargetID;
        for (let i = 0; i < users.length; ++i) {
            if (users[i].username == banTarget) {
                banTargetID = users[i].id;
                users[i].room = "public";
                users[i].arrayOfBannedRooms.push(user.room);
            }
        }


        io.sockets.connected[banTargetID].leave(user.room);
        io.sockets.connected[banTargetID].join("public");


        //to creator and creator's room:
        io.sockets.to(user.room).emit('update-room-users-after-user-switches-previous', { previousRoom: user.room, users: getRoomUsers(user.room) });
        io.sockets.to(user.room).emit('message', formatMessage(botName, `[${banTarget} was banned from this room.]`));


        //to the banned user:
        io.sockets.in("public").emit('update-room-users-after-user-switches-current', { currentRoom: "public", users: getRoomUsers("public") });
        socket.to("public").emit('message', formatMessage(botName, `[${banTarget} was banned from ${user.room} and was placed to the public room.]`));

    });

    //event for blocking user
    socket.on('block-user', function (blockTarget) {
        const user = getCurrentUser(socket.id);
        socket.emit('add-block-list', blockTarget);
        socket.emit('message', formatMessage(botName, `[you have blocked ${blockTarget}. All messages sent by ${blockTarget} will now be censored.]`));
    });

    //runs when client disconnects
    socket.on('disconnect', function () {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`)); // broadcast to everyone
        }

        //send users and room info upon leaving
        io.to(user.room).emit('room-users', { room: user.room, users: getRoomUsers(user.room) });
    });

});