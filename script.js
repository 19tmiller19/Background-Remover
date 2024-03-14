const imageUpload = document.getElementById('imageUpload');
const removeBackgroundBtn = document.getElementById("removeBackgroundBtn");
const loader = document.getElementById('loader');
const outputCanvas = document.getElementById('outputCanvas')
const downloadBtn = document.getElementById('downloadBtn');


const API_KEY = 'API Key Goes Here';

//50 credits per month

function enableDownload() {
    downloadBtn.removeAttribute('disabled');
}

function disableDownload() {
    downloadBtn.setAttribute('disabled', '');
}


imageUpload.addEventListener('change', () => {
    if (imageUpload.files.length > 0) {
        removeBackgroundBtn.removeAttribute('disabled');
    } else {
        removeBackgroundBtn.setAttribute('disabled')
    }
})

removeBackgroundBtn.addEventListener('click', () => {
    const file = imageUpload.files[0];
    const formData = new FormData();
    formData.append('image_file', file);

    loader.style.display = 'block';
    removeBackgroundBtn.setAttribute('disabled', '');
    disableDownload();


    fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': API_KEY
        },
        body: formData
    })


        .then(response => response.blob())
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            const image = new Image();
            image.src = imageUrl;
            image.onload = () => {
                const { width, height } = image;
                outputCanvas.width = width;
                outputCanvas.height = height;
                const ctx = outputCanvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                URL.revokeObjectURL(imageUrl);
                loader.style.display = 'none';
                outputCanvas.style.display = 'block';
                enableDownload();
            };
        })
        .catch(error => {
            console.error(error);
            disableDownload();
            alert('An Issue Has been occured try after some time')
            loader.style.display = 'none';
        })
        downloadBtn.addEventListener('click', () => {
            const canvas = document.getElementById('outputCanvas');
            const imageType = 'image/png'; // Modify this if you want a different image format
            const imageData = canvas.toDataURL(imageType);
            const downloadLink = document.createElement('a');
            downloadLink.href = imageData;
            downloadLink.download = 'modified_image.png'; // Modify the filename and extension as needed
            downloadLink.click();
        });    

})
