<script setup lang="ts">
import Card from "./Card.vue";
const props = defineProps<{
  cards: CardData[] | boolean[] | number;
  hovers: boolean[];
  onSelect?: (selection: CardData, index: number) => void;
  onHover?: (selection: CardData, index: number) => void;
}>();

function onClickACard(card: CardData, index: number) {
  props?.onSelect?.(card, index);
}
function onHoverACard(card: CardData, index: number) {
  props?.onHover?.(card, index);
}
</script>

<template>
  <ul class="hand">
    <li key="card.id" v-for="(card, index) in cards" class="holder">
      <Card
        v-if="typeof card !== 'object'"
        @mouseover="onHoverACard(card, index)"
        @mouseleave="onHoverACard(null, index)"
        :cardData="undefined"
        :class="{ discard: card, hover: hovers[index] }"
      />
      <Card
        v-else
        @click="onClickACard(card, index)"
        @mouseenter="onHoverACard(card, index)"
        @mouseleave="onHoverACard(null, index)"
        :cardData="card"
      />
    </li>
  </ul>
</template>

<style scoped>
.hand {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}
.hand li {
  padding: 0;
  margin: 0;
}

.hand:deep(.card.hover) {
  transform: translateY(-30%);
}
</style>
