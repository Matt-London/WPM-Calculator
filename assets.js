/*
* Adapted from https://dev.to/asaoluelijah/understanding-fetch-2-building-a-random-quote-generator-app-25nj
*/
const url = "https://api.quotable.io/random";
function getRandomQuote() {
  return fetch(url).then(response => response.json()).then(data => data.content);
}

