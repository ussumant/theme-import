// script.js

let selectedFileKey = null;

document.addEventListener('DOMContentLoaded', function() {
    const figmaTokenInput = document.getElementById('figmaToken');
    const fetchFilesButton = document.getElementById('fetchFiles');
    const tokenDisplay = document.getElementById('tokenDisplay');
    const fileList = document.getElementById('fileList');
    const extractThemeButton = document.getElementById('extractTheme');
    const resultDiv = document.getElementById('result');

    figmaTokenInput.addEventListener('input', function() {
        tokenDisplay.textContent = `Current Token: ${this.value}`;
    });

    fetchFilesButton.addEventListener('click', function() {
        const figmaToken = figmaTokenInput.value.trim();
        tokenDisplay.textContent = `Token being used: ${figmaToken}`;

        if (!figmaToken) {
            alert('Please enter a Figma Personal Access Token.');
            return;
        }

        fileList.innerHTML = 'Fetching files...';
        
        // Log the request details
        console.log('Sending request to Figma API');
        console.log('API Endpoint: https://api.figma.com/v1/me/files');
        console.log('Token (first 4 chars):', figmaToken.substring(0, 4));

        fetch('https://api.figma.com/v1/me/files', {
            method: 'GET',
            headers: {
                'X-Figma-Token': figmaToken
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.files && Array.isArray(data.files)) {
                displayFileList(data.files);
                extractThemeButton.style.display = 'block';
            } else {
                throw new Error('Unexpected response format');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            fileList.innerHTML = `Error: ${error.message}. Please check your access token and try again.`;
        });
    });

    function displayFileList(files) {
        fileList.innerHTML = '';
        if (files.length === 0) {
            fileList.innerHTML = 'No files found. Make sure your token has the correct permissions.';
            return;
        }
        files.forEach(file => {
            const div = document.createElement('div');
            div.textContent = file.name;
            div.dataset.key = file.key;
            div.addEventListener('click', function() {
                selectedFileKey = this.dataset.key;
                document.querySelectorAll('#fileList div').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
            });
            fileList.appendChild(div);
        });
    }

    // ... rest of the code remains the same ...
});
