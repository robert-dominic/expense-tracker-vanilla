let expenses = [];

const addExpense = document.getElementById('expense-form');
const date = document.getElementById('date');
const category = document.getElementById('category');
const description = document.getElementById('description');
const amount = document.getElementById('amount');

addExpense.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Adding expenses...");

    dateInput = date.value;
    categoryInput = category.value.trim().toLowerCase();
    descriptionInput = description.value.trim().toLowerCase();
    amountInput = amount.value;

    console.log(dateInput, categoryInput, descriptionInput, amountInput);

    const expenseObject = {
      id: Date.now(),
      date: dateInput,
      category: categoryInput,
      description: descriptionInput,
      amount: amountInput,
    }
    expenses.push(expenseObject);
    console.log(expenseObject);
    return;
});
