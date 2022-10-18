import QrScanner from "./core/qr-scanner.min.js"
$(document).ready(()=>{
    alert('Ready')

    const video = document.getElementById('qr-video')

    function setResult(result) {
        console.log(result.data);
    }

    const scanner = new QrScanner(video, result => setResult(result), {
        onDecodeError: error => {
            alert(error);
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
    });
})