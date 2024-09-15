import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import {socketServer} from "./server/socketio.js"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),{
    name: "sockets",
    configureServer(){
      socketServer()
    }
  }],
});
