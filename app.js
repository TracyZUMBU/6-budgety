// // var budgetController = (function() {

// //     var x = 23;

// //     var add = function(a) {                 //private data// Ici, o, peut pas avoir accès à 'add' car c'est une data privé
// //         return x + a;
// //     }

// //     return {
// //         publicTest: function(b) {           //public method // Ici, grace au return on peut utilisé la méthode publicTest qui elle à accès à la var 'add'. Ainsi on peut lui faire passer un paramètre.
// //              return add(b);
// //         }
// //     }
// // }) ();




// BUDGET CONTROLLER
var budgetController = (function() {
     
    var Expense = function(id,description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1;
        }

    }

    Expense.prototype.getPercentage = function() {
        return this.percentage
    }

    var Income = function(id,description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
         
        var sum = 0;

        data.allItems[type].forEach(function(cur) {

            sum += cur.value 

        });

        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc:[]
        },
        
        totals: {
            exp: 0,
            inc: 0
        },

        budget : 0,
        percentage :-1

    };

    return {
        addItems: function(type, des,val) {
            var newItem, ID;

            // Create new ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }else {
                ID = 0;
            }

            // create a new item based on 'inc' or 'exp' type
            if (type === 'exp'){

                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Expense(ID, des, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;

           ids = data.allItems[type].map(function(current) {
               return current.id; 
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1)
            }
        },

        Calculatebudget : function() {

            //calculate total income and expenses
                calculateTotal('exp')
                calculateTotal('inc')
            // Calculate th budget: income - expenses
                data.budget = data.totals.inc - data.totals.exp
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {

                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function() {

              data.allItems.exp.forEach(function (cur) {
                  cur.calcPercentage(data.totals.inc);
              })
        },

        getPercentages: function () {
          var allPerc = data.allItems.exp.map(function(cur) {
              return cur.getPercentage();
          });
          return allPerc
        },

        getBudget: function() {

            return  {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
            
        }
    };

    

}) ();




// UI CONTROLLER
var UIController = (function() {
     
    var DOMstrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue:'.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel: '.budget__income--value',
       expensesLabel: '.budget__expenses--value',
       percentageLabel: '.budget__expenses--percentage',
       container: '.container',
       expensesPercLabel: '.item__percentage'
    };

    return {
        getInput:function() {


            // permet de retouner plusieurs variables en même temps en les passant dans un objet
            return {

                type : document.querySelector(DOMstrings.inputType).value, // will be either income or expenses
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItems: function(obj, type) {
            var html, newHtml, element;

            // Create HTLM string with placeholder text
            if( type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID) {

            var el= document.getElementById(selectorID);
            el.parentNode.removeChild(el)

        },        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            console.log(fields);
            
            
            fieldsArr = Array.prototype.slice.call(fields);
            console.log(fieldsArr);
            
            
            
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            
            fieldsArr[0].focus();
        },

        displaybudget: function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            if(obj.percentage <= 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }

        },

        displayPercentages: function(percentages) {;
            var fields = document.querySelector(DOMstrings.expensesPercLabel);


            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index){


               if (percentages[index] > 0) {

                   current.textContent = percentages[index] + '%';
               }else {
                   current.textContent = '---'
               }
            });

        },

        getDOMstrings:function() {
            return DOMstrings;
    
        }
        

            
    };

}) ();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupevenListeners = function() {
        var  DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress' , function(event){
        
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
                
            }

        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };


    var updateBudget = function () {
        //1. Calculate the budget
        budgetCtrl.Calculatebudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. display the budget on the UI
        UICtrl.displaybudget(budget)
        
    }

    var updatePercentages = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percent  ges from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentage
       UICtrl.displayPercentages(percentages)
    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the field data
        var input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value ) {

         // 2. Add the item to the budget controller
         var newItem = budgetCtrl.addItems(input.type, input.description, input.value);
 
         // 3. Add the item to the UI
         UICtrl.addListItems(newItem, input.type) 
 
         // 4. Clear the fields
         UICtrl.clearFields();
 
         // 5. Calculate and update budget
         updateBudget();
 
         // 6. Calculte and update percentages
         updatePercentages();

        }

    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0]
            ID = parseInt(splitID[1])
        }

        // 1. delete the item from the data structure
        budgetCtrl.deleteItem(type, ID)

        // 2. Delete the item from the UI
        UICtrl.deleteListItem(itemID)

        // 3. Update and show the new budget
        updateBudget();

    }

    return {
        init : function() {
            console.log('Application has started');
            UICtrl.displaybudget({
             
                    budget : 0,
                    totalInc : 0,
                    totalExp : 0,
                    percentage: -1
            });
            
            setupevenListeners();
            
        }
    };
 


})(budgetController, UIController);

controller.init();
