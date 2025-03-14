const apiKey = 'eac8b32e-f2da-4f73-b667-7496e8a702e4';  // Add your API key here
const apiUrl = 'https://api.pokemontcg.io/v2/cards';

// Function to fetch a random Pokémon card from the API
async function fetchRandomCard() {
  const response = await fetch(`${apiUrl}?pageSize=1&page=${Math.floor(Math.random() * 100)}`, {
    headers: { 'X-Api-Key': apiKey }
  });
  const data = await response.json();
  console.log(data); // Log the response to inspect the card data
  return data.data[0]; // Return the first card from the API response
}

// Function to display the fetched card details on the page
function displayCard(card, cardNumber) {
  const cardImg = document.getElementById(`card${cardNumber}-img`);
  const cardName = document.getElementById(`card${cardNumber}-name`);
  const cardPrice = document.getElementById(`card${cardNumber}-price`);

  cardImg.src = card.images.small;
  cardName.textContent = card.name;
  if (cardNumber === 1) {
    cardPrice.textContent = card.cardmarket?.prices?.trendPrice || 'Price not available';
  }
}

// Initialize the game and load two random cards
async function initGame() {
  const card1 = await fetchRandomCard();
  const card2 = await fetchRandomCard();

  displayCard(card1, 1);
  displayCard(card2, 2);

  // Store card prices for comparison
  window.card1Price = card1.tcgplayer?.prices?.market || 0;
  window.card2Price = card2.tcgplayer?.prices?.market || 0;
}

// Function to handle user guess (Higher or Lower)
function guess(choice) {
  const result = document.getElementById('result');

  // Retrieve card prices from global variables (set during initialization)
  const card1Price = window.card1Price;
  const card2Price = window.card2Price;

  // Check the user's guess
  if (choice === 'higher' && card2Price > card1Price) {
    result.textContent = 'Correct! Card 2 is Higher.';
  } else if (choice === 'lower' && card2Price < card1Price) {
    result.textContent = 'Correct! Card 2 is Lower.';
  } else {
    result.textContent = 'Wrong! Try Again.';
  }
}

// Function to restart the game
async function restartGame() {
  // Clear the result message
  document.getElementById('result').textContent = '';

  // Reinitialize the game
  await initGame();
}

// Initialize the game when the page loads
window.onload = () => {
  initGame();
};
