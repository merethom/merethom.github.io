const rainbowColorNames = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

function randomizePop() {
    const randomIndex = Math.floor(Math.random() * rainbowColorNames.length);
    const randomColor = rainbowColorNames[randomIndex];
    const cssVariable = `--rainbow-${randomColor}`;
    document.documentElement.style.setProperty('--pop', `var(${cssVariable})`);
}

randomizePop();