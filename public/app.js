import QrScanner from "./core/qr-scanner.min.js";
try {
    BX24.init(()=>{
        const video = document.getElementById('qr-video');
        const videoContainer = document.getElementById('container');



        function setResult(result) {
            
            if(result.data){
                scanner.stop()
                let data = result.data
                let arData = data.split("_")
                if(arData[0] == "92"){
                    BX24.callMethod('lists.element.get', {"IBLOCK_TYPE_ID": "lists", "IBLOCK_ID": 92, "ELEMENT_ID": arData[1]}, (res)=>{
                        if(res.error()){
                            alert("Error: " + res.error());
                        }else{
                            let dat = res.data()[0]
                            let p1 = JSON.stringify(dat.PROPERTY_408)
                            let p1val = p1.split('"')[2]

                            let conf = confirm("Вы отсканировали элемент с типом:"+ dat.PROPERTY_408)
                            document.writeln(p1val)
                            if(!conf){
                                scanner.start()
                            }
                        }
                    })
                }else{
                    alert('Приложение не может работать с этими данными')
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
    
