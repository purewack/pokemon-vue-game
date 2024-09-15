<script setup lang="ts">
import { ref } from "vue";
import { clientRoomQuery, clientRoomResponse } from "./client";
const { roomID } = defineProps<{ roomID: string }>();
const message = ref("");
const roomState = ref("playing");
clientRoomResponse((res, data) => {
  console.log("res", res, data);
  if (res === "test") message.value = data;
  else if (res === "room_full" || res === "room_new_player")
    roomState.value = "playing";
  else if (res === "room_empty") {
    roomState.value = "empty";
    console.log("did empty");
  }
});
function testSend() {
  clientRoomQuery(roomID, "test", Date.now() + "");
}
</script>

<template>
  <template v-if="roomState === 'playing'">
    <p>Got: {{ message }}</p>
    <button @click="testSend">Send</button>
  </template>
  <template v-else>
    <p>Game empty</p>
  </template>
</template>
