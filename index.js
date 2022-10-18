const express = require('express')
const app = express()
const http = require('http')
const HttpServer = http.createServer(app)

app.use(express.static('./public'))
app.set('views', 'views')
app.set('view engine', 'ejs')


app.all('/', (req, res)=>{
    res.render('index')
})
app.all('/test', (req, res)=>{
    res.render('test')
})



HttpServer.listen(3000, ()=>{
    console.log('Server was started')
})