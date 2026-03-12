const express = require('express');
const app = express();
require('dotenv').config({ path: __dirname + '/.env' })

console.log(process.env.USER_EMAIL)
console.log(process.env.USER_PASS)

const cors = require('cors')

// will come back to this later
app.use(cors({origin:"*"}))
app.use(express.json())

app.use('/api/sendemail', require('./routes/sendemail'))

const port = 8001

app.listen(port,()=>{
    console.log(`App started at port ${port}`);
})