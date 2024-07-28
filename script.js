const quotesKey = 'quotesArray';

function loadQuotes() {
    const storedQuotes = localStorage.getItem(quotesKey);
    return storedQuotes ? JSON.parse(storedQuotes) : [];
}

let quotes = loadQuotes();

function saveQuotes() {
    localStorage.setItem(quotesKey, JSON.stringify(quotes));
}

function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerText = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `${quote.text} - ${quote.category}`;
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

document.getElementById('addQuoteButton').addEventListener('click', addQuote);

// Initially show a random quote
showRandomQuote();

function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function loadLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  return lastViewedQuote ? JSON.parse(lastViewedQuote) : null;
}

function showRandomQuote() {
  if (quotes.length === 0) {
      document.getElementById('quoteDisplay').innerText = "No quotes available.";
      return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerText = `${quote.text} - ${quote.category}`;
  saveLastViewedQuote(quote);
}

document.addEventListener('DOMContentLoaded', () => {
  const lastViewedQuote = loadLastViewedQuote();
  if (lastViewedQuote) {
      document.getElementById('quoteDisplay').innerText = `${lastViewedQuote.text} - ${lastViewedQuote.category}`;
  } else {
      showRandomQuote();
  }
});

function exportQuotes() {
  const quotesJson = JSON.stringify(quotes, null, 2);
  const blob = new Blob([quotesJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('exportQuotes').addEventListener('click', exportQuotes);

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

document.getElementById('importFile').addEventListener('change', importFromJsonFile);
