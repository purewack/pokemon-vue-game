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
const server = http.createServer(app)

socketServer(server)

const httpPort = process.env.PORT || 8000
server.listen(httpPort)
console.log("Serving files from ",dist, "port",httpPort)
