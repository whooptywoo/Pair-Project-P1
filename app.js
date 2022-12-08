const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(routes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})