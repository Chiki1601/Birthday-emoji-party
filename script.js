"use strict";
const params = {
    name: "Friend",
    celebrationEmojis: "🎂🎈",
    happyEmoji: "*",
    birthdayEmoji: "🎈",
    nameEmoji: "✧",
    celebEmoji: "✨"
};
// Update it when you fork this pen
const penFullURL = "https://codepen.io/rajatkantinandi/full/KKXGPoM";
const width = window.innerWidth;
const height = window.innerHeight;
const fontSize = Math.floor(height / 7);
const charFontSize = Math.floor(fontSize / 11);
const gap = Math.floor(charFontSize / 12);
let displacement = gap;
let deltaDisplacement = 0.0;
let deltaGreen = 0.67;
let deltaBlue = 0.33;
let deltaRed = 0;
let pixels = [];
function setup() {
    createCanvas(width, height);
    pixelDensity(1);
    frameRate(60);
}
function draw() {
    background(0);
    pixels = [];
    const { happyEmoji, birthdayEmoji, name, nameEmoji, celebrationEmojis, celebEmoji } = params;
    drawText("Happy", happyEmoji, fontSize + displacement * 5, 2);
    drawText("Birthday", birthdayEmoji, fontSize * 2 + displacement * 5, 3);
    drawText(name, nameEmoji, fontSize * 3 + displacement * 5, 4);
    drawText(celebrationEmojis, celebEmoji, fontSize * 4.5 + displacement * 5, 5);
    drawChars();
    deltaDisplacement += 0.01;
    displacement = noise(deltaDisplacement) * charFontSize;
}
function drawText(num, char, yPos, fillCol) {
    // Create a number on a seperate canvas
    // Use a seperate canvas thats smaller so we have less data to loop over when using getImagedata()
    //	Clear stage of previous numbers
    fill(fillCol);
    textSize(fontSize);
    textAlign(CENTER);
    textFont("sans-serif");
    text(num, width / 2, yPos);
    // getImageData(x, y, width, height)
    // gives us an array of pixel values containing 4 cosecutive values red, green, blue, alpha
    const imageData = drawingContext.getImageData(0, 0, width, height).data;
    // i is equal to total image data length
    // We need to ren from n to 0 decrementing 4 each time to get the 4 values (red, green, blue, alpha)
    for (let i = imageData.length; i >= 0; i -= 4) {
        // If a pixel value matches with the fillCol used to create the text
        if (imageData[i] === fillCol) {
            // Now i represents the position in the array a red pixel was found & imageData[i] is the red color value
            // we get the x co-ordinate by dividing i by 4 then taking a modulo of the width of the canvas
            const x = (i / 4) % width;
            // Tp calculate y co-ordinate we divide i by width & then divide by 4
            const y = Math.floor(Math.floor(i / width) / 4);
            // If the co-ordinate is divisible by the font size of chars used to render the image +- some gap then we render the char
            if (x &&
                (x % (charFontSize + gap) === 0 || x % (charFontSize - gap) === 0) &&
                y &&
                (y % (charFontSize - gap) === 0 || y % (charFontSize + gap) === 0)) {
                deltaGreen += 0.01;
                deltaBlue += 0.01;
                deltaRed += 0.01;
                // here we are pushing the raw data to the array to render later together
                pixels.push({
                    char,
                    x: x,
                    y: y + displacement,
                    red: getRedVal(deltaRed),
                    green: getColorVal(deltaGreen),
                    blue: getColorVal(deltaBlue)
                });
            }
        }
    }
}
function drawChars() {
    textSize(charFontSize);
    // iterate over the pixels & render
    for (const pixel of pixels) {
        fill(pixel.red, pixel.green, pixel.blue);
        text(pixel.char, pixel.x, pixel.y);
    }
}
const getColorVal = (delta) => noise(delta) * 150 + 100;
const getRedVal = (delta) => noise(delta) * 55 + 200;
// UI stuff
function setFormValues() {
    Object.keys(params).forEach((param) => {
        document.querySelector(`[name="${param}"]`).value = params[param];
    });
}
window.onload = () => {
    setParamsFromUrl();
    setFormValues();
    document.querySelector("#btnConfigure").addEventListener("click", configure);
    document.querySelector(".variables").addEventListener("submit", updateDrawing);
};
function configure() {
    const form = document.querySelector(".variables");
    if (form) {
        if (form.classList.contains("hidden")) {
            form.classList.remove("hidden");
            document.querySelector(".subtitle").classList.add("hidden");
            document.querySelector('[name="name"]').focus();
            document.querySelector('[name="name"]').select();
        }
        else {
            form.classList.add("hidden");
            document.querySelector(".subtitle").classList.remove("hidden");
        }
    }
}
function updateDrawing(ev) {
    ev.preventDefault();
    Object.keys(params).forEach((param) => {
        params[param] = document.querySelector(`[name="${param}"]`).value;
    });
    document.querySelector(".variables").classList.add("hidden");
    document.querySelector(".subtitle").classList.remove("hidden");
    updateURL();
}
function updateURL() {
    const urlParams = new URLSearchParams(location.search);
    Object.keys(params).forEach((param) => {
        urlParams.set(param, params[param]);
    });
    const newUrl = penFullURL + "?" + urlParams.toString();
    navigator.clipboard.writeText(newUrl);
    alert("Drawing updated and copied shareable URL. Share it with you friend on his/her birthday!!");
}
function setParamsFromUrl() {
    const urlParams = new URLSearchParams(location.search);
    for (const [key, value] of urlParams.entries()) {
        if (params.hasOwnProperty(key)) {
            params[key] = value;
        }
    }
}