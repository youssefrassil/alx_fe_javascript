document.addEventListener('DOMContentLoaded', () => {
  let quotes = loadQuotes();

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const addQuoteButton = document.getElementById('addQuote');
  const exportQuotesButton = document.getElementById('exportQuotes');
  const importFileInput = document.getElementById('importFile');

  function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [
      { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Do or do not. There is no try.", category: "Motivation" },
    ];
  }

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}" - ${quote.category}</p>`;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }

  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      saveQuotes();
      alert('Quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  exportQuotesButton.addEventListener('click', exportQuotes);
  importFileInput.addEventListener('change', importFromJsonFile);

  // Load last viewed quote from session storage
  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `<p>"${quote.text}" - ${quote.category}</p>`;
  }
});
