import QrScanner from "./core/qr-scanner.min.js";
try {
    BX24.init(()=>{
        const video = document.getElementById('qr-video');
        const videoContainer = document.getElementById('container');
        var typelist


        function setResult(result) {
            
            if(result.data){
                scanner.stop()
                let data = result.data
                let arData = data.split("_")
                if(arData[0] == "92"){
                    
                    BX24.callMethod('lists.field.get', {"IBLOCK_TYPE_ID": "lists", "IBLOCK_ID": 92, "FIELD_ID": "PROPERTY_408"}, (res)=>{
                        if(res.error()){
                            alert("Error: " + res.error());
                        }else{
                            let dat  = res.data()
                            typelist = dat.L.DISPLAY_VALUES_FORM
                            console.log(typelist)

                            BX24.callMethod('lists.element.get', {"IBLOCK_TYPE_ID": "lists", "IBLOCK_ID": 92, "ELEMENT_ID": arData[1]}, (res)=>{
                                if(res.error()){
                                    alert("Error: " + res.error());
                                }else{
                                    let dat = res.data()[0]
                                    let valID = getProperty(dat.PROPERTY_408)
                                    let value = typelist[valID]
                                    let contractID = getProperty(dat.PROPERTY_633)
                                    console.log(contractID)

                                    BX24.callMethod('crm.item.get', {"entityTypeId": 179, "id": contractID}, (res)=>{
                                        if(res.error()){
                                            alert("Error: " + res.error());
                                        }else{
                                            let dat = res.data()
                                            console.log(dat)
                                            let conf = confirm("Добавить запись?\nТип:"+ value+"\nДоговор: "+ dat.item.title)
                                            if(conf){
                                                $('#data').append(
                                                    `<div class="item">
                                                        <span class="info">${value}</span>
                                                        <p class="title">${dat.item.title}</p>
                                                    </div>`
                                                )
                                            }else{
                                                scanner.start()
                                            }
                                        }
                                    })
        
                                    // let conf = confirm("Добавить запись?\nТип:"+ value+"\nДоговор: "+ dat.PROPERTY_633)
                                    // if(!conf){
                                    //     scanner.start()
                                    // }
                                }
                            })
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

        function getProperty(prop){
            let pstr = JSON.stringify(prop)
            return pstr.split('"')[3]
        }


    })
} catch (error) {
    alert("Вы не можете использовать это приложение вне Битрикс24")
    window.location.href = 'https://google.com'
}
    
