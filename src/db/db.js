import {createPool} from "mysql2/promise"

export const pool = createPool({
    host:"localhost",
    password:"",
    user:"root",
    port:3306,
    database: "postimages"
})