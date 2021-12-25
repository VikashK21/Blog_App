require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const routers = require('./Routes/routes')

app.use(express.json())
app.use('/', routers)


app.get('/home', (req, res) => {
    res.send('You are at the front page.')
})




app.listen(port, () => {
    console.log(`Listening at port ${port}`);
})