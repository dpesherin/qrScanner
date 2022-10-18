const express = require('express')
const app = express()
const http = require('http')
const Port = process.env.PORT || 3000
const HttpServer = http.createServer(app)

app.use(express.static('./public'))
app.set('views', 'views')
app.set('view engine', 'ejs')


app.all('/', (req, res)=>{
    res.render('index')
})

HttpServer.listen(Port, ()=>{
    console.log('Server was started')
})