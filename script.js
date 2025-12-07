let expenses = [];
let myChart = null;
let isEditing = false;
let editingID = null;

const addExpense = document.getElementById('expense-form');
const date = document.getElementById('date');
const category = document.getElementById('category');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const filterContainer = document.getElementById('filter-container');
const expenseCard = document.getElementById('expense');
const totalExpenses = document.getElementById('stat-total');
const filterButtons = document.querySelectorAll('.filter-option');
const dateFilter = document.getElementById('date-filter');
const addBtn = document.getElementById('add-btn');

addExpense.addEventListener('submit', (e) => {
    e.preventDefault(); // avoid form refresh

    if (isEditing) {
      //Find the arr using the editingID
      const expenseToUpdate = expenses.find((exp) => exp.id === editingID);

      //Update it's properties with the new form values
      expenseToUpdate.date = date.value;
      expenseToUpdate.category =category.value;
      expenseToUpdate.description =description.value;
      expenseToUpdate.amount = amount.value;

      //Exit edit mode
      isEditing = false;
      editingID = null;

      //Change back the button's text
      addBtn.textContent = 'Add Expense';
      handleExpense();
      saveToLocalStorage();
      addExpense.reset();
      return;
    }

    // Expense object to store user inputs
    const expenseObject = {
      id: Date.now(),
      date: date.value,
      category: category.value.trim(),
      description: description.value.trim(),
      amount: amount.value,
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
            <span>$${exp.amount}</span>
            <span>${exp.category}</span>
          </div>
          <p>${exp.description}</p>
          <p>${exp.date}</p>
          <div class="buttons-container">
            <button class="edit-btn" data-id="${exp.id}">Edit</button>
            <button class="delete-btn" data-id="${exp.id}">Delete</button>
          </div>
        `;

        expenseCard.appendChild(card);
    });
    updateStats(expenseToCalculate);
    renderChart();
};

// Delete Function
function handleDeleteExpense(id) {
  expenses = expenses.filter((exp) => exp.id !== id ); // keep the id that is not targeted
  saveToLocalStorage();
  handleExpense();
};

// Edit Function
function handleEditExpense(id) {
  const expenseToEdit = expenses.find((exp) => exp.id === id);

  //Populating the form with the values of the targeted id
  date.value = expenseToEdit.date;
  category.value = expenseToEdit.category;
  description.value = expenseToEdit.description;
  amount.value = expenseToEdit.amount;

  //Change the state
  isEditing = true;
  editingID = id;

  //Change the value of the Button
  addBtn.textContent = 'Update';
}

// event delegation
expenseCard.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id); // ID of the expense
    if (e.target.classList.contains("delete-btn")) {
        handleDeleteExpense(id);
    } else if (e.target.classList.contains("edit-btn")) {
      handleEditExpense(id);
    }
});

// Total & stats calculation
function updateStats(expenseToCalculate) {
  const displayExpenses = expenseToCalculate || expenses;

  // Total(filtered)
  const total = displayExpenses.reduce((acc, exp) => 
    acc + Number(exp.amount), 0)
  totalExpenses.textContent = `$${total}`;

  //Expenses Count(filtered)
  document.getElementById('stat-count').textContent = displayExpenses.length;

  //Average (filtered)
  const average = Number(total / displayExpenses.length).toFixed(2);
  document.getElementById('stat-average').textContent = `$${average}`;

  //This Month(never filtered)
  const currentMonth = new Date().getMonth(); 
  const currentYear = new Date().getFullYear();

  const thisMonthExpenses = expenses.filter((exp) => {
    const expenseDate = new Date(exp.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const thisMonthTotal = thisMonthExpenses.reduce((acc, exp) => 
    acc + Number(exp.amount), 0);
  document.getElementById('stat-month').textContent = `$${thisMonthTotal}`
}

// filtering by category
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

// date filtering
dateFilter.addEventListener('change', (e) => {
  const selectedValue = e.target.value;
  // console.log("Date filtering expenses of:", selectedValue)

  let daysBack;
  
  if (selectedValue === 'last-7-days') {
    daysBack = 7;
  } else if (selectedValue === 'last-30-days') {
    daysBack = 30;
  } else daysBack = null; // show 
  
  let cutoffDate;

  if (daysBack) {
    cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
  };

  let filteredByDate;
  
  if (daysBack === null) {
    filteredByDate = expenses; // show all expenses
  } else {
    filteredByDate = expenses.filter((exp) => {
      const expenseDate = new Date(exp.date)
      return expenseDate >= cutoffDate; // Keep if newer than cutoff
    });
  }
  console.log("Filtered expenses:", filteredByDate);
  handleExpense(filteredByDate, filteredByDate)
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

//load expenses from localStorage
loadFromLocalStorage();

//check for username on-load
let username = localStorage.getItem('user') || "";

if (!username) {
  username = prompt("Hello! What's your name?")
}

if (username) {
  localStorage.setItem('user', username)
}

if (username === null || "") {
  username = "Friend"
  localStorage.setItem('user', username)
}

// Display greeting
function displayGreeting() {
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) greeting = "Morning";
  else if (hour < 18) greeting = "How's the Day";
  else greeting = "Evening";

  document.getElementById('greeting').textContent = `${greeting}, ${username}!`;
};

displayGreeting();

// Chart 
function renderChart() {
  const ctx = document.getElementById('expense-chart');
  
  // Destroy old chart if it exists
  if (myChart) {
    myChart.destroy();
  }
  
  // Group expenses by category
  const groupedCat = expenses.reduce((acc, exp) => {
    if(!acc[exp.category]) {
      acc[exp.category] = 0;
    }
    acc[exp.category] += Number(exp.amount);
    return acc;
  }, {});

  // Extract labels and values
  const labels = Object.keys(groupedCat);
  const values = Object.values(groupedCat);

  // Create new chart
  myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            generateLabels: function(chart) {
              const data = chart.data;
              return data.labels.map((label, i) => ({
                text: label.charAt(0).toUpperCase() + label.slice(1),
                fillStyle: data.datasets[0].backgroundColor[i]
              }));
            }
          }
        },
        tooltip: {
          displayColors: true,
          callbacks: {
            title: function() {
              return '';
            },
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return label.charAt(0).toUpperCase() + label.slice(1) + ': $' + value;
            }
          }
        }
      }
    }
  });
};


