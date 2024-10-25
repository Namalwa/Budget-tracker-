import fs from 'fs';
import {Command} from "commander";
import loadBudget from "./utils/loadbudget.js";

const program = new Command;

program.name("Budget_tracker").description("A command line interface for tracking your budget")

//Adding the budget
program.command("add")
.description("Adds the new budget")
.option("-t --title <title>","Budget title")
.option("-q --quantity <quantity>" ,"Quantity of items")
.option("-p --price <price>","Unit price of items")

.action(function(options){
    const title = options.title;
    const quantity = options.quantity;
    const price = options.price;

    const addbudget = {
        title : title,
        quantity : quantity,
        price : price,
        createdAt: new Date()
    }

    const Budgetdata = loadBudget("./Data/Budget.json");

    const budgetexists = Budgetdata.find((currentBudget) => currentBudget.title === title);
    if(budgetexists){
        console.log(`Budget with the title '${title}' already exists`)
        return;
    }

    Budgetdata.push(addbudget);

    fs.writeFileSync("./Data/Budget.json", JSON.stringify(Budgetdata));
    console.log(`New budget added successfully`)

   
});

//Read all budgets
program.command("read")
.description("read all the budgets added")
.option("-t, --title ,<title>", "title for specific budget to be read")
.action((options) => {
    const title = options.title;
    const allbudgets = loadBudget("./Data/Budget.json");
    if(title) {
        const Budget = allbudgets.find((Budget) => Budget.title === title);
    if (Budget){
        console.log(`${Budget.title} | ${Budget.quantity} | ${Budget.price}`)
        }else {
            console.log(`No budget found with title: ${title}`);
            return;
        }
        return;
    }
    
    if (allbudgets.length === 0){
        console.log("You dont have any budget saved yet");
        return;
    }
    allbudgets.forEach((Budget) =>{
        console.log(`${Budget.title} | ${Budget.quantity} | ${Budget.price}`)
    })
})

//deleting

program.command("delete")
.description("delete a specific budget")
    .option("-t, --title <title>", "title for the budget to be deleted")
    .action((options) =>{
        const title = options.title;
        const allbudgets = loadBudget("./Data/Budget.json");
        if (allbudgets.length === 0){
            console.log(`You dont have any budget`)
        return;
    }

    const remainingBudgets = allbudgets.filter((Budget) => Budget.title !== title);
    if (remainingBudgets.length === allbudgets.length) {
        console.log(`No user with title ${title}`);
        return; 
    }
    fs.writeFileSync("./Data/Budget.json", JSON.stringify(remainingBudgets));
    console.log("Budget deleted successfully");

    })


    //updating budgets
    program.command("update")
    .description("updating a budget")
    .option("-t, --title <title>", "title for budget to update")
    .option("-q, --quantity <quantity>", "new quantity")
    .option("-p, --price <quantity>", "new price")
    .action((options) =>{
        const title = options.title;
        const newquantity = options.quantity;
        const newprice = options.price;
    
        const allbudgets = loadBudget("./Data/Budget.json");

        const budgetIndex = allbudgets.findIndex((budget) => budget.title === title);

        if (budgetIndex === -1) {
            console.log(`No budget found with the title '${title}'`);
            return;
        }

        if (newquantity) {
            allbudgets[budgetIndex].quantity = newquantity;
        }
        if (newprice) {
            allbudgets[budgetIndex].price = newprice;
        }

        fs.writeFileSync("./Data/Budget.json", JSON.stringify(allbudgets, null, 2));

        console.log(`Budget '${title}' updated successfully.`);
    });
program.parse(process.argv)