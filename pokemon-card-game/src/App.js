// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // You can create your own CSS file for styling

const cardsDataset = require('./cardsData4.json'); // Assuming cards.json is in the src directory

const App = () => {
    const [card1, setCard1] = useState(null);
    const [card2, setCard2] = useState(null);
    const [result, setResult] = useState('');
    const [card1Price, setCard1Price] = useState(0);
    const [card2Price, setCard2Price] = useState(0);
    const [guessCount, setGuessCount] = useState(0); // Initialize guess count state
    const [revealCard2Price, setRevealCard2Price] = useState(false); // State to reveal card 2 price

    const fetchCard = () => {
        const randomIndex = Math.floor(Math.random() * cardsDataset.length);
        return cardsDataset[randomIndex];
    };

    const initGame = async () => {
        let fetchedCard1, fetchedCard2; // Declare variables outside of the if block
        if (guessCount == 0) {
          fetchedCard1 = fetchCard();
          fetchedCard2 = fetchCard();
        }
        else {
          fetchedCard1 = card2;
          fetchedCard2 = fetchCard();
        }

        console.log(fetchedCard1);

        setCard1(fetchedCard1);
        setCard2(fetchedCard2);
        setCard1Price(fetchedCard1.cardmarket?.prices?.trendPrice || 0);
        setCard2Price(fetchedCard2.cardmarket?.prices?.trendPrice || 0);
    };

    const guess = (choice) => {
        if ((choice === 'higher' && card2Price > card1Price) ||
            (choice === 'lower' && card2Price < card1Price)) {
            setResult('Correct!');
            setGuessCount(guessCount + 1); // Increment guess count
            setRevealCard2Price(true);
        } else {
            setResult('Wrong! Try Again.');
            setGuessCount(0)
            setRevealCard2Price(true);
        }
    };

    const restartGame = () => {
        setResult('');
        setRevealCard2Price(false);
        initGame();

    };

    useEffect(() => {
        initGame();
    }, []);

    return (
         <div className="container">
             <h1>Pokémon Higher or Lower: Card Prices</h1>

             <div className="card-container">
                 {/* Card 1 (Visible) */}
                 <div className="card" id="card1">
                     <img src={card1?.images?.large || 'https://via.placeholder.com/200'} alt={card1?.name || 'Pokémon Card'} id="card1-img" />
                     <h3 id="card1-name">{card1?.name || 'Card 1 Name'}</h3>
                     <p>Price: €<span id="card1-price">{(card1?.cardmarket?.prices?.trendPrice || 0).toFixed(2)}</span></p>
                 </div>

                 {/* VS text */}
                 <div className="vs">
                     <h2>VS</h2>
                 </div>

                 {/* Card 2 (Hidden Price) */}
                 <div className="card" id="card2">
                     <img src={card2?.images?.large || 'https://via.placeholder.com/200'} alt={card2?.name || 'Pokémon Card'} id="card2-img" />
                     <h3 id="card2-name">{card2?.name || 'Card 2 Name'}</h3>
                     <p>
                       Price: {revealCard2Price ? `$${card2.cardmarket?.prices?.trendPrice || 'Price not available'}` : '???'}
                     </p>
                 </div>
             </div>
             <div className="counter">Guess Count: {guessCount}</div> {/* Display the guess count */}
             <div className="controls">
                 <button onClick={() => guess('higher')}>Higher</button>
                 <button onClick={() => guess('lower')}>Lower</button>
                 <button onClick={restartGame}>
                    {guessCount === 0 ? 'Restart Game' : 'Next'}
                 </button>
             </div>

             <p id="result">{result}</p>
         </div>
     );
 };


export default App;
