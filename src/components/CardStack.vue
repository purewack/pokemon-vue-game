<script setup lang="ts">
import Card from "./Card.vue";
const props = defineProps<{
  cards: CardData[] | number;
  showCards?: boolean;
}>();
</script>

<template>
  <ul class="stack">
    <li
      key="card.id"
      v-for="(card, index) in Array.isArray(cards) ? cards : [...Array(cards)]"
      :style="{ '--rotate': Math.random() - 0.5 }"
    >
      <Card v-if="typeof card === 'number'" :cardData="undefined" />
      <Card v-else :faceDown="!showCards" :cardData="card" />
    </li>
  </ul>
</template>

<style scoped>
.stack {
  list-style: none;
  display: grid;
  grid-template-area: "stack";
  padding: 0;
  margin: 0;
}
.stack li {
  grid-area: stack;
  padding: 0;
  margin: 0;
  rotate: calc(var(--rotate) * 10deg);
  width: min-content;
}
</style>
