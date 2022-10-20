import QrScanner from "./core/qr-scanner.min.js";
// try {
//     BX24.init(()=>{

//     })
// } catch (error) {
    
// }
    const video = document.getElementById('qr-video');
    const videoContainer = document.getElementById('container');

    function setResult(result) {
        
        if(result.data){
            let data = JSON.parse(result.data)
            let text = `Договор: ${data.contract},\nТип документа: ${data.type},\nОтветственный: ${data.employer},\nКонтрагент: ${data.contragent}\nПодтверждаете документ?`
            let conf = confirm(text)
            if(conf){
                scanner.stop()
            }
        }
    }

    const scanner = new QrScanner(video, result => setResult(result), {
        highlightScanRegion: true,
        highlightCodeOutline: true,
    });
;

    scanner.start()


    window.scanner = scanner;

    document.getElementById('scan-region-highlight-style-select').addEventListener('change', (e) => {
        videoContainer.className = e.target.value;
        scanner._updateOverlay();
    });

    document.getElementById('show-scan-region').addEventListener('change', (e) => {
        const input = e.target;
        const label = input.parentNode;
        label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
        scanner.$canvas.style.display = input.checked ? 'block' : 'none';
    });

    document.getElementById('inversion-mode-select').addEventListener('change', event => {
        scanner.setInversionMode(event.target.value);
    });