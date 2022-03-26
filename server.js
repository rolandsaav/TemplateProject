const express = require('express')

const app = express();

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(process.env.port || 3000);