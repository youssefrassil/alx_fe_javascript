document.addEventListener('DOMContentLoaded', () => {
  let quotes = loadQuotes();

  const quoteDisplay = document.getElementById('quoteDisplay');
  const categoryFilter = document.getElementById('categoryFilter');

  async function fetchQuotesFromServer() {
    try {
      const response = await fetch('http://localhost:3000/quotes');
      const serverQuotes = await response.json();
      return serverQuotes;
    } catch (error) {
      console.error('Error fetching quotes from server:', error);
      return [];
    }
  }

  async function syncQuotesWithServer() {
    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes.length > 0) {
      // Simple conflict resolution: server data takes precedence
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      alert('Quotes synchronized with server!');
      filterQuotes(); // Refresh the quotes display
    }
  }

  function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
  }

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
    
    displayQuotes(filteredQuotes);
    localStorage.setItem('lastCategory', selectedCategory);
  }

  function displayQuotes(quotesToDisplay) {
    quoteDisplay.innerHTML = '';

    if (quotesToDisplay.length === 0) {
      quoteDisplay.textContent = 'No quotes available for this category.';
      return;
    }

    quotesToDisplay.forEach(quote => {
      const quoteParagraph = document.createElement('p');
      quoteParagraph.textContent = `"${quote.text}" - ${quote.category}`;
      quoteDisplay.appendChild(quoteParagraph);
    });
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
      const newQuote = { id: Date.now(), text, category }; // Using timestamp as unique ID
      quotes.push(newQuote);
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      saveQuotes();
      populateCategories();
      alert('Quote added successfully!');
      filterQuotes(); // Update filter after adding new quote
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
      quotes = [...importedQuotes];
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
      filterQuotes(); // Update filter after importing quotes
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function notifyConflictResolution() {
    alert('Data conflicts resolved with server data.');
  }

  const lastCategory = localStorage.getItem('lastCategory');
  if (lastCategory) {
    categoryFilter.value = lastCategory;
    filterQuotes();
  } else {
    displayQuotes(quotes); // Display all quotes initially
  }

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuote').addEventListener('click', addQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);

  populateCategories();

  // Periodically sync quotes with server every 5 minutes (300000 ms)
  setInterval(syncQuotesWithServer, 300000);
});
