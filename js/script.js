// Initialization function (if needed later)
async function init() {}

/* --- Globals --- */
const displayedCards = []; // store names of already pulled cards to avoid duplicates

/* --- Helper Functions --- */

// update both mobile & desktop text containers with card info
function updateTextBoxes(cardName, cardDetails, cardMeaning) {
  const floatingTextBox = document.getElementById('floating_textbox');
  const cardInfoContainer = document.querySelector('.card_info_container');

  const html = `
    <h1 class="card_name">${cardName}</h1>
    <h3 class="card_details">${cardDetails}</h3>
    <p class="card_meaning">${cardMeaning}</p>
  `;

  if (floatingTextBox) {
    floatingTextBox.innerHTML = html;
    floatingTextBox.style.display = 'block';
  }

  if (cardInfoContainer && window.innerWidth > 768) {
    cardInfoContainer.innerHTML = html;
  }
}

// apply background image + styling to card button
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

// create "Pull Again?" button after all cards are drawn
function createPullAgainButton(container) {
  const pullAgainButton = document.createElement('button');
  pullAgainButton.id = 'pull-again';
  pullAgainButton.textContent = 'Pull Again?';

  // btn styles
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

  // hover styles
  pullAgainButton.addEventListener('mouseover', () => {
    pullAgainButton.style.backgroundColor = '#726cc4';
    pullAgainButton.style.color = '#ffffff';
  });
  pullAgainButton.addEventListener('mouseout', () => {
    pullAgainButton.style.backgroundColor = '#564e8b';
    pullAgainButton.style.color = 'white';
  });

  // reloads page
  pullAgainButton.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  container.appendChild(pullAgainButton);
}

// keep drawing cards until we get one we haven’t pulled yet
async function fetchUniqueCard() {
  let card;
  do {
    const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=1');
    const data = await response.json();
    card = data.cards[0];
  } while (displayedCards.includes(card.name_short));
  displayedCards.push(card.name_short);
  return card;
}

// handles switching between mobile + desktop text display
function handleFloatingTextBox() {
  const existingTextBox = document.getElementById('floating_textbox');
  const cardInfoContainer = document.querySelector('.card_info_container');

  if (window.innerWidth <= 768) {
    // mobile: add floating text box if it doesn’t exist
    if (!existingTextBox) {
      const floatingTextBox = document.createElement('div');
      floatingTextBox.id = 'floating_textbox';
      floatingTextBox.classList.add('floating_textbox');
      floatingTextBox.style.display = 'none';
      document.body.appendChild(floatingTextBox);
    }
    // hide desktop text container on mobile
    if (cardInfoContainer) cardInfoContainer.style.display = 'none';
  } else {
    // desktop: remove mobile floating box if exists
    if (existingTextBox) existingTextBox.remove();
    // restore desktop text container
    if (cardInfoContainer) cardInfoContainer.style.display = '';
  }
}

// adds event listeners to card buttons
function setupCardListeners() {
  const buttons = document.querySelectorAll('.loadCards');

  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();

      const cardDiv = button.closest('.card');

      // reset active styles for all cards
      document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('card_active', 'reversed_card_active');
      });

      const isActive = button.classList.contains('active');
      const name = button.getAttribute('data-card-name');
      const details = button.getAttribute('data-card-details');
      const meaning = button.getAttribute('data-card-meaning');

      if (isActive && name && details && meaning) {
        // if card already drawn, just show its info
        updateTextBoxes(name, details, meaning);
        cardDiv.classList.add(cardDiv.classList.contains('rotated') ? 'reversed_card_active' : 'card_active');
        return;
      }

      // otherwise, fetch a new card
      button.classList.add('active');

      try {
        const card = await fetchUniqueCard();
        const showMeaningUp = Math.random() < 0.5;
        const meaningText = showMeaningUp ? card.meaning_up : card.meaning_rev;
        const nameText = showMeaningUp ? card.name : `${card.name} (Reversed)`;
        const detailsText = `${card.type} | ${card.suit ?? 'N/A'} | weight ${card.value_int}`;
        const imageUrl = `https://www.sacred-texts.com/tarot/pkt/img/${card.name_short}.jpg`;

        styleCardButton(button, imageUrl); // set card image

        // apply reversed or upright styles
        if (!showMeaningUp) {
          cardDiv.classList.add('rotated', 'reversed_card_active');
        } else {
          cardDiv.classList.remove('rotated');
          cardDiv.classList.add('card_active');
        }

        // store info for re-click access
        button.setAttribute('data-card-name', nameText);
        button.setAttribute('data-card-details', detailsText);
        button.setAttribute('data-card-meaning', meaningText);

        updateTextBoxes(nameText, detailsText, meaningText);

        // once all buttons have cards, show "pull again?"
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

// initial setup when page loads
window.addEventListener('DOMContentLoaded', () => {
  handleFloatingTextBox();
  setupCardListeners();
  init();
});

// re-check layout when window is resized
window.addEventListener('resize', handleFloatingTextBox);
