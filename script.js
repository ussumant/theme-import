// script.js

let selectedFileKey = null;

document.addEventListener('DOMContentLoaded', function() {
    const figmaForm = document.getElementById('figmaForm');
    const figmaTokenInput = document.getElementById('figmaToken');
    const statusMessage = document.getElementById('statusMessage');
    const fileList = document.getElementById('fileList');
    const extractThemeButton = document.getElementById('extractTheme');
    const resultDiv = document.getElementById('result');
    const generatedTheme = document.getElementById('generatedTheme');
    const copyButton = document.getElementById('copyButton');

    figmaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const figmaToken = figmaTokenInput.value;

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
            extractThemeButton.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            statusMessage.textContent = `Error: ${error.message}. Please check your access token.`;
        });
    });

    function displayFileList(files) {
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

    extractThemeButton.addEventListener('click', function() {
        if (!selectedFileKey) {
            alert('Please select a Figma file first.');
            return;
        }

        const figmaToken = figmaTokenInput.value;

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
        // Implement your theme extraction logic here
        // This is a placeholder implementation
        return {
            "__HACKY__THEME": {
                "version": "1",
                "fonts": {
                    "primaryFont": {
                        "family": "Roboto",
                        "url": "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
                        "fallback": "sans-serif",
                        "type": "GOOGLE",
                        "variable": "--primary-font"
                    },
                    "secondaryFont": null
                },
                "deviceVariables": {
                    "mobile": {
                        "--heading-1": "400 32px var(--primary-font)",
                        "--heading-2": "400 24px var(--primary-font)"
                    }
                },
                "paletteVariables": {
                    "dark": {
                        "default": {
                            "--primary": "#000000",
                            "--secondary": "#ffffff"
                        },
                        "custom": {
                            "--primary": "#000000",
                            "--secondary": "#ffffff"
                        }
                    },
                    "light": {
                        "default": {
                            "--primary": "#ffffff",
                            "--secondary": "#000000"
                        },
                        "custom": {
                            "--primary": "#ffffff",
                            "--secondary": "#000000"
                        }
                    }
                }
            }
        };
    }

    copyButton.addEventListener('click', function() {
        generatedTheme.select();
        document.execCommand('copy');
        alert('Copied to clipboard!');
    });
});
