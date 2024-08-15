// script.js

document.getElementById('figmaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const figmaUrl = document.getElementById('figmaUrl').value;
    const figmaToken = document.getElementById('figmaToken').value;
    const resultDiv = document.getElementById('result');
    const generatedTheme = document.getElementById('generatedTheme');
    const statusMessage = document.getElementById('statusMessage');

    // Show status message
    statusMessage.textContent = 'Extracting theme from Figma...';
    statusMessage.style.display = 'block';
    resultDiv.style.display = 'none';

    // Validate inputs
    if (!figmaUrl || !figmaToken) {
        statusMessage.textContent = 'Please enter both Figma URL and access token.';
        return;
    }

    // Extract file key from Figma URL
    const fileKey = figmaUrl.split('/').pop();
    
    // Call Figma API to get file data
    fetch(`https://api.figma.com/v1/files/${fileKey}`, {
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
        // Process Figma data and extract theme information
        const theme = processThemeFromFigma(data);
        generatedTheme.value = JSON.stringify(theme, null, 2);
        resultDiv.style.display = 'block';
        statusMessage.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = `Error: ${error.message}. Please check your URL and access token.`;
    });
});

function processThemeFromFigma(figmaData) {
    // ... (rest of the processThemeFromFigma function remains the same)
}

document.getElementById('copyButton').addEventListener('click', function() {
    const generatedTheme = document.getElementById('generatedTheme');
    generatedTheme.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
});
