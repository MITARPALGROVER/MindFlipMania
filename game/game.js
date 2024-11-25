// Reference to the card grid container
const cardGrid = document.getElementById('card-grid');

// Function to start the game with a selected level
function startGame(level) {
    cardGrid.innerHTML = ''; // Clear the grid
    let cardCount;

    // Set card count based on level
    if (level === 'easy') {
        cardCount = 6; // 3 pairs
    } else if (level === 'medium') {
        cardCount = 12; // 6 pairs
    } else if (level === 'hard') {
        cardCount = 24; // 12 pairs
    }

    // Add appropriate class for grid styling
    cardGrid.className = level;

    // Generate cards dynamically
    generateCards(cardCount);
}

// Function to generate cards dynamically
function generateCards(cardCount) {
    // Create an array of matching pairs
    const cardValues = [];
    for (let i = 1; i <= cardCount / 2; i++) {
        cardValues.push(i, i); // Add pairs
    }

    // Shuffle the card values
    cardValues.sort(() => Math.random() - 0.5);

    // Create card elements
    cardValues.forEach((value) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = value;

        // Add click event to flip the card
        card.addEventListener('click', () => flipCard(card));

        cardGrid.appendChild(card);
    });
}

// Function to handle card flipping
function flipCard(card) {
    card.classList.add('flipped');
    card.textContent = card.dataset.value;

    // Logic for matching pairs can be added here
    // Example: Track flipped cards, check for match, and unflip if no match
}
