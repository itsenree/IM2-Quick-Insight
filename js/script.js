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
