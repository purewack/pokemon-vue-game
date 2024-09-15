<script setup lang="ts">
import { ref, reactive } from "vue";
import CardStack from "./components/CardStack.vue";
import generatePublicDeck from "./logic/generatePublicDeck";

const loading = ref(true);

const player = reactive({
  id: 0,
  cards: [],
});
const opponents = ref([
  {
    hand: 5,
  },
  {
    hand: 5,
  },
]);

const graveDeck = ref(0);
const publicDeck = ref<CardData[]>([]);
const currentStack = ref([]);

const blocked = ref(false);

const initGame = async () => {
  loading.value = true;
  publicDeck.value = await generatePublicDeck(20);
  loading.value = false;
};
initGame();
</script>

<template>
  <p v-if="loading">Loading...</p>

  <template v-else>
    <section class="opponents">
      <h2>Opponents</h2>
      <ul class="players">
        <li v-for="op in opponents">
          <CardStack :cards="op.hand" />
        </li>
      </ul>
    </section>
    <section class="snap-area">
      <CardStack class="public" :showCards="true" :cards="publicDeck" />
    </section>
    <section class="self">
      <h2>My Hand</h2>
      <div class="controls">
        <button v-if="blocked">Draw Card</button>
      </div>
      <CardStack :cards="publicDeck" />
    </section>
  </template>
</template>

<style scoped>
.players {
  list-style: none;
  display: flex;
  gap: 2rem;
  justify-content: center;
}
</style>
