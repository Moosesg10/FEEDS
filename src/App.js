import express from "express";
import cors from "cors"
import IndexRouter from "./routes/index.routes.js"
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express()

app.use(express.json())
app.use(cors ({
    origin:"http://localhost:8080"
}))

app.use(IndexRouter)

app.use(express.static('public'))

export default app