import QrScanner from "./core/qr-scanner.min.js";
try {
    BX24.init(async ()=>{
        var userID
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

                            BX24.callMethod('lists.element.get', {"IBLOCK_TYPE_ID": "lists", "IBLOCK_ID": 92, "ELEMENT_ID": arData[1]}, (res)=>{
                                if(res.error()){
                                    alert("Error: " + res.error());
                                }else{
                                    let dat = res.data()[0]
                                    console.log(dat)
                                    let valID = getProperty(dat.PROPERTY_408)
                                    let value = typelist[valID]
                                    let contractID = getProperty(dat.PROPERTY_633)

                                    BX24.callMethod('crm.item.get', {"entityTypeId": 179, "id": contractID}, async (res)=>{
                                        if(res.error()){
                                            alert("Error: " + res.error());
                                        }else{
                                            let dat = res.data()
                                            let conf = confirm("Добавить запись?\nТип:"+ value+"\nДоговор: "+ dat.item.title)
                                            if(conf){
                                                showing()
                                                fetch('/add', {
                                                    method: 'post',
                                                    headers: {
                                                        'Accept': 'application/json',
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body:JSON.stringify({
                                                        el_id: Number(arData[1]),
                                                        contract: Number(contractID),
                                                        user: userID
                                                    })
                                                }).then(async (response)=>{
                                                    hiding()
                                                    let resData = await response.json()
                                                    if(resData.status == "ok"){
                                                        $('#data').append(
                                                            `<div class="item-wrapper">
                                                                <img class="mark" src="./img/mark.svg">
                                                                <div class="item">
                                                                    <span class="info">${dat.item.title}</span>
                                                                    <p class="title">${value}</p>
                                                                </div>
                                                            </div>`
                                                        )
                                                    }else if(resData.status == "exception"){
                                                        alert(resData.msg)
                                                    }else{
                                                        alert("Во время выполнения произошла ошибка")
                                                    }
                                                })
                                                
                                            }else{
                                                scanner.start()
                                            }
                                        }
                                    })
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

        BX24.callMethod('user.current', {}, async function(res){
            userID = res.data().ID
        })

        document.getElementById('s').addEventListener('click', ()=>{
            scanner.start()
        })

        window.scanner = scanner;

        document.getElementById('send').addEventListener("click", async ()=>{
            scanner.stop()
            BX24.callMethod('user.get', {"UF_DEPARTMENT": 130, "ACTIVE": true}, (res)=>{
                let users = res.data()
                $('body').append(`
                    <div id="userSelector">
                        <h3>Выберите менеждера, который передал вам пакет документов</h3>
                        <select id="userList">
                        </select>
                        <button class="btn btn-primary" id="submit">Выбрать</button>
                    </div>
                `)
                users.forEach(el => {
                    $('#userList').append(`<option value="${el.ID}">${el.NAME} ${el.LAST_NAME}</option>`)
                });

                $('#submit').on('click', ()=>{
                    var sender = $('#userList').val()

                    showing()
                    fetch('/get', {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body:JSON.stringify({
                            user: userID
                        })
                    }).then(async (response)=>{
                        let resData = await response.json()
                        if(resData.status == "ok"){
                            let dbData = resData.data
                            if(dbData.length == 0){
                                alert("Нет данных для отправки")
                                window.location.href = '/'
                            }
                            dbData.forEach(el => {
                                BX24.callMethod('lists.element.get', {"IBLOCK_TYPE_ID": "lists", "IBLOCK_ID": 92, "ELEMENT_ID": el.el_id}, (res)=>{
                                    if(res.error()){
                                        alert("Error: " + res.error());
                                    }else{
                                        let dat = res.data()[0]
                                        var params = {
                                            'IBLOCK_TYPE_ID': 'lists',
                                            'IBLOCK_ID': '92',
                                            'ELEMENT_ID': el.el_id,
                                            'FIELDS': {
                                                'NAME': dat.NAME,
                                                'PROPERTY_407': dat.PROPERTY_407,
                                                'PROPERTY_408': dat.PROPERTY_408,
                                                'PROPERTY_411': dat.PROPERTY_411,
                                                'PROPERTY_607': dat.PROPERTY_607,
                                                'PROPERTY_633': dat.PROPERTY_633,
                                                'PROPERTY_706': {'n0': userID},
                                                'PROPERTY_707': {'n0': new Date},
                                                'PROPERTY_708' : {'n0': sender}
                                            }
                                           }
                                        BX24.callMethod('lists.element.update', params, (res)=>{
                                            if(res.error()){
                                                console.log(res.error())
                                                console.log(res.data())
                                                alert('Произошла ошибка при отправке')
                                            }else{
                                                fetch('/del', {
                                                    method: 'post',
                                                    headers: {
                                                        'Accept': 'application/json',
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body:JSON.stringify({
                                                        el_id: Number(el.el_id),
                                                    })
                                                }).then(async (response)=>{
                                                    console.log('Элемент удален')
                                                })
                                            }
                                        })
                                    }
                                })
                               
                            }); 
                            hiding()
                            $('#userSelector').remove()
                            $('.item-wrapper').remove()
                        }else{
                            hiding()
                            alert("Во время выполнения произошла ошибка")
                        }
                    })

                })
            });

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

    
