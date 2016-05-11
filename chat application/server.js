var express = require('express');
var http = require('http');
var io = require('socket.io');


var app = express();
app.use(express.static('./public'));

//Specifying the public folder of the server to make the html accesible using the static middleware

var server = http.createServer(app).listen(8124);
console.log("server running");


var clients = [];
var usernamelist = [];


//Server listens on the port 8124
io = io.listen(server);
/*initializing the websockets communication , server instance has to be sent as the argument */

io.sockets.on("connection", function(socket) {


    console.log('Socket.io Connection with the client established ' + socket.id);

    clients.push(socket.id);



    socket.on("message", function(msg) {

        /*This event is triggered at the server side when client sends the data using socket.send() method */
        //data = JSON.parse(data);

        console.log('msg received ', msg);


        console.log(IsJsonString(msg));

        if (IsJsonString(msg)) {

            data = JSON.parse(msg);
            var fromuser;
            var touser;
            var msgsend;
            for (key in data) {
                console.log(key + " - " + data[key]);
                if (key == "username") {
                    usernamelist[socket.id] = data[key];
                    name = data[key];
                }
                if (key == "from_to") {
                    var arr = data["from_to"].split("_");
                    fromuser = arr[0];
                    touser = arr[1];
                }

                if (key == "msg_send") {
                    msgsend = data[key];
                }

            }
            var from_socketid;
            var to_socketid;
            if (typeof fromuser != "undefined") {
                console.log("from - " + fromuser + " to user- " + touser + " msg send - " + msgsend);

                for (keys in usernamelist) {
                    if (usernamelist[keys] == fromuser) {
                        from_socketid = keys;
                    } else if (usernamelist[keys] == touser) {
                        to_socketid = keys;
                    }
                    var new_msg = {
                        data: fromuser + " : " + msgsend,
                        from_to: fromuser + "_" + touser
                    }



                }

                console.log("msg send to - " + to_socketid + " and to - " + from_socketid);

                io.to(to_socketid).emit("chat_send", JSON.stringify(new_msg));
                io.to(from_socketid).emit("chat_send", JSON.stringify(new_msg));
            } else {



                var items = Object.keys(clients);
                items.forEach(function(item) {

                    var onlineuser = [];

                    for (keys in usernamelist) {
                        if (keys != clients[item]) {
                            onlineuser.push(usernamelist[keys]);
                        }
                    }

                    var new_client = {
                        data: "New user " + name + " has connected",
                        userlist: onlineuser
                    }

                    var new_client_data = {
                        data: name + " welcome to chat application. You have logged in succesfully!!",
                        userlist: onlineuser
                    }


                    if (clients[item] != socket.id) {

                        io.to(clients[item]).emit("message", JSON.stringify(new_client));
                    } else {
                        io.to(clients[item]).emit("message", JSON.stringify(new_client_data));
                    }
                });

            }




        } else {
            /*Printing the data */
            var ack_to_client = {
                data: usernamelist[socket.id] + " : " + msg
            }
            //socket.send(JSON.stringify(ack_to_client)); 
            var items = Object.keys(clients);
            items.forEach(function(item) {

                var onlineuser = [];

                for (keys in usernamelist) {
                    if (keys != clients[item]) {
                        onlineuser.push(usernamelist[keys]);
                    }
                }

                var ack_to_client = {
                    data: usernamelist[socket.id] + " : " + msg,
                    userlist: onlineuser
                }



                io.to(clients[item]).emit("message", JSON.stringify(ack_to_client));
            });

        }

        /*Sending the Acknowledgement back to the client , this will trigger "message" event on the clients side*/
    });

    socket.on("disconnect", function(s) {



        console.log(usernamelist[socket.id] + " user has disconnected");


        var disconnecteduser = usernamelist[socket.id];


        for (var i = clients.length - 1; i >= 0; i--) {
            if (clients[i] === socket.id) {
                clients.splice(i, 1);

                delete usernamelist[socket.id];
            }
        }



        var items = Object.keys(clients);
        items.forEach(function(item) {
            if (clients[item].length > 0) {

                var onlineuser = [];

                for (keys in usernamelist) {
                    if (keys != clients[item]) {
                        onlineuser.push(usernamelist[keys]);
                    }
                }


                var new_client_disconnecetd = {
                    data: disconnecteduser + " user has disconnected",
                    userlist: onlineuser,
                    disconnected_user: disconnecteduser
                }

                console.log("send data to - " + clients[item]);
                io.to(clients[item]).emit("user_disconnect", JSON.stringify(new_client_disconnecetd));
            }
        });
    });

});

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}