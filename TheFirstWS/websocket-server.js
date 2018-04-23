
const url = require('url');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
var clients = [{room: "broadcast", client: []}];
var clientsBroadcast = [];

wss.on('connection', function connection(ws, req) {

  console.log("Open connect socket");

  let location = url.parse(req.url,true);
  let arrParams = location.pathname.substring(1).split('/');
  let objParams = {room: arrParams[0], username: arrParams[1]};

  addClient(ws, objParams);

  broadcastOnline(0, objParams.username);
  addClientNew(0, ws, objParams.username)

  ws.on('message', function (msg) {

    console.log("Recieve message from client");

    if(msg){
      let clientsInRoom = searchRoom(objParams.room);
      let arrIndex = [];
      clientsInRoom.client.forEach(function each(client, index) {

        if(client.clientsWS.readyState === WebSocket.OPEN){
          let message = JSON.stringify({action: "msg",name: objParams.username,message: msg});
          client.clientsWS.send(message);
        }else{
          arrIndex.push(index);
        }

        console.log("Send message to client");

      });
      deleteClient(clientsInRoom, arrIndex);
    }
  });
});

function deleteClient(clientsInRoom,index){
  for(let i = 0; i < index.length; i++){
    let value = index[i] - i;
    clientsInRoom.client.splice(value,1);
  }
}

function addRoom(ws){
  if(ws.protocol){
    addClient(ws,ws.protocol);
  }else{
    console.log("Your room is null");
  }
}

function searchRoom(room){
  for(let i = 0; i < clients.length; i++){
    if(clients[i].room === room){
      return clients[i];
    }
  }
  return null;
}

function addClient(clientsWS, objParams){
  let isExistRoom = false;
  let room = objParams.room;
  let username = objParams.username;

  clients.forEach(function(item,index){
    if(item.room === room){
      let isExist = false;

      item.client.forEach(function(value){
        if(value.username === username && value.clientsWS.readyState === WebSocket.OPEN){
          isExist = true;
          return;
        }
      });
      
      if(!isExist){
        // item.client.push(clientsWS);
        item.client.push({username: username, clientsWS: clientsWS});
      }
      isExistRoom = true;
      return;
    }
  });

  if(!isExistRoom){
    clients.push({room: room, client: [{username: username, clientsWS: clientsWS}]});
  }
}


function addClientNew(ID, clientWebSocket, name){
  ID = clientsBroadcast.length + 1;
  console.log("add client ID : " + ID);
  console.log("add client name : " + name);
  clientsBroadcast.push({ID: ID, name: name, ws: clientWebSocket})
}

function searchClient(ID){
  for(let i = 0; i < clientsBroadcast.length; i++){
    if(clientsBroadcast[i].ID == ID){
      return clientsBroadcast[i];
    }
  }
  return null;
}

function broadcastOnline(ID, name){
  ID = clientsBroadcast.length + 1;
  for(let i = 0; i < clientsBroadcast.length; i++){
    let message = JSON.stringify({action: "online",name: name, ID: ID});
    console.log("broadcast online : " + message);
    clientsBroadcast[i].ws.send(message)
  }
}
module.exports = wss;