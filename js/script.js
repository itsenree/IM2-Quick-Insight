async function init() {
}

/* --- Card-loader from API + Other details --- */
// Array to track displayed cards
const displayedCards = [];

document.querySelectorAll('.loadCards').forEach((button, index, buttons) => {
  button.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default behavior

    const cardDiv = button.closest('.card');
    const floatingTextBox = document.getElementById('floating_textbox');

    // Remove active classes from all cards
    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('card_active', 'reversed_card_active');
    });

    // If already clicked, just show stored info
    if (button.classList.contains('active')) {
      const cardName = button.getAttribute('data-card-name');
      const cardDetails = button.getAttribute('data-card-details');
      const cardMeaning = button.getAttribute('data-card-meaning');

      const cardNameContainer = document.querySelector('.card_name');
      const cardDetailsContainer = document.querySelector('.card_details');
      const cardMeaningContainer = document.querySelector('.card_meaning');

      if (cardNameContainer) cardNameContainer.textContent = cardName;
      if (cardDetailsContainer) cardDetailsContainer.textContent = cardDetails;
      if (cardMeaningContainer) cardMeaningContainer.textContent = cardMeaning;

      if (floatingTextBox) {
        floatingTextBox.innerHTML = `
          <h1 class="card_name">${cardName}</h1>
          <h3 class="card_details">${cardDetails}</h3>
          <p class="card_meaning">${cardMeaning}</p>
        `;
      }

      // Apply visual state to the card
      if (cardDiv.classList.contains('rotated')) {
        cardDiv.classList.add('reversed_card_active');
      } else {
        cardDiv.classList.add('card_active');
      }

      return; // Skip fetching new card
    }

    // Mark the button as clicked
    button.classList.add('active');

    try {
      let card;
      do {
        const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=1');
        const data = await response.json();
        card = data.cards[0];
      } while (displayedCards.includes(card.name_short));
      displayedCards.push(card.name_short);

      const showMeaningUp = Math.random() < 0.5;
      const meaning = showMeaningUp ? card.meaning_up : card.meaning_rev;
      const cardNameText = showMeaningUp ? card.name : `${card.name} (Reversed)`;
      const cardDetailsText = `${card.type} | ${card.suit} | weight ${card.value_int}`;
      const imageUrl = `https://www.sacred-texts.com/tarot/pkt/img/${card.name_short}.jpg`;

      // Update button background
      button.style.backgroundImage = `url('${imageUrl}')`;
      button.style.backgroundSize = 'cover';
      button.style.backgroundRepeat = 'no-repeat';
      button.style.backgroundPosition = 'center';
      button.style.border = '5px solid #e7e3b5';
      button.style.borderRadius = '10px';

      // Rotate if reversed
      if (!showMeaningUp) {
        cardDiv.classList.add('rotated');
        cardDiv.classList.add('reversed_card_active');
      } else {
        cardDiv.classList.remove('rotated');
        cardDiv.classList.add('card_active');
      }

      // Store data attributes
      button.setAttribute('data-card-name', cardNameText);
      button.setAttribute('data-card-details', cardDetailsText);
      button.setAttribute('data-card-meaning', meaning);

      // Update UI
      const cardNameContainer = document.querySelector('.card_name');
      const cardDetailsContainer = document.querySelector('.card_details');
      const cardMeaningContainer = document.querySelector('.card_meaning');

      if (cardNameContainer) cardNameContainer.textContent = cardNameText;
      if (cardDetailsContainer) cardDetailsContainer.textContent = cardDetailsText;
      if (cardMeaningContainer) cardMeaningContainer.textContent = meaning;

      if (floatingTextBox) {
        floatingTextBox.innerHTML = `
          <h1 class="card_name">${cardNameText}</h1>
          <h3 class="card_details">${cardDetailsText}</h3>
          <p class="card_meaning">${meaning}</p>
        `;
      }

      // Check if all cards are revealed
      const allRevealed = Array.from(buttons).every(btn => btn.classList.contains('active'));
      if (allRevealed) {
        const instructionContainer = document.querySelector('.instruction');
        if (instructionContainer) {
          instructionContainer.textContent = ' ';
          instructionContainer.style.margin = '0px auto 0px auto';

          const pullAgainButton = document.createElement('button');
          pullAgainButton.id = 'pull-again';
          pullAgainButton.textContent = 'Pull Again?';
          pullAgainButton.style.backgroundColor = '#564e8b';
          pullAgainButton.style.color = 'white';
          pullAgainButton.style.padding = '10px 20px';
          pullAgainButton.style.border = '1px solid white';
          pullAgainButton.style.borderRadius = '5px';
          pullAgainButton.style.cursor = 'pointer';
          pullAgainButton.style.fontSize = '18px';
          pullAgainButton.style.textAlign = 'center';
          pullAgainButton.style.display = 'inline-block';

          instructionContainer.appendChild(pullAgainButton);
          pullAgainButton.addEventListener('click', () => {
            window.location.href = '../index.html';
          });
        }
      }

    } catch (error) {
      console.error('Error fetching card:', error);
    }
  });
});


/* --- Textbox Stuff --- */
// Function to handle the floating textbox for mobile screens
function handleFloatingTextBox() {
  const existingTextBox = document.getElementById('floating_textbox');
  const cardInfoContainer = document.querySelector('.card_info_container'); // Reference the card info container

  // Check if the screen width is small (e.g., max-width: 768px)
  if (window.innerWidth <= 768) {
    // Create the floating textbox if it doesn't already exist
    if (!existingTextBox) {
      const floatingTextBox = document.createElement('div');
      floatingTextBox.id = 'floating_textbox';
      floatingTextBox.classList.add('floating_textbox');
      floatingTextBox.style.display = 'none'; // Initially hide the textbox
      document.body.appendChild(floatingTextBox);
    }

    // Hide the card_info_container in mobile view
    if (cardInfoContainer) {
      cardInfoContainer.style.display = 'none';
    }
  } else {
    // Remove the floating textbox if the screen is larger than 768px
    if (existingTextBox) {
      existingTextBox.remove();
    }

    // Show the card_info_container in desktop view
    if (cardInfoContainer) {
      // cardInfoContainer.style.display = 'block';
    }
  }
}

// Function to update the floating textbox with card data
function updateFloatingTextBox(button) {
  const floatingTextBox = document.getElementById('floating_textbox');
  const cardInfoContainer = document.querySelector('.card_info_container'); // Reference the card info container

  if (!floatingTextBox) return;

  // Fetch the card's data attributes
  const cardName = button.getAttribute('data-card-name') || '';
  const cardDetails = button.getAttribute('data-card-details') || '';
  const cardMeaning = button.getAttribute('data-card-meaning') || '';

  // Populate the floating textbox with the card's data
  floatingTextBox.innerHTML = `
    <h1 class="card_name">${cardName}</h1>
    <h3 class="card_details">${cardDetails}</h3>
    <p class="card_meaning">${cardMeaning}</p>
  `;

  // Show the floating textbox
  floatingTextBox.style.display = 'block';

  // Update the card_info_container content (for desktop view)
  if (cardInfoContainer && window.innerWidth > 768) {
    cardInfoContainer.innerHTML = `
      <h1 class="card_name">${cardName}</h1>
      <h3 class="card_details">${cardDetails}</h3>
      <p class="card_meaning">${cardMeaning}</p>
    `;
  }
}

/* --- Card-loader for Mobile view (Textbox) --- */
// Event listener for card clicks
document.querySelectorAll('.loadCards').forEach((button, index, buttons) => {
  button.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default behavior

    // Reference the parent div of the button
    const cardDiv = button.closest('.card'); // Find the nearest parent with the class 'card'

    // Check if the card has already been clicked
    if (button.classList.contains('active')) {
      // Update the floating textbox with the already displayed card's data
      updateFloatingTextBox(button);
      return; // Exit the function to prevent fetching a new card
    }

    // Mark the card as active
    button.classList.add('active');

    try {
      // Fetch a random card from the API
      const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=1');
      const data = await response.json();
      const card = data.cards[0]; // Get the first card from the response

      // Randomly decide whether to show meaning_up or meaning_rev
      const showMeaningUp = Math.random() < 0.5; // 50% chance for each
      const meaning = showMeaningUp ? card.meaning_up : card.meaning_rev;

      // Set the background image using the short name
      const imageUrl = `https://www.sacred-texts.com/tarot/pkt/img/${card.name_short}.jpg`;
      button.style.backgroundImage = `url('${imageUrl}')`;
      button.style.backgroundSize = 'cover'; // Ensure the image fits the height of the container
      button.style.backgroundRepeat = 'no-repeat'; // Prevent the image from repeating
      button.style.backgroundPosition = 'center'; // Center the image

      // Add the appropriate class to the clicked card
      if (!showMeaningUp) {
        cardDiv.classList.add('rotated'); // Ensure the card is rotated
        cardDiv.classList.add('reversed_card_active'); // Add the reversed active class for reversed cards
      } else {
        cardDiv.classList.remove('rotated'); // Remove rotation for upright cards
        cardDiv.classList.add('card_active'); // Add the upright active class for upright cards
      }

      // Store card information in data attributes for reuse
      button.setAttribute('data-card-name', showMeaningUp ? card.name : `${card.name} (Reversed)`);
      button.setAttribute('data-card-details', `${card.type} | ${card.suit} | weight ${card.value_int}`);
      button.setAttribute('data-card-meaning', meaning);

      // Update the floating textbox with the fetched card's data
      updateFloatingTextBox(button);

    } catch (error) {
      console.error('Error fetching card:', error);
    }
  });
});

// Add event listener for DOMContentLoaded
window.addEventListener('DOMContentLoaded', handleFloatingTextBox);
window.addEventListener('resize', handleFloatingTextBox);

// Function to initialize the app
function initializeApp() {
  init(); // Call the init function
  handleFloatingTextBox(); // Handle floating textbox for mobile
}

// Initialize the app
initializeApp();

