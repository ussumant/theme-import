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
            extractThemeButton.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            fileList.innerHTML = `Error: ${error.message}. Please check your access token.`;
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
    }

    extractThemeButton.addEventListener('click', function() {
        if (!selectedFileKey) {
            alert('Please select a Figma file first.');
            return;
        }

        const figmaToken = figmaTokenInput.value.trim();
        resultDiv.textContent = 'Extracting theme...';

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
            resultDiv.textContent = JSON.stringify(theme, null, 2);
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.textContent = `Error: ${error.message}. Please try again.`;
        });
    });

    function processThemeFromFigma(figmaData) {
        // This is a placeholder. Implement your actual theme extraction logic here.
        return {
            "__HACKY__THEME": {
                "version": "1",
                "fonts": {
                    "primaryFont": {
                        "family": "Arial",
                        "fallback": "sans-serif",
                        "variable": "--primary-font"
                    }
                },
                "paletteVariables": {
                    "light": {
                        "default": {
                            "--primary": "#000000",
                            "--secondary": "#ffffff"
                        }
                    }
                }
            }
        };
    }
});
