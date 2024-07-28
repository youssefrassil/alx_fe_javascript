document.addEventListener('DOMContentLoaded', () => {
  let quotes = loadQuotes();
  const categoryFilter = document.getElementById('categoryFilter');

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
    const quoteDisplay = document.getElementById('quoteDisplay');
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
    document.getElementById('quoteDisplay').innerHTML = `<p>"${quote.text}" - ${quote.category}</p>`;
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
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
      filterQuotes(); // Update filter after importing quotes
    };
    fileReader.readAsText(event.target.files[0]);
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
});
