import QrScanner from "./core/qr-scanner.min.js";
try {
    BX24.init(()=>{
        const video = document.getElementById('qr-video');
        const videoContainer = document.getElementById('container');



        function setResult(result) {
            
            if(result.data){
                // let data = JSON.parse(result.data)
                // let text = `Договор: ${data.contract},\nТип документа: ${data.type},\nОтветственный: ${data.employer},\nКонтрагент: ${data.contragent}\nПодтверждаете документ?`
                let conf = confirm(result.data)
                if(conf){
                    scanner.stop()
                }
                
            }
        }

        const scanner = new QrScanner(video, result => setResult(result), {
            highlightScanRegion: true,
            highlightCodeOutline: true,
        });

        scanner.start()

        document.getElementById('s').addEventListener('click', ()=>{
            scanner.start()
        })

        window.scanner = scanner;

        document.getElementById('send').addEventListener("click", ()=>{
            showing()
        })

        function showing(){
            document.getElementById('wrapper').style.display = 'flex'
        }
        function hiding(){
            document.getElementById('wrapper').style.display = 'none'
        }


    })
} catch (error) {
    alert("Вы не можете использовать это приложение вне Битрикс24")
    window.location.href = 'https://google.com'
}
    
