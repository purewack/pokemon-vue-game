<script setup lang="ts">
import cardback from "./Cardback.jpeg?inline"
const cardjpeg = `url(${cardback})`

const props = defineProps<{
  cardData?: CardData | null;
  faceDown?: boolean;
}>();
const types = {
  grass: "#5fbd58",
  bug: "#92bc2c",
  dark: "#595761",
  dragon: "#0c69c8",
  electric: "#f2d94e",
  fairy: "#ee90e6",
  fighting: "#d3425f",
  fire: "#dc872f",
  flying: "#a1bbec",
  ghost: "#5f6dbc",
  ground: "#da7c4d",
  ice: "#75d0c1",
  normal: "#a0a29f",
  poison: "#b763cf",
  psychic: "#ff2ca8",
  rock: "#a38c21",
  steel: "#5695a3",
  water: "#539ddf",
};
</script>

<template>
  <div class="card">
    <div class="object" :class="{ flip: cardData?.flip || !cardData }">
      <div v-if="cardData && !faceDown" class="face-front">
        <img class="sprite" :src="cardData.sprite" />
        <p class="name">{{ cardData.name }}</p>
        <ul class="types">
          <li
            class="type"
            v-for="type in cardData.types"
            :style="{ 'background-color': types[type] }"
          >
            {{ type }}
          </li>
        </ul>
      </div>

      <div class="face-back"></div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nova+Square&display=swap");
.name {
  text-transform: capitalize;
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
}
.types {
  list-style: none;
  padding: 0;
  margin: 0;
}
.type {
  text-transform: uppercase;
  font-size: 0.75rem;
  margin: 0.25rem;
  padding: 0.25rem;
  padding-inline: 0.5rem;
  border-radius: 1rem;
  text-align: center;
}

.card {
  --scale: 3.7rem;
  --bradius: 0.7rem;
  margin: 0.5rem;
  display: inline-block;
  padding: 0;
  perspective: 500px;
  font-family: "Nova Square", sans-serif;
}

.object {
  position: relative;
  box-sizing: border-box;
  width: calc(2.75 * var(--scale));
  height: calc(4 * var(--scale));
  transition: transform 1000ms;
  transform-style: preserve-3d;
  padding: 0;
  display: grid;
  grid-template-areas: "abs";
  outline: solid gray 1px;
  border-radius: var(--bradius);
}

.flip {
  transform: rotateY(180deg);
}

.face-front {
  grid-area: abs;
  box-sizing: border-box;
  border: solid gold 0.5rem;
  border-radius: var(--bradius);
  background: var(--theme, ivory);
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.sprite {
  margin-block: 0.25rem;
  border: solid gold;
  border-radius: 1rem;
  object-fit: contain;
  width: 90%;
  aspect-ratio: 4 / 3;
}
.face-back {
  grid-area: abs;
  box-sizing: border-box;
  border: solid darkblue 1px;
  border-radius: var(--bradius);
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 0;
  transform: translateZ(-1px) rotateY(180deg);
  backface-visibility: hidden;
}
.face-back {
  content: v-bind(cardjpeg);
}
</style>
