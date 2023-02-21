const express = require('express')
const app = express()
const http = require('http')
const sqlite = require('sqlite3')
const path = require('path')
const cron = require('cron').CronJob
const fileUpload = require('express-fileupload')
var docxConverter = require('docx-pdf');
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
const db = new sqlite.Database('./scanner.db')
const unoconv = require('awesome-unoconv');

app.use(fileUpload({}))
app.use(express.json('extended'))
app.use(express.static('./public'))
app.set('views', 'views')
app.set('view engine', 'ejs')


app.all('/', (req, res)=>{
    return res.render('index')
})
app.all('/scan', (req, res)=>{
    return res.render('scan')
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

app.post('/add', (req, res)=>{
    const el_id = req.body.el_id
    const contract = req.body.contract
    const user = req.body.user

    db.get(`SELECT * FROM documents WHERE el_id = ${el_id};`, (err, row)=>{
        if(err){
            return res.status(200).json({status: "err", msg: "Произошла ошибка на сервере"})
        }else{
            if(row){
                return res.status(200).json({status: "exception", msg: "Запись этого документа уже была добавлена"})
            }
            db.run(`INSERT INTO documents (el_id, contract_id, scanned_by) VALUES (${el_id}, ${contract}, ${user});`, (result, err)=>{
                if(err){
                    return res.status(200).json({status: "err", msg: "Произошла ошибка на сервере"})
                }
                return res.status(200).json({status: "ok", msg: "Документ добавлен"})
            })
        }
    })

    
})

app.post('/print', async (req, res)=>{
    const token = req.headers.authorization
    const key = config.get('key')
    if(key == token){
	let filename = req.files.file.name
	await req.files.file.mv('./documents/'+filename);
        const sourceFilePath = path.resolve('./documents/'+filename);
        const outputFilePath = path.resolve('./myDoc.pdf');
 
        unoconv
        .convert(sourceFilePath, outputFilePath)
        .then(result => {
            return res.sendFile(result)
        })
        .catch(err => {
            console.log(err);
  });
    }else{
        return res.status(401).json({status: "err", msg: "Authorization error"})
    }
})

app.post('/get', (req, res)=>{
    const user = req.body.user

    db.all(`SELECT * FROM documents WHERE scanned_by = ${user};`, (err, rows)=>{
        if(err){
            return res.status(200).json({status: "err", msg: "Произошла ошибка на сервере"})
        }
        return res.status(200).json({status: "ok", data: rows})
    })
})

app.post('/del', (req, res)=>{
    const el_id = req.body.el_id
    db.run(`DELETE FROM documents WHERE el_id = ${el_id};`, (resu, err)=>{
        if(err){
            return res.status(200).json({status: "err", msg: "Произошла ошибка на сервере"})
        }
        return res.status(200).json({status: "ok", msg: "Элементы удалены"})
    })
})

app.post('/gen', async (req, res)=>{
    const token = req.headers.authorization
    const key = config.get('key')
    if(key == token){
	let filename = req.files.file.name
	await req.files.file.mv('./documents/'+filename);
        const sourceFilePath = path.resolve('./documents/'+filename);
        const outputFilePath = path.resolve('./myDoc.pdf');

        const main = async () => {
            const pdfdoc = await PDFNet.PDFDoc.create();
            await pdfdoc.initSecurityHandler();
            await PDFNet.Convert.toPdf(pdfdoc, inputPath);
            pdfdoc.save(
              `${pathname}${filename}.pdf`,
              PDFNet.SDFDoc.SaveOptions.e_linearized,
            );
            ext = '.pdf';
          };

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

let job = new cron('* 00 23 * * *', async ()=>{
    const directory = "documents";

    for (const file of await fs.readdir(directory)) {
    await fs.unlink(path.join(directory, file));
    }
},
null,
true,
'Europe/Moscow')

job.start()
