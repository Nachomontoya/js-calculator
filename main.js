const formula = document.querySelector('#print_formula');
const result = document.querySelector('#print_result');

const numbers = document.querySelectorAll('.key_number');
const operators = document.querySelectorAll('.key_operator');
const specials = document.querySelectorAll('.key_special');

const closeBtn = document.querySelector('#close_btn');

const clearBtn = document.getElementById('equ_op');
const decBtn = document.getElementById('dec_op');
const posNegBtn = document.getElementById('inv_op');
const percBtn = document.getElementById('per_op');

let operationsLog = "";

closeBtn.addEventListener('click', function() {
    window.close();
});

document.querySelector('#ld_checkbox').addEventListener('click', changeMode);

function changeMode() {
    document.getElementById('calc_container').classList.toggle('dark');
    document.getElementById('print_result').classList.toggle('btn_dark');
    document.querySelectorAll('.key_number').forEach(element => {
        element.classList.toggle('btn_dark');
    });
    document.getElementById('dec_op').classList.toggle('btn_dark');
};

function setKeysOff () {
    clearBtn.disabled = true;
    decBtn.disabled = true;
    posNegBtn.disabled = true;
    percBtn.disabled = true;
    operators.forEach(element => {
        element.disabled = true;
    })
    numbers.forEach (element => {
        element.disabled = true;
    });
}

function setKeysOn () {
    clearBtn.disabled = false;
    decBtn.disabled = false;
    posNegBtn.disabled = false;
    percBtn.disabled = false;
    result.style.fontSize = '3.2em';
    operators.forEach(element => {
        element.disabled = false;
    })
    numbers.forEach(element => {
        element.disabled = false;
    });
}

function maxLengthResult() {
    if  (result.innerHTML.length > 9 && result.innerHTML.length < 13) {
        result.style.fontSize = '2.5em';
    } else if  (result.innerHTML.length >= 13 && result.innerHTML.length <= 15) {
        result.style.fontSize = '2em';
    } else if (result.innerHTML.length > 15 && result.innerHTML.length <= 18) {
        result.style.fontSize = '1.6em';
    } else if (result.innerHTML.length > 18) {
        result.innerHTML = '0';
        result.style.fontSize = '3.2em';
        formula.innerHTML = 'max length reached';
        result.innerHTML = 'err';
        setKeysOff();
    }
}

function getPercentageOfOperand (number, percentage) {
    return number / 100 * percentage;
}

function getInversePercentageOfOperand (number, percentage) {
    return number * 100 / percentage;
}

function calculateSecOp (firstOp, secOp) {
    return (secOp.includes('%'))
        ? getPercentageOfOperand(firstOp, Number(secOp.replaceAll('%','')))
        : Number(secOp);
};

function doAddition(firstOp, secOp) {
    secOp = calculateSecOp(firstOp, secOp);
    return firstOp + secOp;
};

function doSubtraction(firstOp, secOp) {
    secOp = calculateSecOp(firstOp, secOp);
    return firstOp - secOp;
};

function doMultiplying(firstOp, secOp) {
    return (secOp.includes('%'))
        ? getPercentageOfOperand(firstOp, Number(secOp.replaceAll('%','')))
        : firstOp * Number(secOp);
};

function doQuotient(firstOp, secOp) {
    return (secOp.includes('%'))
        ? getInversePercentageOfOperand(firstOp, Number(secOp.replaceAll('%','')))
        : firstOp / Number(secOp);
};

let doOperation = {
    add : 'doAddition',
    sub : 'doSubtraction',
    mult : 'doMultiplying',
    quo : 'doQuotient',
    perc : 'doPercentage'
};

function decimalFunction() {
    if (!result.innerHTML.includes('.')) {
        result.innerHTML += '.';
    }
};

function addNumberOnResult(event) {
    result.innerHTML = (result.innerHTML === '0')
        ? event.target.getAttribute('data-value')
        : result.innerHTML + event.target.getAttribute('data-value');
    maxLengthResult();
};

function printFormula(operator) {
    formula.innerHTML = (formula.innerHTML.includes('Ans') || formula.innerHTML.includes('Infinity'))
    ? result.innerHTML
    : formula.innerHTML += result.innerHTML;
    formula.innerHTML += operator;
};

function addOperator(event) {
    let operator = event.target.innerText;
    printFormula(operator);
    result.innerHTML = '0';
    result.style.fontSize = '3.2em';
};

function clearFunction(event) {
    formula.innerHTML = '';
    result.innerHTML = '0';
    setKeysOn();
};

function inversorFunction(event) {
    if (result.innerHTML !== '0') {
        if (result.innerHTML.startsWith('-')) {
            result.innerHTML = result.innerHTML.substring(1);
        } else {
            result.innerHTML = `-${result.innerHTML}`;
        }
    }
};

function getOperationsList(operators) {
    operators = operators.replaceAll('+', 'add');
    operators = operators.replaceAll('-', 'sub');
    operators = operators.replaceAll('x', 'mult');
    operators = operators.replaceAll('%', '');
    return operators.replaceAll('/', 'quo');
};

function getFirstValidOperand (operands) {
    let firstValidOperand;
    do {
        firstValidOperand = operands.shift();
    } while (firstValidOperand.includes('%'));
    return Number(firstValidOperand);
};

function operationResult() {
    let operands = formula.innerHTML.split(/[+\-\x\/]/);
    let operations = getOperationsList(formula.innerHTML);
    let operators = operations.split(/[0-9]/);
    operators = operators.filter(operator => operator !== '' && operator !== '.');
    let firstOp = getFirstValidOperand(operands);
    let secOp = '';
    let formOp = '';
    while (operands.length > 0 && operators.length > 0) {
        formOp = operators.shift();
        secOp = operands.shift();
        firstOp = window[doOperation[formOp]](firstOp, secOp);
    }
    return firstOp
};

function loginOperation(formula, result) {
    if (this.operationsLog === undefined) {
        this.operationsLog = `${formula} = ${result}\n`;
    } else {
        this.operationsLog += `${formula} = ${result}\n`;
    }
};

function equalFunction(event) {
    if (formula.innerHTML.includes('Ans')) {
        clearFunction();
    } else {
        formula.innerHTML += result.innerHTML;
    let formToLog = formula.innerHTML;
    let finalResult = operationResult();
    if (finalResult === Infinity) {
        clearFunction();
        formula.innerHTML = 'Infinity';
    } else {
        result.innerHTML = finalResult;
        formula.innerHTML = 'Ans';
    };
    maxLengthResult();
    loginOperation(formToLog, finalResult);
    }
};

function percentageFunction(event) {
    result.innerHTML = `${result.innerHTML}%`;
    equalFunction();
};

let specialFunctions = {
    clear_op : clearFunction,
    inv_op : inversorFunction,
    per_op : percentageFunction,
    dec_op : decimalFunction,
    equ_op : equalFunction
};

numbers.forEach(nmr => {
    nmr.addEventListener('click', addNumberOnResult);
});

operators.forEach(op => {
    op.addEventListener('click', addOperator);
});

specials.forEach(special => {
    special.addEventListener(
        'click',
        specialFunctions[special.id] 
    )
});

function showOperationsLog() {
    return (this.operationsLog !== undefined)
        ? this.operationsLog
        : '';
}
