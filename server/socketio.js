import { Server } from "socket.io";


export function socketServer(port){
const io = new Server(port || 3001, {
  cors: { origin: "*" },
});

io.on("connection", function (socket) {
  
  function getRoomSize(room) {
    return io.of("/").adapter.rooms.get(room)?.size;
  }

  socket.on("marko", () => {
    io.emit("polo");
  });

  console.log("[socket-server]: connecting (" + socket.id + ")");
  io.to(socket.id).emit("connection-ok", socket.id);

  socket.on("disconnecting", () => {
    console.log("[socket-server]: [" + socket.id + "] disconnecting");
    socket.rooms.forEach((r) => {
      if (r !== socket.id) {
        const players = getRoomSize(r);
        io.to(r).emit("room_leave_player", "room_leave_player", {
          left: socket.id,
          players,
        });

        if (players === 2) {
          io.to(r).emit("room_empty", "room_empty");
        }
      }
    });
  });

  socket.on("room_join", (roomID) => {
    const room = roomID + "";
    socket.join(room);

    const players = getRoomSize(room);
    console.log("[socket-server]: new room player", players);
    io.to(room).emit("room_new_player", "room_new_player", { players });

    console.log(
      "[socket-server]: [" + socket.id + "]" + "new connection to room:",
      room,
      io.of("/").adapter.sids,
    );
  });

  socket.on("room_leave", (roomID) => {
    const room = roomID + "";
    socket.leave(room);
    console.log(
      "[socket-server]: [" + socket.id + "]" + "leave connection to room:",
      room,
      io.of("/").adapter.sids,
    );
  });

  socket.on("room_query", (roomID, query, data) => {
    // console.log("Q [" + socket.id + "]", query, data);
    socket.to(roomID).emit("room_response", query, data);
  });

  socket.on("room_players", (roomID) => {
    const room = roomID + "";
    socket.emit("room_players", getRoomSize(room));
  });

  socket.on("game_query", (query)=>{
    if(query === "players_count"){
      const players = io.engine.clientsCount
      socket.emit("game_response","players_count",players)
      console.log("[game query] online players:",players)
    }
  })
});
}