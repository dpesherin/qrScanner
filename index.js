const express = require('express')
const app = express()
const http = require('http')
// const https = require('https')
const Port = process.env.PORT || 3000
const HttpServer = http.createServer(app)
// const HttpsServer = https.createServer({
//     "key":"",
//     "chain": ""
// }, app)
const qr = require('qr-image')
const config = require('config')
const fs = require('fs/promises')

app.use(express.json('extended'))
app.use(express.static('./public'))
app.set('views', 'views')
app.set('view engine', 'ejs')


app.all('/', (req, res)=>{
    res.render('index')
})
app.all('/scan', (req, res)=>{
    res.render('scan')
})

app.post('/generate', async(req, res)=>{
    const token = req.headers.authorization
    const key = config.get('key')
    if(key == token){
        try {
            const img = qr.imageSync(req.body.str, {type: "png", ec_level: "L"})
            await fs.writeFile('./public/img/123.png', img, 'binary')
            return res.status(200).sendFile(__dirname + `/public/img/123.png`)
        } catch (e) {
            return res.status(500).json({status: "err", msg: e.message})
        }
        
    }else{
        return res.status(401).json({status: "err", msg: "Authorization error"})
    }
})

// HttpsServer.listen(HttpsPort, ()=>{
//     console.log('Server HTTPS was started')
// })

HttpServer.listen(Port, ()=>{
    console.log('Server was started')
})

function sendfile(res){
    res.status(200).sendFile(__dirname + `/public/img/${filename}`)
    return true
}