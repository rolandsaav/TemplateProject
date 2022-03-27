const express = require('express')
const app = express();
const orgRouter = require('./routes/organizations');

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

app.use('/organizations', orgRouter);

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(process.env.port || 3000);