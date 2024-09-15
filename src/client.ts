import { io } from "socket.io-client";
const url = window.location.hostname +  (import.meta.env.DEV ? ':3001' : ":8001")
const socket = io(url);
console.log("ws url",url,import.meta.env.DEV,window.location)
 socket.on("connection-ok", (id) => {
   console.log("made connection", id);
 });

export function clientRoomQuery(roomID, query, data) {
  socket.emit("room_query", roomID, query, data);
}
export function clientRoomResponse(callback) {
  // console.log(socket);
  socket.off("room_new_player");
  socket.off("room_empty");
  socket.off("room_response");
  socket.on("room_new_player", callback);
  socket.on("room_empty", callback);
  socket.on("room_response", callback);
  socket.on("room_response", callback);
}
export function clientRoomJoin(roomID) {
  socket.emit("room_join", roomID);
}
export function clientRoomLeave(roomID) {
  socket.emit("room_leave", roomID);
}
export function gameResponse(callback){
  socket.off("game_response");
  socket.on("game_response",callback);
}
export function getPlayersCount(){
  socket.emit("game_query","players_count")
}