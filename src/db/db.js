import {createPool} from "mysql2/promise"
import { DATABASES, HOST, PASSWORD, PORTS, USER } from "../Config.js"

export const pool = createPool({
    host:HOST, 
    password:PASSWORD,
    user:USER,
    port:PORTS,
    database: DATABASES
})