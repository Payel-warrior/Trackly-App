const balance = document.getElementById("balance");
const Income = document.getElementById("Income");
const Expense = document.getElementById("Expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const textError = document.getElementById("text-error");
const amountError = document.getElementById
("amount-error");
const successMsg = document.getElementById("success-msg");

const localStorageTransactions = JSON.parse (
    localStorage.getItem('transactions')
)

let transactions = 
    localStorage.getItem ('transactions') !== null 
        ? localStorageTransactions
        : [];


// show the successMsg
function showSuccess(message) {
    successMsg.innerText =  `✅ ${message}`;
    successMsg.style.display = "block";

    setTimeout(() => {
        successMsg.style.display = "none"
        successMsg.innerText ="";
    }, 10000);
}

//add transaction to the dom list
function addTransactionToDOM(transaction) {
    //get the sign plus or minus
    const sign = transaction.amount < 0 ? "-" : "+"
    const item = document.createElement('li')

    //add classes based on the values
    item.classList.add(transaction.amount < 0 ? "Expense" : "Income")
    item.innerHTML = `
      <div>
    <strong>${transaction.text}</strong><br>
    <small style="transaction-date">${transaction.date || ""}</small>
  </div>
       <span>${sign}${Number(Math.abs(transaction.amount)).toFixed(2)}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
    `;
     list.appendChild(item);
};

//update the balance
function updateValues ( ){
    const amounts = transactions.map((transaction) => transaction.amount)
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter((item)=> item > 0)
        .reduce((acc,item) => (acc += item), 0)
        .toFixed(2);

    const expense = 
    amounts
    .filter((item)=> item < 0)
    .reduce((acc,item) => (acc += item), 0) * -1
    .toFixed(2);
    
    balance.innerText = `${total}`
    Income.innerHTML =`${income}`
    Expense.innerHTML =`${expense}`
}

//delete the transaction by id
function removeTransaction(id){
    transactions = transactions.filter((transaction)=> transaction.id !== id )
    updateLocalStoarge()

    init()
}
//update the local storage
function updateLocalStoarge(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
//validate the inputs
function validateInputs() {
    let isValid = true;
    const nameValue = text.value.trim();
    const amountValue = Number(amount.value)

    //reset all the errors
    textError.style.display = "none";
    amountError.style.display = "none";

    // validate the name of transaction
    if (nameValue === "" || !/^[a-zA-Z]/.test(nameValue)){
        textError.innerText ="**A valid Transaction name is required it must start with a letter"
        textError.style.display ="block";
        isValid = false
    }
    //validate the amount
    if (amount.value.trim() === "" || amountValue === 0 ) {
       amountError.innerText = "**Amount can't be empty and must be a non-zero value"
       amountError.style.display = "block";
       isValid = false;
    }
    return isValid;
    
}

// add transaction
function addTransaction(e){
    e.preventDefault();

if (!validateInputs()) return;
    
        const transaction = {
            id: generateId(),
            text: text.value,
            amount: +amount.value,
            date: new Date().toLocaleDateString("en-IN")
        };

        transactions.push(transaction);

        addTransactionToDOM(transaction);

        updateLocalStoarge();

        updateValues();

        text.value = "";
        amount.value = "";


        //success
        showSuccess("Transaction added successfully")
    }


//initializing the app

function init() {
    list.innerHTML= ''
    transactions.forEach(addTransactionToDOM);
    updateValues()
}

init();


//generate a random id 
function generateId(){
    return Math.floor(Math.random() * 1000000);
}

form.addEventListener('submit', addTransaction);