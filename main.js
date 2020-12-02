'use strict'

const WebSocket = require('ws')

const wss = new WebSocket.Server({port: 3000});
const Users = {};
const parseMessage = (str) => {
  return JSON.parse(str);
}
const registerUser = (user, socket) => {
  if (Users.hasOwnProperty(user)) {
  } else {
    Users[user] = {
      socket: socket,
      username: user,
      chats: []
    }
  }
}
const sendMessage = (msgObj) => {
  const str = JSON.stringify(msgObj)
  console.log(str)
  Users[msgObj.user].socket.send(str)
}
const execute = (payload, socket) => {
  const cmd = payload.command;
  switch (cmd) {
    case 'register':
      registerUser(payload.user, socket);
      break;
    case 'message':
      sendMessage(payload, socket);
      break;
  }
}

wss.on('connection', ws => {
  ws.on('message', str => {
    const msgObj = parseMessage(str);
    execute(msgObj, ws);
    console.log(str);
    console.log({Users})
  })
  const str = JSON.stringify({
    user: 'server',
    payload: {
      date: new Date().toLocaleTimeString(),
      message: 'Welcome to Chat!',
      side: 'income'
    }
  })
  ws.send(str);
})

console.log("server running")

