<script setup>
import {
  clientRoomJoin,
  clientRoomLeave,
  clientRoomQuery,
  clientRoomResponse,
  gameResponse,
  getPlayersCount,
} from "./client";
import generatePublicDeck from "./logic/generatePublicDeck";
import { ref, reactive } from "vue";
import TestRoom from "./TestRoom.vue";
import GuessGameRoom from "./GuessGameRoom.vue";

const playersCount = ref()
const gameRoom = reactive({
  code: null,
  input: null,
  state: null,
  players: { current: 0, max: 2 },
  deck: null,
});

gameResponse((res, data)=>{
  if( res === 'players_count'){
    console.log("Players", data)
    playersCount.value = data
  }
})

clientRoomResponse((res, data) => {
  console.log("response", res, data);
  if (res === "room_leave_player") {
    gameRoom.players.current = data.players;
  }
  if (res === "room_new_player") {
    gameRoom.players.current = data.players;
    if (data.players === gameRoom.players.max) {
      gameRoom.state = "ready";
      console.log("new deck");
      generatePublicDeck(20).then((deck) => {
        gameRoom.deck = deck;
        clientRoomQuery(gameRoom.code, "room_new_deck", deck);
      });
    } else if (data.players > gameRoom.players.max) {
      console.log("server full!");
      clientRoomLeave(gameRoom.code);
      gameRoom.state = "full";
    }
  }
  if (res === "room_empty") {
    gameRoom.state = "empty";
    gameRoom.players.current = 0;
  }

  if (res === "room_new_deck") {
    console.log("set new deck");
    gameRoom.deck = data;
  }
});

function joinGuessGame(newGame) {
  if (!gameRoom.input || newGame) {
    gameRoom.code = Date.now() + "";
  } else {
    gameRoom.code = gameRoom.input;
  }

  gameRoom.state = "waiting";
  clientRoomJoin(gameRoom.code);
}

function leaveGame() {
  gameRoom.code = null;
  gameRoom.input = null;
  gameRoom.state = null;
  gameRoom.players.current = 0;
}

getPlayersCount()
</script>

<template>
  <div class="menu list-down center" v-if="gameRoom.state !== 'ready'">
    <header class="list-down">
      <img
        src="https://external-preview.redd.it/tQged7mKJ3cUpNMq5IMeceZvyKP3cTyHqhNmKEQ0Vv8.png?width=640&crop=smart&auto=webp&s=5fc89334e792e2c9b294d1d328bf522cdede4cdf"
      />
      <h1>Guess Who!</h1>
      <h3 v-if="playersCount">Players online: {{ playersCount }}</h3>
    </header>
    <div v-if="!gameRoom.state" class="start list-down">
      <div class="gallery center">
        <form
          @submit.prevent="joinGuessGame(!gameRoom.input)"
          class="list-down"
        >
          <button type="submit">
            {{ gameRoom.input ? "Connect" : "Start New Room" }}
          </button>
          <label for="inputField">Join Existing / Name Custom Game:</label>
          <input type="text" id="inputField" v-model="gameRoom.input" />
        </form>
      </div>
    </div>

    <div
      v-else-if="gameRoom.state === 'waiting'"
      class="room-code list-down center"
    >
      <div class="gallery center">
        <h1>Room Code</h1>
        <button
          @click="
            async () => {
              await navigator.clipboard.writeText(gameRoom.code);
            }
          "
        >
          {{ gameRoom.code }}
        </button>
      </div>
      <h2>
        {{ gameRoom.players.current }} / {{ gameRoom.players.max }} - Waiting
        for others...
      </h2>
      <button @click="leaveGame">Cancel</button>
    </div>

    <template v-else-if="gameRoom.state === 'empty'">
      <h1>All players left :/</h1>
      <button @click="leaveGame">Leave</button>
    </template>

    <template v-else-if="gameRoom.state === 'full'">
      <h1>Game is full!</h1>
      <button @click="leaveGame">Try another</button>
    </template>
  </div>
  <GuessGameRoom
    v-else-if="gameRoom.deck"
    :deck="gameRoom.deck"
    :roomID="gameRoom.code"
  />
</template>

<style scoped>
.menu {
  height: 100vh;
  height: 100dvh;

  color: lightcyan;
  /* background: lightcyan; */
}

.menu img {
  width: 100%;
  padding: 1rem;
}

.start {
  display: flex;
  gap: 2rem;
  /* flex-direction: column; */
  align-items: center;
}

.room-code {
}
</style>
