document.addEventListener('DOMContentLoaded', (event) => {
    const quotes = [
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The purpose of our lives is to be happy.", category: "Happiness" },
      { text: "Get busy living or get busy dying.", category: "Motivation" },
    ];
  
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
    }
  
    function addQuote() {
      const newQuoteText = document.getElementById('newQuoteText').value;
      const newQuoteCategory = document.getElementById('newQuoteCategory').value;
      if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('New quote added!');
      } else {
        alert('Please enter both a quote and a category.');
      }
    }
  
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('addQuote').addEventListener('click', addQuote);
  });
  