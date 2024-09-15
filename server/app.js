import express from "express"
import bodyParser from "body-parser";
import http from "http"
import path from "path"
import { fileURLToPath } from 'url';
import {socketServer} from "./socketio.js"

const dist = path.join(fileURLToPath(import.meta.url), '..', '..', 'dist')

const app = express()
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(dist))
console.log("Serving files from ",dist)

const server = http.createServer(app)
server.listen(8000)

socketServer(8001)