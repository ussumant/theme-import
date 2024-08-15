document.getElementById('themeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const theme = {
        "__HACKY__THEME": {
            "version": "1",
            "fonts": {
                "primaryFont": {
                    "family": document.getElementById('fontFamily').value,
                    "url": `https://fonts.googleapis.com/css2?family=${document.getElementById('fontFamily').value.replace(' ', '+')}&display=swap`,
                    "fallback": "sans-serif",
                    "type": "GOOGLE",
                    "variable": "--primary-font"
                },
                "secondaryFont": null
            },
            "deviceVariables": {
                "mobile": {
                    "--heading-1": `400 ${document.getElementById('heading1Size').value} var(--primary-font)`,
                    "--heading-2": `400 ${document.getElementById('heading2Size').value} var(--primary-font)`
                }
            },
            "paletteVariables": {
                "dark": {
                    "default": {
                        "--primary": document.getElementById('primaryColor').value,
                        "--secondary": document.getElementById('secondaryColor').value
                    },
                    "custom": {
                        "--primary": document.getElementById('primaryColor').value,
                        "--secondary": document.getElementById('secondaryColor').value
                    }
                },
                "light": {
                    "default": {
                        "--primary": document.getElementById('primaryColor').value,
                        "--secondary": document.getElementById('secondaryColor').value
                    },
                    "custom": {
                        "--primary": document.getElementById('primaryColor').value,
                        "--secondary": document.getElementById('secondaryColor').value
                    }
                }
            }
        }
    };
    
    document.getElementById('generatedTheme').value = JSON.stringify(theme, null, 2);
    document.getElementById('result').classList.remove('hidden');
});

document.getElementById('copyButton').addEventListener('click', function() {
    const generatedTheme = document.getElementById('generatedTheme');
    generatedTheme.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
});
