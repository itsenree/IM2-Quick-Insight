async function init() {
}

/* --- Card-loader from API + Other details --- */
document.querySelectorAll('.loadCards').forEach((button, index, buttons) => {
  button.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default behavior

    // Reference the parent div of the button
    const cardDiv = button.closest('.card'); // Find the nearest parent with the class 'card'

    // Remove active classes from all cards
    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('card_active', 'reversed_card_active'); // Remove both active classes
    });

    // Check if the card has already been clicked
    if (button.classList.contains('active')) {
      // Display the already displayed card's name, details, and meaning
      const cardNameContainer = document.querySelector('.card_name');
      const cardDetailsContainer = document.querySelector('.card_details');
      const cardMeaningContainer = document.querySelector('.card_meaning');
      const floatingTextBox = document.getElementById('floating_textbox'); // Get the floating textbox

      if (cardNameContainer) {
        const displayedName = button.getAttribute('data-card-name');
        cardNameContainer.textContent = displayedName;

        // Populate the floating textbox with the card's data
        floatingTextBox.innerHTML = `
          <h1 class="card_name">${displayedName}</h1>
          <h3 class="card_details">${button.getAttribute('data-card-details')}</h3>
          <p class="card_meaning">${button.getAttribute('data-card-meaning')}</p>
        `;
      }

      if (cardDetailsContainer) {
        const displayedDetails = button.getAttribute('data-card-details');
        cardDetailsContainer.textContent = displayedDetails;
      }

      if (cardMeaningContainer) {
        const displayedMeaning = button.getAttribute('data-card-meaning');
        cardMeaningContainer.textContent = displayedMeaning;
      }

      // Add the appropriate class to the clicked card
      if (cardDiv.classList.contains('rotated')) {
        cardDiv.classList.add('reversed_card_active'); // Add the reversed active class
      } else {
        cardDiv.classList.add('card_active'); // Add the upright active class
      }

      return; // Exit the function to prevent fetching a new card
    }

    // Mark the card as active
    button.classList.add('active');

    try {
      let card;
      do {
        // Fetch a random card from the API
        const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=1');
        const data = await response.json();
        card = data.cards[0]; // Get the first card from the response
      } while (displayedCards.includes(card.name_short)); // Repeat if the card has already been displayed

      // Add the card to the displayedCards array
      displayedCards.push(card.name_short);

      // Randomly decide whether to show meaning_up or meaning_rev
      const showMeaningUp = Math.random() < 0.5; // 50% chance for each
      const meaning = showMeaningUp ? card.meaning_up : card.meaning_rev;

      // Set the background image using the short name
      const imageUrl = `https://www.sacred-texts.com/tarot/pkt/img/${card.name_short}.jpg`;
      button.style.backgroundImage = `url('${imageUrl}')`;
      button.style.backgroundSize = 'cover'; // Ensure the image fits the height of the container
      button.style.backgroundRepeat = 'no-repeat'; // Prevent the image from repeating
      button.style.backgroundPosition = 'center'; // Center the image

      // Add a border to the button
      button.style.border = '5px solid #e7e3b5'; // Adjust the border size and color as needed
      button.style.borderRadius = '10px'; // Optional: Add rounded corners

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

      // Display the card's name in the card_name container
      const cardNameContainer = document.querySelector('.card_name');
      if (cardNameContainer) {
        const cardNameText = showMeaningUp ? card.name : `${card.name} (Reversed)`;
        cardNameContainer.textContent = cardNameText;

        // Update the floating textbox with the card's name
        if (floatingTextBox) {
          const floatingCardName = floatingTextBox.querySelector('.card_name');
          if (floatingCardName) {
            floatingCardName.textContent = cardNameText;
          } else {
            floatingTextBox.innerHTML += `<h1 class="card_name">${cardNameText}</h1>`;
          }
        }
      }

      // Display the card's details in the card_details container
      const cardDetailsContainer = document.querySelector('.card_details');
      if (cardDetailsContainer) {
        const cardDetailsText = `${card.type} | ${card.suit} | weight ${card.value_int}`;
        cardDetailsContainer.textContent = cardDetailsText;

        // Update the floating textbox with the card's details
        if (floatingTextBox) {
          const floatingCardDetails = floatingTextBox.querySelector('.card_details');
          if (floatingCardDetails) {
            floatingCardDetails.textContent = cardDetailsText;
          } else {
            floatingTextBox.innerHTML += `<h3 class="card_details">${cardDetailsText}</h3>`;
          }
        }
      }

      // Display the card's meaning in the card_meaning container
      const cardMeaningContainer = document.querySelector('.card_meaning');
      if (cardMeaningContainer) {
        cardMeaningContainer.textContent = meaning; // Use the 'meaning' variable

        // Update the floating textbox with the card's meaning
        if (floatingTextBox) {
          const floatingCardMeaning = floatingTextBox.querySelector('.card_meaning');
          if (floatingCardMeaning) {
            floatingCardMeaning.textContent = meaning;
          } else {
            floatingTextBox.innerHTML += `<p class="card_meaning">${meaning}</p>`;
          }
        }
      }

      // Check if all cards are revealed
      const allRevealed = Array.from(buttons).every(btn => btn.classList.contains('active'));
      if (allRevealed) {
        const instructionContainer = document.querySelector('.instruction');
        if (instructionContainer) {
          // Clear the instruction text
          instructionContainer.textContent = ' ';

          // Add the "Pull Again?" button
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

          // Append the button to the instruction container
          instructionContainer.appendChild(pullAgainButton);

          // Add event listener to the "Pull Again?" button
          pullAgainButton.addEventListener('click', () => {
            // Redirect to index.html
            window.location.href = '../index.html';
          });
        }
      }

    } catch (error) {
      console.error('Error fetching card:', error);
    }
  });
});

// Array to track displayed cards
const displayedCards = [];

 /* --- Code for the Textbox --- */
document.querySelectorAll('.loadCards').forEach((button, index) => {
  button.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default behavior

    // Check if the card has already been clicked
    if (button.classList.contains('active')) {
      // Display the already displayed card's name, details, and meaning
      const cardNameContainer = document.querySelector('.card_name');
      const cardDetailsContainer = document.querySelector('.card_details');
      const cardMeaningContainer = document.querySelector('.card_meaning');
      const floatingTextBox = document.getElementById('floating_textbox'); // Get the floating textbox

      if (cardNameContainer) {
        const displayedName = button.getAttribute('data-card-name');
        cardNameContainer.textContent = displayedName;

          // Populate the textbox with the card's data
  floatingTextBox.innerHTML = `
  <h1 class="card_name">${cardName}</h1>
  <h3 class="card_details">${cardDetails}</h3>
  <p class="card_meaning">${cardMeaning}</p>
`;
      }

      if (cardDetailsContainer) {
        const displayedDetails = button.getAttribute('data-card-details');
        cardDetailsContainer.textContent = displayedDetails;
          // Populate the textbox with the card's data
  floatingTextBox.innerHTML = `
  <h1 class="card_name">${cardName}</h1>
  <h3 class="card_details">${cardDetails}</h3>
  <p class="card_meaning">${cardMeaning}</p>
`;
      }

      if (cardMeaningContainer) {
        const displayedMeaning = button.getAttribute('data-card-meaning');
        cardMeaningContainer.textContent = displayedMeaning;
          // Populate the textbox with the card's data
  floatingTextBox.innerHTML = `
  <h1 class="card_name">${cardName}</h1>
  <h3 class="card_details">${cardDetails}</h3>
  <p class="card_meaning">${cardMeaning}</p>
`;
      }

      return; // Exit the function to prevent fetching a new card
    }

    // Mark the card as active
    button.classList.add('active');

    try {
      let card;
      do {
        // Fetch a random card from the API
        const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=1');
        const data = await response.json();
        card = data.cards[0]; // Get the first card from the response
      } while (displayedCards.includes(card.name_short)); // Repeat if the card has already been displayed

      // Add the card to the displayedCards array
      displayedCards.push(card.name_short);

      // Randomly decide whether to show meaning_up or meaning_rev
      const showMeaningUp = Math.random() < 0.5; // 50% chance for each
      const meaning = showMeaningUp ? card.meaning_up : card.meaning_rev;

      // Set the background image using the short name
      const imageUrl = `https://www.sacred-texts.com/tarot/pkt/img/${card.name_short}.jpg`;
      button.style.backgroundImage = `url('${imageUrl}')`;
      button.style.backgroundSize = 'cover'; // Ensure the image fits the height of the container
      button.style.backgroundRepeat = 'no-repeat'; // Prevent the image from repeating
      button.style.backgroundPosition = 'center'; // Center the image

      // Add a border to the button
      button.style.border = '5px solid #e7e3b5'; // Adjust the border size and color as needed
      button.style.borderRadius = '10px'; // Optional: Add rounded corners

      // Rotate the cardDiv if the meaning is "rev"
      const cardDiv = button.closest('.card'); // Find the nearest parent with the class 'card'
      if (!showMeaningUp) {
          cardDiv.classList.add('rotated'); // Add the 'rotated' class after rotation
      }

      // Store card information in data attributes for reuse
      button.setAttribute('data-card-name', showMeaningUp ? card.name : `${card.name} (Reversed)`);
      button.setAttribute('data-card-details', `${card.type} | ${card.suit} | weight ${card.value_int}`);
      button.setAttribute('data-card-meaning', meaning);

      // Display the card's name in the card_name container
      const cardNameContainer = document.querySelector('.card_name');
      const floatingTextBox = document.getElementById('floating_textbox'); // Get the floating textbox

      if (cardNameContainer) {
        const cardNameText = showMeaningUp ? card.name : `${card.name} (Reversed)`;
        cardNameContainer.textContent = cardNameText;

        // Update the floating textbox with the card's name
        if (floatingTextBox) {
          const floatingCardName = floatingTextBox.querySelector('.card_name');
          if (floatingCardName) {
            floatingCardName.textContent = cardNameText;
          } else {
            floatingTextBox.innerHTML += `<h1 class="card_name">${cardNameText}</h1>`;
          }
        }
      }

      // Display the card's details in the card_details container
      const cardDetailsContainer = document.querySelector('.card_details');
      if (cardDetailsContainer) {
        const cardDetailsText = `${card.type} | ${card.suit} | weight ${card.value_int}`;
        cardDetailsContainer.textContent = cardDetailsText;

        // Update the floating textbox with the card's details
        if (floatingTextBox) {
          const floatingCardDetails = floatingTextBox.querySelector('.card_details');
          if (floatingCardDetails) {
            floatingCardDetails.textContent = cardDetailsText;
          } else {
            floatingTextBox.innerHTML += `<h3 class="card_details">${cardDetailsText}</h3>`;
          }
        }
      }

      // Display the card's meaning in the card_meaning container
      const cardMeaningContainer = document.querySelector('.card_meaning');
      if (cardMeaningContainer) {
        cardMeaningContainer.textContent = meaning; // Use the 'meaning' variable

        // Update the floating textbox with the card's meaning
        if (floatingTextBox) {
          const floatingCardMeaning = floatingTextBox.querySelector('.card_meaning');
          if (floatingCardMeaning) {
            floatingCardMeaning.textContent = meaning;
          } else {
            floatingTextBox.innerHTML += `<p class="card_meaning">${meaning}</p>`;
          }
        }
      }

    } catch (error) {
      console.error('Error fetching card:', error);
    }
  });
});

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

// Event listener for card clicks
document.querySelectorAll('.loadCards').forEach((button, index, buttons) => {
  button.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default behavior

    // Reference the parent div of the button
    const cardDiv = button.closest('.card'); // Find the nearest parent with the class 'card'

    // Remove active classes from all cards
    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('card_active', 'reversed_card_active'); // Remove both active classes
    });

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

