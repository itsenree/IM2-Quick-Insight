async function init() {
}

document.querySelectorAll(".loadCards").forEach((button) => {
    button.addEventListener("click", async () => {
        console.log(button.value);

        const response = await fetch("https://tarotapi.dev/api/v1/cards/random?n=" + button.value);
        const data = await response.json();
        
        const cards = data.cards;
        const selectedData = cards.map(card => ({
            name_short: card.name_short,
            name: card.name,
            type: card.type,
            value: card.value_int,
            meaning_rev: card.meaning_rev,
            meaning_up: card.meaning_up
        }));

        const meaningsUp = selectedData.map(card => card.meaning_up);

        console.log(selectedData);
        // console.log(data);
    })
})

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
    //   alert(`You clicked on ${card.querySelector('h3').textContent}`);
      // Add your custom logic here
    });
  });

// await init();


document.querySelectorAll('.loadCards').forEach((button, index) => {
  button.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default behavior

    // Check if the card has already been clicked
    if (button.classList.contains('active')) {
      // Display the already displayed card's name, details, and meaning
      const cardNameContainer = document.querySelector('.card_name');
      const cardDetailsContainer = document.querySelector('.card_details');
      const cardMeaningContainer = document.querySelector('.card_meaning');

      if (cardNameContainer) {
        const displayedName = button.getAttribute('data-card-name');
        cardNameContainer.textContent = displayedName;
      }

      if (cardDetailsContainer) {
        const displayedDetails = button.getAttribute('data-card-details');
        cardDetailsContainer.textContent = displayedDetails;
      }

      if (cardMeaningContainer) {
        const displayedMeaning = button.getAttribute('data-card-meaning');
        cardMeaningContainer.textContent = displayedMeaning;
      }

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
      button.style.backgroundSize = 'cover'; // Ensure the image covers the button
      button.style.backgroundPosition = 'center'; // Center the image
      button.style.color = 'white'; // Adjust text color for visibility

      // Rotate the image if the meaning is "rev"
      if (!showMeaningUp) {
        button.style.transform = 'rotate(180deg)';
      } else {
        button.style.transform = 'rotate(0deg)'; // Reset rotation for "up"
      }

      // Store card information in data attributes for reuse
      button.setAttribute('data-card-name', showMeaningUp ? card.name : `${card.name} (Reversed)`);
      button.setAttribute('data-card-details', `${card.type} | ${card.suit} | weight ${card.value_int}`);
      button.setAttribute('data-card-meaning', meaning);

      // Display the card's name in the card_name container
      const cardNameContainer = document.querySelector('.card_name');
      if (cardNameContainer) {
        cardNameContainer.textContent = showMeaningUp ? card.name : `${card.name} (Reversed)`;
      }

      // Display the card's details in the card_details container
      const cardDetailsContainer = document.querySelector('.card_details');
      if (cardDetailsContainer) {
        cardDetailsContainer.textContent = `${card.type} | ${card.suit} | weight ${card.value_int}`;
      }

      // Display the card's meaning in the card_meaning container
      const cardMeaningContainer = document.querySelector('.card_meaning');
      if (cardMeaningContainer) {
        cardMeaningContainer.textContent = meaning; // Use the 'meaning' variable
      }

    } catch (error) {
      console.error('Error fetching card:', error);
    }
  });
});