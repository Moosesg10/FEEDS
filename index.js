import app from "./src/App.js"
import { PORT } from "./src/Config.js"




app.set('port', process.env.PORT || PORT)


app.listen(app.get('port'))
console.log("Servidor escuchando el purto 3000 ")
