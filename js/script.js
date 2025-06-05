// Initialization function (if needed later)
async function init() {}

/* --- Globals --- */
// Array to track displayed cards to avoid duplicates
const displayedCards = [];

/* --- Helper Functions --- */
// Updates the text boxes with card details
function updateTextBoxes(cardName, cardDetails, cardMeaning) {
  const floatingTextBox = document.getElementById('floating_textbox');
  const cardInfoContainer = document.querySelector('.card_info_container');

  const html = `
    <h1 class="card_name">${cardName}</h1>
    <h3 class="card_details">${cardDetails}</h3>
    <p class="card_meaning">${cardMeaning}</p>
  `;

  // Update floating textbox for mobile view
  if (floatingTextBox) {
    floatingTextBox.innerHTML = html;
    floatingTextBox.style.display = 'block';
  }

  // Update card info container for desktop view
  if (cardInfoContainer && window.innerWidth > 768) {
    cardInfoContainer.innerHTML = html;
  }
}

// Styles the card button with an image and border
function styleCardButton(button, imageUrl) {
  Object.assign(button.style, {
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    border: '5px solid #e7e3b5',
    borderRadius: '10px'
  });
}

// Creates the "Pull Again?" button and adds it to the container
function createPullAgainButton(container) {
  const pullAgainButton = document.createElement('button');
  pullAgainButton.id = 'pull-again';
  pullAgainButton.textContent = 'Pull Again?';

  // Style the button
  Object.assign(pullAgainButton.style, {
    backgroundColor: '#564e8b',
    color: 'white',
    padding: '10px 20px',
    border: '1px solid white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    textAlign: 'center',
    display: 'inline-block',
    transition: 'background-color 0.3s ease, color 0.3s ease'
  });

  pullAgainButton.classList.add('hover-effect');

  // Add hover effects
  pullAgainButton.addEventListener('mouseover', () => {
    pullAgainButton.style.backgroundColor = '#726cc4';
    pullAgainButton.style.color = '#ffffff';
  });
  pullAgainButton.addEventListener('mouseout', () => {
    pullAgainButton.style.backgroundColor = '#564e8b';
    pullAgainButton.style.color = 'white';
  });

  // Redirect to the homepage on click
  pullAgainButton.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  container.appendChild(pullAgainButton);
}

// Fetches a unique card from the API
async function fetchUniqueCard() {
  let card;
  do {
    const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=1');
    const data = await response.json();
    card = data.cards[0];
  } while (displayedCards.includes(card.name_short)); // Ensure no duplicates
  displayedCards.push(card.name_short);
  return card;
}

// Handles the floating textbox for mobile view
function handleFloatingTextBox() {
  const existingTextBox = document.getElementById('floating_textbox');
  const cardInfoContainer = document.querySelector('.card_info_container');

  if (window.innerWidth <= 768) {
    // Create floating textbox if it doesn't exist
    if (!existingTextBox) {
      const floatingTextBox = document.createElement('div');
      floatingTextBox.id = 'floating_textbox';
      floatingTextBox.classList.add('floating_textbox');
      floatingTextBox.style.display = 'none';
      document.body.appendChild(floatingTextBox);
    }
    // Hide card info container in mobile view
    if (cardInfoContainer) cardInfoContainer.style.display = 'none';
  } else {
    // Remove floating textbox in desktop view
    if (existingTextBox) existingTextBox.remove();
    // Show card info container in desktop view
    if (cardInfoContainer) cardInfoContainer.style.display = '';
  }
}

// Sets up event listeners for card buttons
function setupCardListeners() {
  const buttons = document.querySelectorAll('.loadCards');

  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const cardDiv = button.closest('.card');

      // Remove active classes from all cards
      document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('card_active', 'reversed_card_active');
      });

      // Check if the card is already active
      const isActive = button.classList.contains('active');
      const name = button.getAttribute('data-card-name');
      const details = button.getAttribute('data-card-details');
      const meaning = button.getAttribute('data-card-meaning');

      if (isActive && name && details && meaning) {
        // Update text boxes with existing card data
        updateTextBoxes(name, details, meaning);
        cardDiv.classList.add(cardDiv.classList.contains('rotated') ? 'reversed_card_active' : 'card_active');
        return;
      }

      button.classList.add('active');
      try {
        // Fetch a new card and determine its orientation
        const card = await fetchUniqueCard();
        const showMeaningUp = Math.random() < 0.5;
        const meaningText = showMeaningUp ? card.meaning_up : card.meaning_rev;
        const nameText = showMeaningUp ? card.name : `${card.name} (Reversed)`;
        const detailsText = `${card.type} ${card.suit ? ' | ' + card.suit : ''} | weight ${card.value_int}`;
        const imageUrl = `https://www.sacred-texts.com/tarot/pkt/img/${card.name_short}.jpg`;

        // Style the card button
        styleCardButton(button, imageUrl);

        // Add appropriate classes based on orientation
        if (!showMeaningUp) {
          cardDiv.classList.add('rotated', 'reversed_card_active');
        } else {
          cardDiv.classList.remove('rotated');
          cardDiv.classList.add('card_active');
        }

        // Store card data in attributes
        button.setAttribute('data-card-name', nameText);
        button.setAttribute('data-card-details', detailsText);
        button.setAttribute('data-card-meaning', meaningText);

        // Update text boxes with new card data
        updateTextBoxes(nameText, detailsText, meaningText);

        // Check if all cards are revealed
        if ([...buttons].every(btn => btn.classList.contains('active'))) {
          const instructionContainer = document.querySelector('.instruction');
          if (instructionContainer) {
            instructionContainer.textContent = ' ';
            instructionContainer.style.margin = '0px auto';
            createPullAgainButton(instructionContainer);
          }
        }
      } catch (error) {
        console.error('Error fetching card:', error);
      }
    });
  });
}

// Event listeners for page load and resize
window.addEventListener('DOMContentLoaded', () => {
  handleFloatingTextBox();
  setupCardListeners();
  init();
});

window.addEventListener('resize', handleFloatingTextBox);
