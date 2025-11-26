let expenses = [];

const addExpense = document.getElementById('expense-form');
const date = document.getElementById('date');
const category = document.getElementById('category');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const expenseCard = document.getElementById('expense');

addExpense.addEventListener('submit', (e) => {
    e.preventDefault();

    dateInput = date.value;
    categoryInput = category.value.trim().toLowerCase();
    descriptionInput = description.value.trim().toLowerCase();
    amountInput = amount.value;

    const expenseObject = {
      id: Date.now(),
      date: dateInput,
      category: categoryInput,
      description: descriptionInput,
      amount: amountInput,
    }
    expenses.push(expenseObject);
    handleExpense();
    addExpense.reset();
    return;
});

function handleExpense() {
    expenseCard.innerHTML = "";

    expenses.forEach(exp => {
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
};

function handleDeleteExpense(id) {
  expenses = expenses.filter((exp) => exp.id !== id );
  handleExpense()
}

expenseCard.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id); // ID of the expense
    if (e.target.classList.contains("delete-btn")) {
        handleDeleteExpense(id);
    }
})
