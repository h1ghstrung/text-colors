// Text Color Generator functionality

// Create a variables to get elements
const getId = document.getElementById.bind(document);
const getClass = document.getElementsByClassName.bind(document);

// Global Variables
let textToColor = getId("baseText");
let startingColor = getId("startColor");
let endingColor = getId("endColor");
let stepNumber = getId("numberOfSteps");
let userText = "";
let output = "";
let outputHex = getId("outputHexCode");
let outputMinecraft = getId("outputMCCode");
let button = getId("submit");

// Value Set function
const setVal = (element, value) => {
  element.value = value
  element.textContent = value
};

// Add event listener for user name box id="baseText" and set number of color steps
textToColor.addEventListener('change', function(){
  userText = this.value;
  let steps = userText.length;
  setVal(stepNumber, steps);
})

// Add event listener for starting color id="startColor"
startingColor.addEventListener('change', function(){
  let scolorval = this.value;
  setVal(getId("startColorVal"), scolorval);
})

// Add event listener for ending color id="endColor"
endingColor.addEventListener('change', function(){
  let ecolorval = this.value;
  setVal(getId("endColorVal"), ecolorval);
})

// Add event listener for number of steps in case user changes id="numberOfSteps"
stepNumber.addEventListener('change', function(){
  null
})

// Add event listener to the color button id="submit"
submit.addEventListener('click', function() {
  let usrArray = textToArray(userText);
  let usrGradient = gradient(hexToRGB(startingColor.value.slice(1)), hexToRGB(endingColor.value.slice(1)), stepNumber.value);
  output = concatHex(usrGradient.grarray, usrArray);
  mcoutput = concatHex(usrGradient.mcarray, usrArray);
  outputHex.textContent = output;
  outputMinecraft.textContent = "/nick " + mcoutput;
  colorfy(output);
})

/**
 * Convert text to an array for each letter
 * @param {string} text String of text
 * @return {array} Returns an array of the string with each character as a single element in the array
 */
const textToArray = (text) => {
  return Array.from(text)
};

/**
 * Convert hex value to an array with RGB values
 * @param {string} hexval Hex value as a string without the # sign
 * @return {array} Returns an array of [R, G, B] values
 */
const hexToRGB = (hexval) => {
  let rgbval = [];
  let rgbHex = hexval.match(/.{1,2}/g);
  rgbval.push(parseInt(rgbHex[0], 16));
  rgbval.push(parseInt(rgbHex[1], 16));
  rgbval.push(parseInt(rgbHex[2], 16));
  return rgbval
};

/**
 * Convert RGB values to hex values
 * @param {array} rgbarray Array of RGB values
 * @return {string} Returns the hex value as a string.
 */
const rgbToHex = (rgbarray) => {
  let hexCol = "";
  let r = rgbarray[0].toString(16)
  if (r.length == 1) {r = "0" + r;}
  let g = rgbarray[1].toString(16)
  if (g.length == 1) {r = "0" + r;}
  let b = rgbarray[2].toString(16)
  if (b.length == 1) {r = "0" + r;}
  hexCol = "#" + r + g + b;
  return hexCol
};

/**
 * Steps up or down from start to end numbers in equal increments
 * @param {number} start Starting number
 * @param {number} end Ending number
 * @param {number} steps Number of steps to make
 * @return {array} Returns an array of numbers
 */
const colorStepper = (start, end, steps) => {
  let singlecolor = [];
  let diff = Math.abs(start-end);
  let interval = diff/(steps-1);
  let current = start;
  if (start > end) {
    for (i=0; i<steps; i++){
      singlecolor.push(Math.round(current))
      current -= interval;
    }
  } else if (start < end) {
    for (i=0; i<steps; i++){
      singlecolor.push(Math.round(current))
      current += interval;
    }
  }
  return singlecolor
};
 
/**
 * Color Gradient calculator
 * @param {array} start Starting set of RGB values
 * @param {array} end Ending set of RGB values
 * @param {number} steps Number of steps in color variance
 * @return {array} Returns an object of hex values with keys numbering from 0 - number of steps-1
 */
const gradient = (start, end, steps) => {
  let rrange = colorStepper(start[0], end[0], steps);
  let grange = colorStepper(start[1], end[1], steps);
  let brange = colorStepper(start[2], end[2], steps);
  // let grtable = {};
  let grarray = [];
  let mcarray = [];
  for (i=0; i<steps; i++) {
    // grtable[i] = rgbToHex([rrange[i], grange[i], brange[i]]);
    grarray.push(rgbToHex([rrange[i], grange[i], brange[i]]));
    mcarray.push("&" + rgbToHex([rrange[i], grange[i], brange[i]]));
  }
  return {grarray, mcarray}
};

/**
 * Takes an excess number of elements from an array and returns the elements on the end as a combined string.
 * @param {array} nameArray An array of string values
 * @param {integer} extra The number of elements to evaluate from the end of the array
 * @return {string} Returns the last elements of the array concatenated as a string.
 */
const extraChar = (nameArray, extra) => {
  let retstr = "";
  if (extra <= 0) {
    console.log("Nothing to return.");
    return retstr
  } else {
    retstr = nameArray.slice(nameArray.length-extra).join("");
  }
  return retstr
};

/**
 * Concatenate codes. Takes an array of hex codes and an array of strings and returns a combined long string
 * @param {array} codeArray Array containing hex color codes
 * @param {array} stringArray Array containing each letter of the string as it's own element
 * @return {string} Returns a string of hex color codes with letters mixed in
 */
const concatHex = (codeArray, stringArray) => {
  let codelen = codeArray.length;
  let strlen = stringArray.length;
  let tempstringarray = [...stringArray];
  let interval = Math.floor(strlen / codelen);
  let longstring = "";
  let leftover = "";
  if (codelen == strlen) {
    for (i=0; i < strlen; i++) {
      longstring += codeArray[i] +stringArray[i];
    }
  } else if (codelen < strlen) {
    let remainder = strlen % codelen;
    if (remainder > 0) {
      leftover = extraChar(stringArray, remainder);
      for (i = remainder-1; i >= 0; i--) {
        tempstringarray.pop();
      }
    }
    for (i=0; i<codelen; i++){
      longstring += codeArray[i]
      for (lt = 0; lt<interval; lt++) {
        longstring += tempstringarray[0];
        tempstringarray.shift();
      }
    }
  } else {
    console.log("Error: Code length cannot be longer than string length.");
  }
  longstring += leftover;
  return longstring;
}

/**
 * Removes all child nodes from the DOM under a parent node.
 * @param {DOM node} parent A node from the DOM.
 */
const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

/**
 * Takes a string argument and returns an array of two strings. This first item is the first six characters 
 * of the string argument. The second returned item is the rest of the characters from the argument.
 * @param {string} segment 
 * @return {array} Returns an array of two string items.
 */
const splitStr = (segment) => {
  let code = segment.substring(0,6);
  let strvals = segment.substring(6);
  return [code, strvals]
}

/**
 * Takes a string of hexcodes and characters and separates them into segments and creates span elements
 * in the DOM with the hex values as the color and the string characters as the text
 * @param {string} outstring A concatenated string containing Hex codes followed by characters
 * @returns {null} Doesn't return anything. Instead modifies the DOM directly
 */
const colorfy = (outstring) => {
  let outarea = getId("fontblock");
  removeAllChildNodes(outarea);
  let temparr = outstring.split("#");
  temparr.shift();
  for (i=0; i<temparr.length; i++) {
    let setTemps = splitStr(temparr[i]);
    let newnode = document.createElement("SPAN");
    newnode.style.color = "#"+setTemps[0];
    newnode.textContent = setTemps[1];
    outarea.appendChild(newnode);
  }
}
