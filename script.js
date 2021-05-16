// Grab all the elements
const wpmElement = document.getElementById('wpm');
const quoteElement = document.getElementById('quote');
const inputElement = document.getElementById('input');
const resetElement = document.getElementById('reset');

var currentQuote = "";

var firstInput = true;

var previousInputCount = 0;

var startTime = 0;
var stopTime = 0;

// Holds the amount of time it takes to type each word
var wordSplits = [];

// Generates quote and parses it into the html
async function newQuote() {
  currentQuote = await getRandomQuote();

  quoteElement.innerText = '';
  inputElement.value = '';

  // Break quote into individual words
  currentQuote.split(' ').forEach(word => {
    const wordElement = document.createElement('span');
    wordElement.classList.add('word');
    
    // Break this into individual characters
    word.split('').forEach(character => {
      const charElement = document.createElement('span');
      charElement.classList.add('character');

      // Drop fancy quotes
      if (character === "’") {
        character = "'";
      }

      charElement.innerText = character;
      wordElement.appendChild(charElement);
    });

    quoteElement.appendChild(wordElement);

    // Append a space
    const tempSpace = document.createElement('span');
    tempSpace.classList.add('space');
    tempSpace.innerText = ' ';
    quoteElement.appendChild(tempSpace);
  });

}

// Marks letters as correct or incorrect
function highlightErrors() {
  let inputWordArray = inputElement.value.split(' ');
  let inputCharArray = inputElement.value.split('');

  let restBlank = false;
  let currentWord = 0;
  let totalIndex = 0;

  // Loop through by word (odd indexes contain spaces)
  let wordArray = quoteElement.children;
  for (let i = 0; i < wordArray.length; i++) {
    let wordIndex = 0;

    // Calculate wpm if it is a space and then continue
    if (i % 2 != 0) {
      totalIndex++;
      continue;
    }

    // Loop through the word
    let charArray = wordArray[i].children;
    for (let j = 0; j < charArray.length; j++) {

      // Check if input for that word exceeds expected
      if (j === charArray.length - 1 &&
        currentWord < inputWordArray.length &&
        inputWordArray[currentWord].length > charArray.length) {
          totalIndex += inputWordArray[currentWord].length - charArray.length + 1;
          break;
      }

      // Make sure we won't blow up by exceeding inputCharArry
      restBlank = totalIndex >= inputCharArray.length;

      if (restBlank) {
        charArray[j].classList.remove('correct');
        charArray[j].classList.remove('incorrect');
      }
      else if (charArray[j].innerText === inputWordArray[currentWord].split('')[wordIndex]) {
        charArray[j].classList.add('correct');
        charArray[j].classList.remove('incorrect');
      }
      else {
        charArray[j].classList.add('incorrect');
        charArray[j].classList.remove('correct');
      }
      wordIndex++;
      totalIndex++;
    }
    currentWord++;

  }

}

// Calculates average of WPM
function calculateWPM() {
  let sum = 0;
  for (let i = 0; i < wordSplits.length; i++) {
    sum += wordSplits[i];
  }

  let avgWPM = Math.round(60 / (sum / wordSplits.length));

  if (wordSplits.length > 1) {
    wpmElement.innerText = String(avgWPM) + " WPM";
  }

}

// Checks to see if the quote is complete
function isComplete() {
  return currentQuote === inputElement.value;
}

// Runs after each edit
function update() {
  highlightErrors();

  calculateWPM();

  if (isComplete()) {
    firstInput = true;
    newQuote();

  }

  previousInputCount = inputElement.value.split(' ').length;

}

// To be run on each input
function eachInput(event) {
    // Check if space was pressed
    if (event.data === " ") {
      stopTime = new Date();
      wordSplits.push((stopTime - startTime) / 1000);
      console.log((stopTime - startTime) / 1000);
      startTime = new Date();
  
    }
  
  
    // Start timer on first input
    if (firstInput) {
      startTime = new Date();
    }
  
    update();
  
    firstInput = false;
}


newQuote();

// Run this on each input
inputElement.addEventListener('input', eachInput);

// Reset if reset button is pressed
resetElement.addEventListener('click', () => {
  wordSplits.splice(0, wordSplits.length);
  wpmElement.innerText = '';
  newQuote();

  firstInput = true;
})