document.addEventListener('DOMContentLoaded', function() {
    const steganographyForm = document.getElementById('steganographyForm');
    if (steganographyForm) {
        steganographyForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const videoFile = document.getElementById('videoFile').files[0];
            const textFile = document.getElementById('textFile').files[0];

            const formData = new FormData();
            formData.append('videoFile', videoFile);
            formData.append('textFile', textFile);

            try {
                const response = await fetch('/embed', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.blob();
                    const url = URL.createObjectURL(result);
                    const output = document.getElementById('output');
                    output.innerHTML = `<a href="${url}" download="steganography_video.mp4">Download Steganography Video</a>`;
                } else {
                    alert('Failed to embed text into video');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error embedding text into video');
            }
        });
    }

    const extractForm = document.getElementById('extractForm');
    if (extractForm) {
        extractForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const videoFile = document.getElementById('extractVideoFile').files[0];

            const formData = new FormData();
            formData.append('videoFile', videoFile);

            try {
                const response = await fetch('/extract', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const text = await response.text();
                    const output = document.getElementById('output');
                    output.innerHTML = `<p>Extracted Text: ${text}</p>`;
                } else {
                    const errorText = await response.text();
                    alert(`Failed to extract text from video: ${errorText}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error extracting text from video');
            }
        });
    }
});
