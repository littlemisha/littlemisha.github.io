// 计算器功能实现
let currentInput = '0';
let history = '';
let shouldResetScreen = false;
let lastOperation = '';
let bracketOpen = false;

// DOM元素
const currentElement = document.getElementById('current');
const historyElement = document.getElementById('history');

// 更新显示
function updateDisplay() {
    currentElement.textContent = currentInput;
    historyElement.textContent = history;
}

// 添加数字
function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

// 添加小数点
function appendDot() {
    if (shouldResetScreen) {
        currentInput = '0.';
        shouldResetScreen = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// 添加括号
function appendBracket() {
    if (bracketOpen) {
        currentInput += ')';
        bracketOpen = false;
    } else {
        if (currentInput === '0' || shouldResetScreen) {
            currentInput = '(';
        } else {
            currentInput += '(';
        }
        bracketOpen = true;
    }
    shouldResetScreen = false;
    updateDisplay();
}

// 添加运算符
function appendOperator(operator) {
    if (operator === '%') {
        // 百分比运算特殊处理
        try {
            currentInput = String(eval(currentInput) / 100);
        } catch (e) {
            currentInput = 'Error';
        }
        updateDisplay();
    } else {
        // 修复：保存当前输入到历史记录，并在显示中添加运算符
        history = currentInput + ' ' + operator;
        lastOperation = operator;
        shouldResetScreen = true;
        updateDisplay();
    }
}

// 计算结果
function calculate() {
    let calculation;
    try {
        // 处理未闭合的括号
        if (bracketOpen) {
            currentInput += ')';
            bracketOpen = false;
        }
        
        // 修复：如果有历史记录和运算符，则将当前输入与历史记录组合进行计算
        let expression = currentInput;
        if (history && lastOperation) {
            // 替换乘法符号 × 为 JavaScript 可识别的 *
            expression = history.replace('×', '*') + currentInput;
        }
        
        // 执行计算，替换乘法符号
        expression = expression.replace(/×/g, '*');
        calculation = eval(expression);
        
        // 更新历史记录
        history = expression.replace(/\*/g, '×') + ' =';
        currentInput = String(calculation);
        shouldResetScreen = true;
    } catch (e) {
        currentInput = 'Error';
    }
    updateDisplay();
}

// 清除所有
function clearAll() {
    currentInput = '0';
    history = '';
    shouldResetScreen = false;
    lastOperation = '';
    bracketOpen = false;
    updateDisplay();
}

// 退格
function backspace() {
    if (currentInput.length === 1 || currentInput === 'Error') {
        currentInput = '0';
    } else {
        // 检查是否删除了开括号或闭括号
        if (currentInput.slice(-1) === '(') {
            bracketOpen = false;
        } else if (currentInput.slice(-1) === ')') {
            bracketOpen = true;
        }
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// 键盘支持
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendDot();
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendOperator(event.key);
    } else if (event.key === '%') {
        appendOperator('%');
    } else if (event.key === '(' || event.key === ')') {
        appendBracket();
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Backspace') {
        backspace();
    } else if (event.key === 'Escape' || event.key === 'Delete') {
        clearAll();
    }
});

// 初始化显示
updateDisplay();
