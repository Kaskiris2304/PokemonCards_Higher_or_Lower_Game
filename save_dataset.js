

const apiKey = 'eac8b32e-f2da-4f73-b667-7496e8a702e4';  // Replace with your actual API key
const totalCards = 18000;  // Total number of cards in the Pokémon TCG API
const pageSize = 100;  // Number of cards per page
const numPages = Math.ceil(totalCards / pageSize);  // Calculate total number of pages
const excludedRarities = ["Common", "Uncommon"]; // Rarities to exclude


async function fetchCardsFromApi() {
    let allCards = [];
    const fs = require('fs');
    const { default: fetch } = await import('node-fetch');
    let totalFilteredCount = 0; // Variable to track the total count


    for (let page = 1; page <= numPages; page++) {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?pageSize=${pageSize}&page=${page}`, {
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            console.error(`Error fetching page ${page}: ${response.statusText}`);
            continue;
        }

        const data = await response.json();

        const filteredCards = data.data.filter(card => {
            // Exclude cards with "Common" or "Uncommon" rarity
            if (card.rarity && excludedRarities.includes(card.rarity)) {
                return false;
            }

            // Debugging: Log rare cards to inspect data
            // if (card.rarity === "Rare") {
            //     console.log(`Rare card found: ${card.name}, Release Date: ${card.set.releaseDate}`);
            // }

            // Exclude "Rare" cards with a release date after 2012
            if (card.rarity === "Rare" && card.set.releaseDate) {
                const releaseYear = parseInt(card.set.releaseDate.split('/')[0]);
                if (releaseYear > 2012) {
                    //console.log(`Excluding Rare card: ${card.name}, Release Date: ${card.set.releaseDate}`);
                    return false;
                }
            }

            return true; // Include all other cards
        });

        allCards = [...allCards, ...filteredCards];
        console.log(`Fetched ${filteredCards.length} cards from page ${page}`);
        totalFilteredCount += filteredCards.length;

    }

    // Save the fetched cards to a JSON file
    fs.writeFileSync('cardsData4.json', JSON.stringify(allCards, null, 2), 'utf8');

    console.log(`Total number of filtered cards: ${totalFilteredCount}`);

    console.log('Cards have been saved to cardsData.json');
}

fetchCardsFromApi().catch(error => {
    console.error('Error while fetching cards:', error);
});
