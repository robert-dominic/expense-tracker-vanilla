let expenses = [];

const addExpense = document.getElementById('expense-form');
const date = document.getElementById('date');
const category = document.getElementById('category');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const filterContainer = document.getElementById('filter-container');
const expenseCard = document.getElementById('expense');
const totalExpenses = document.getElementById('total-expenses');
const filterButtons = document.querySelectorAll('.filter-option');

addExpense.addEventListener('submit', (e) => {
    e.preventDefault(); // avoid form refresh

    // get user inputs
    dateInput = date.value;
    categoryInput = category.value.trim().toLowerCase();
    descriptionInput = description.value.trim().toLowerCase();
    amountInput = amount.value;

    // Expense object to store user inputs
    const expenseObject = {
      id: Date.now(),
      date: dateInput,
      category: categoryInput,
      description: descriptionInput,
      amount: amountInput,
    }
    expenses.push(expenseObject); // store the object in the expense arr
    saveToLocalStorage();
    handleExpense();
    addExpense.reset(); // reset the form
    return;
});

function handleExpense(expenseToShow, expenseToCalculate) {
    const expensesToDisplay = expenseToShow || expenses; // show filtered or all expenses
    expenseCard.innerHTML = "";
    expensesToDisplay.forEach(exp => {
        // create a card and put the user's input there
        const card = document.createElement("div");
        card.classList.add("expenses-card");

        card.innerHTML = `
          <div>
            <span>${exp.amount}</span>
            <span>${exp.category}</span>
          </div>
          <p>${exp.description}</p>
          <p>${exp.date}</p>
          <button class="delete-btn" data-id="${exp.id}">Delete</button>
        `;

        expenseCard.appendChild(card);
    });
    calculateTotal(expenseToCalculate);
};

// Delete and update
function handleDeleteExpense(id) {
  expenses = expenses.filter((exp) => exp.id !== id ); // keep the id that is not targeted
  saveToLocalStorage();
  handleExpense();
};

// event delegation
expenseCard.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id); // ID of the expense
    if (e.target.classList.contains("delete-btn")) {
        handleDeleteExpense(id);
    }
});

// Caculate and display total function
function calculateTotal(expenseToCalculate) {
   const totalToDisplay = expenseToCalculate || expenses; // calculate filtered or all expense
   const total = totalToDisplay.reduce((acc, exp) => {
    return acc + Number(exp.amount);
  }, 0);

  // Total number of expense object
  const totalObj = expenses.length;

  // Displays total expenses
  totalExpenses.textContent = `Total Expense${totalObj <= 1 ? '' : 's'}: ${total}`;
};

filterButtons[0].classList.add('active'); 

// listening for events on the filteredContainer (event delegation)
filterContainer.addEventListener('click', (e) => {
    const category = e.target.dataset.category;
    if(!category) return; // stop the function if a category isn't clicked.

    // remove active from the 'all-category'
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    e.target.classList.add('active');

    let filtered;
    
    if (category === 'all') {
        filtered = expenses; // show all expenses
    } else {
        filtered = expenses.filter((exp) => exp.category === category); // strictly show the selected category's expenses
    };
    handleExpense(filtered, filtered); // two params for the 'expenseToShow' & 'expenseToCalculate'
});

// Save to local storage 
function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

// Loads saved expenses on refresh
function loadFromLocalStorage() {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || []; // get any saved expense or an empty array on load
    expenses = savedExpenses;
    handleExpense();
};

// run this function once on-load
loadFromLocalStorage();