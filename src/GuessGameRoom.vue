<script setup lang="ts">
import { ref, reactive } from "vue";
import Card from "./components/Card.vue";
import CardHand from "./components/CardHand.vue";
import {shuffleArray} from "./logic/generatePublicDeck"
import { clientRoomQuery, clientRoomResponse } from "./client";

const { roomID, deck } = defineProps<{ roomID: string; deck: CardData[] }>();

const chatbox = reactive({ from: "", to: "Choose your pokemon" });

const game = reactive<{
  state: string;
  infoCard: CardData | null;
  who: CardData | null;
  opWho: boolean | null;
  lives: number;
  opLives: number;
  selections: CardData[];
  opSelections: boolean[];
  opHover: boolean[];
}>({
  state: "select",

  who: null,
  lives: 3,
  selections: [...shuffleArray(deck)].map((c) => {
    return { ...c, flip: false };
  }),

  opWho: null,
  opLives: 3,
  opSelections: Array(20).fill(false),
  opHover: Array(20).fill(false),
});

clientRoomResponse((res, data) => {
  console.log("game", res, data);
  if (res === "chat") {
    chatbox.from = null;
    chatbox.to = data;
  }

  if (res === "room_empty") {
    game.state = "empty";
  }

  if (res === "op_hover" && game.opWho) {
    game.opHover[data.index] = data.card;
  }

  if (res === "card_new") {
    game.opWho = true;
  } else if (res === "card_flip")
    game.opSelections[data] = !game.opSelections[data];
  else if (res === "card_guess") {
    if (game.who.id === data.id) {
      console.log("op = correct guess");
      clientRoomQuery(roomID, "guess_yes");
      clientRoomQuery(roomID, "chat", "Correct!");
      game.state = "over";
    } else {
      console.log("op = wrong guess");
      clientRoomQuery(roomID, "guess_no", data.index);
      clientRoomQuery(roomID, "chat", "Incorrect!");
      game.opLives--;
      if (!game.opLives) game.state = "win";
    }
  } else if (res === "guess_yes") {
    console.log("self = correct guess");
    clientRoomQuery(roomID, "chat", "Opponent guessed correctly!");
    game.state = "win";
  } else if (res === "guess_no") {
    console.log("self = wrong guess");
    clientRoomQuery(roomID, "chat", "Opponent did not guess correctly!");
    game.lives--;
    game.state = "decide";
    game.selections[data].flip = !game.selections[data].flip;
    if (!game.lives) game.state = "over";
  }
});

function onCardHover(card: CardData, index: number) {
  game.infoCard = card
  if (game.state === "decide")
    clientRoomQuery(roomID, "op_hover", { card: card !== null, index });
}

function onSelection(card: CardData, index: number) {
  if (game.state === "select") {
    game.who = { ...card };
  } else if (game.state === "decide") {
    clientRoomQuery(roomID, "card_flip", index);
    game.selections[index].flip = !game.selections[index].flip;
  } else if (game.state === "guess" && !card.flip) {
    clientRoomQuery(roomID, "card_guess", { id: card.id, index });
  }
}
function selectNewCard() {
  if (game.opWho) {
    const text = "Game Started !";
    chatbox.from = null;
    chatbox.to = text;
    clientRoomQuery(roomID, "chat", text);
  } else {
    chatbox.from = null;
    chatbox.to = "Waiting for opponent...";
    clientRoomQuery(roomID, "chat", "Opponent Selected a pokemon");
  }
  if (game.who) {
    game.state = "decide";
    clientRoomQuery(roomID, "card_new", game.who);
  }
}

// socket.on('guess-wrong', wrongSelection)
// socket.on("guess-select", (index: number) => {
//   game.opSelections[index] = !game.opSelections[index];
// });

function decideGuess() {
  if (game.state !== "guess") {
    game.state = "guess";
    clientRoomQuery(roomID, "guess_think");
    chatbox.to = "Press a card to guess";
    chatbox.from = null;
    clientRoomQuery(roomID, "chat", "Opponent is guessing...");
  }
}
function cancelGuess() {
  if (game.state === "guess") {
    game.state = "decide";
    chatbox.to = "Guess cancelled ";
    chatbox.from = null;
    clientRoomQuery(roomID, "guess_stop_think");
    clientRoomQuery(roomID, "chat", "Opponent stopped guessing");
  }
}

function postChat() {
  clientRoomQuery(roomID, "chat", chatbox.from);
}
</script>

<template>
  <div
    v-if="game.state === 'win' || game.state === 'over'"
    class="end-screen list-down center"
  >
    <h1>{{ game.state }}</h1>
  </div>
  <div v-else-if="game.state === 'empty'" class="end-screen list-down center">
    <h1>Looks like the opponent left :/</h1>
  </div>
  <div v-else class="game-area">
    <form class="chat gallery center" @submit.prevent="postChat">
      <label for="chatbox">Chat:</label>
      <input
        id="chatbox"
        type="text"
        required
        v-model="chatbox.from"
        :placeholder="chatbox.to"
      />
      <button :disabled="!game.opWho" type="submit">Send</button>
    </form>

    <section class="field pane other-player">
      <div class="controls">
        <ul class="lives">
          <li v-for="live in game.opLives" class="life">❤</li>
        </ul>
        <Card v-if="game.opWho" class="ready-selection" />
      </div>
      <CardHand :hovers="game.opHover" :cards="game.opSelections" />
    </section>

    <section class="field pane current-player">
      <div class="controls">
        <div class="who pane list-down center">
          <h1>Selection:</h1>
          <Card
            :cardData="game.infoCard"
            :face-down="false"
          />

          <h1>Lives:</h1>
          <ul class="lives">
            <li v-for="live in game.lives" class="life">❤</li>
          </ul>

          <h1>Selection:</h1>
          <div class="guess">
            <button
              v-if="game.state === 'select'"
              @click="selectNewCard"
              :disabled="!game.who"
            >
              Select
            </button>
            <button
              v-if="game.state === 'decide' && game.opWho"
              @click="decideGuess"
            >
              Guess
            </button>
            <button v-if="game.state === 'guess'" @click="cancelGuess">
              Cancel
            </button>
          </div>
          <Card
            :class="{ 'ready-selection': game.state !== 'select' }"
            :cardData="game.who"
          />
        </div>
      </div>
      <CardHand
        :onSelect="onSelection"
        :onHover="onCardHover"
        :cards="game.selections"
      />
    </section>
  </div>
</template>

<style scoped>
.current-player,
.current-player .controls,
.current-player .hand,
.current-player .who,
.current-player .controls > * {
  transform-style: preserve-3d;
}

.game-area {
  perspective: 1000px;
  display: grid;
  place-items: center;
  grid-template-areas: "chat" "field";
}

.other-player {
  grid-area: field;
  transform: translateY(-20%) translateY(-35%) translateZ(-1000px);
}
.current-player {
  grid-area: field;
  transform: translateY(35%) translateZ(-500px) rotateX(60deg);
}

.current-player .controls .who {
  position: absolute;
  margin-right: 3rem;
  transform: translateY(50%) rotateX(-60deg) translateY(-60%);
}
.current-player .hand:deep(.holder) {
  transform: rotateX(-60deg) translateY(-100%);
}

.hand:deep(.card) {
  transition:
    filter 0.5s,
    transform 0.5s;
}
.current-player .hand:deep(.card:hover) {
  transform: translateY(-8rem);
  filter: drop-shadow(0 0 10px green);
}

.other-player .hand:deep(.card.discard) {
  filter: brightness(0.4);
}

.ready-selection:deep(.face-front) {
  filter: brightness(0.1) blur(10px);
}
.ready-selection:hover:deep(.face-front) {
  filter: none;
}

.field {
  padding: 1rem;
  /* margin: 1rem; */
  display: flex;
  width: max-content;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: lightcyan;
}
.lives {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
.life {
  font-size: 2rem;
  color: red;
  margin-inline: 3px;
}

.who {
  padding: 1rem;
}

.hand {
  display: grid;
  place-items: top;
  grid-template-columns: repeat(5, auto);
  grid-auto-rows: 6rem;
  margin-bottom: 10rem;
}

.current-player .hand {
  grid-auto-rows: 10rem;
  margin-bottom: 0;
}

.other-player .controls {
  align-items: center;
  justify-content: center;
  /* flex-direction: column-reverse; */
}

.end-screen {
  color: white;
  font-size: 2rem;
  text-transform: capitalize;
}

.chat {
  color: lightcyan;
}
</style>
