// script.js

document.getElementById('figmaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const figmaUrl = document.getElementById('figmaUrl').value;
    const figmaToken = document.getElementById('figmaToken').value;
    
    // Extract file key from Figma URL
    const fileKey = figmaUrl.split('/').pop();
    
    // Call Figma API to get file data
    fetch(`https://api.figma.com/v1/files/${fileKey}`, {
        headers: {
            'X-Figma-Token': figmaToken
        }
    })
    .then(response => response.json())
    .then(data => {
        // Process Figma data and extract theme information
        const theme = processThemeFromFigma(data);
        document.getElementById('generatedTheme').value = JSON.stringify(theme, null, 2);
        document.getElementById('result').classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error fetching data from Figma. Please check your URL and access token.');
    });
});

function processThemeFromFigma(figmaData) {
    // Extract color styles
    const colorStyles = figmaData.styles.filter(style => style.style_type === 'FILL');
    const primaryColor = colorStyles.find(style => style.name.toLowerCase().includes('primary'))?.description;
    const secondaryColor = colorStyles.find(style => style.name.toLowerCase().includes('secondary'))?.description;

    // Extract text styles
    const textStyles = figmaData.styles.filter(style => style.style_type === 'TEXT');
    const heading1Style = textStyles.find(style => style.name.toLowerCase().includes('heading 1'));
    const heading2Style = textStyles.find(style => style.name.toLowerCase().includes('heading 2'));
    const bodyStyle = textStyles.find(style => style.name.toLowerCase().includes('body'));

    // Extract font family
    const fontFamily = bodyStyle?.description.split(',')[0] || 'Roboto';

    return {
        "__HACKY__THEME": {
            "version": "1",
            "fonts": {
                "primaryFont": {
                    "family": fontFamily,
                    "url": `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}&display=swap`,
                    "fallback": "sans-serif",
                    "type": "GOOGLE",
                    "variable": "--primary-font"
                },
                "secondaryFont": null
            },
            "deviceVariables": {
                "mobile": {
                    "--heading-1": `400 ${heading1Style?.description.split(',')[1] || '32px'} var(--primary-font)`,
                    "--heading-2": `400 ${heading2Style?.description.split(',')[1] || '24px'} var(--primary-font)`
                }
            },
            "paletteVariables": {
                "dark": {
                    "default": {
                        "--primary": primaryColor || "#000000",
                        "--secondary": secondaryColor || "#ffffff"
                    },
                    "custom": {
                        "--primary": primaryColor || "#000000",
                        "--secondary": secondaryColor || "#ffffff"
                    }
                },
                "light": {
                    "default": {
                        "--primary": primaryColor || "#ffffff",
                        "--secondary": secondaryColor || "#000000"
                    },
                    "custom": {
                        "--primary": primaryColor || "#ffffff",
                        "--secondary": secondaryColor || "#000000"
                    }
                }
            }
        }
    };
}

document.getElementById('copyButton').addEventListener('click', function() {
    const generatedTheme = document.getElementById('generatedTheme');
    generatedTheme.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
});
