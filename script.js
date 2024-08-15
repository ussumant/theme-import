// script.js

let selectedFileKey = null;

document.getElementById('figmaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const figmaToken = document.getElementById('figmaToken').value;
    const statusMessage = document.getElementById('statusMessage');
    const fileList = document.getElementById('fileList');

    statusMessage.textContent = 'Fetching Figma files...';
    statusMessage.style.display = 'block';
    fileList.style.display = 'none';

    if (!figmaToken) {
        statusMessage.textContent = 'Please enter your Figma Personal Access Token.';
        return;
    }

    // Fetch Figma files
    fetch('https://api.figma.com/v1/me/files', {
        headers: {
            'X-Figma-Token': figmaToken
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayFileList(data.files);
        statusMessage.style.display = 'none';
        document.getElementById('extractTheme').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = `Error: ${error.message}. Please check your access token.`;
    });
});

function displayFileList(files) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
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
    fileList.style.display = 'block';
}

document.getElementById('extractTheme').addEventListener('click', function() {
    if (!selectedFileKey) {
        alert('Please select a Figma file first.');
        return;
    }

    const figmaToken = document.getElementById('figmaToken').value;
    const statusMessage = document.getElementById('statusMessage');
    const resultDiv = document.getElementById('result');
    const generatedTheme = document.getElementById('generatedTheme');

    statusMessage.textContent = 'Extracting theme from Figma...';
    statusMessage.style.display = 'block';
    resultDiv.style.display = 'none';

    fetch(`https://api.figma.com/v1/files/${selectedFileKey}`, {
        headers: {
            'X-Figma-Token': figmaToken
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const theme = processThemeFromFigma(data);
        generatedTheme.value = JSON.stringify(theme, null, 2);
        resultDiv.style.display = 'block';
        statusMessage.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = `Error: ${error.message}. Please try again.`;
    });
});

function processThemeFromFigma(figmaData) {
    // ... (processThemeFromFigma function remains the same)
}

document.getElementById('copyButton').addEventListener('click', function() {
    const generatedTheme = document.getElementById('generatedTheme');
    generatedTheme.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
});
