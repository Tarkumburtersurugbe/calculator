const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");
const historyList = document.getElementById("historyList");

function setDisplayValue(value) {
    display.value = value;
    fitDisplayText();
}

function fitDisplayText() {
    const baseFontSize = window.matchMedia("(max-width: 500px)").matches ? 24 : 28;
    const availableWidth = display.clientWidth;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    let fontSize = baseFontSize;

    context.font = ` ${fontSize}px Arial`;
    while (context.measureText(display.value).width > availableWidth && fontSize > 12) {
        fontSize -= 1;
        context.font = ` ${fontSize}px Arial`;
    }

    display.style.fontSize = `${fontSize}px`;
    display.scrollLeft = display.scrollWidth;
}

function appendValue(value) {
    if (display.value === "Error") {
        setDisplayValue("");
    }
    setDisplayValue(display.value + value);
}

function clearDisplay() {
    setDisplayValue("");
    historyDisplay.textContent = "";
}

function deleteLast() {
    if (display.value === "Error") {
        setDisplayValue("");
        return;
    }
    setDisplayValue(display.value.slice(0, -1));
}

function safeEvaluate(expression) {
    const sanitizedExpression = expression
        .replace(/π/g, "Math.PI")
        .replace(/\be\b/g, "Math.E")
        .replace(/(\d*\.?\d+)%/g, "($1/100)");

    return Function(`"use strict"; return (${sanitizedExpression});`)();
}

function showError() {
    setDisplayValue("Error");
    setTimeout(() => {
        if (display.value === "Error") {
            setDisplayValue("");
            historyDisplay.textContent = "";
        }
    }, 1500);
}

function calculate() {
    const expression = display.value.trim();

    if (!expression) {
        return;
    }

    try {
        const answer = safeEvaluate(expression);

        if (!Number.isFinite(answer)) {
            throw new Error("Invalid calculation");
        }

        historyDisplay.textContent = `${expression} =`;
        setDisplayValue(answer);
        addHistory(expression, answer);
    } catch (error) {
        showError();
    }
}

function evaluateCurrentNumber() {
    const value = safeEvaluate(display.value);
    if (!Number.isFinite(value)) {
        throw new Error("Invalid value");
    }
    return value;
}

function square() {
    try {
        const value = evaluateCurrentNumber();
        const answer = value ** 2;
        historyDisplay.textContent = `${value}²`;
        setDisplayValue(answer);
        addHistory(`${value}²`, answer);
    } catch (error) {
        showError();
    }
}

function cube() {
    try {
        const value = evaluateCurrentNumber();
        const answer = value ** 3;
        historyDisplay.textContent = `${value}³`;
        setDisplayValue(answer);
        addHistory(`${value}³`, answer);
    } catch (error) {
        showError();
    }
}

function power() {
    const exponentInput = prompt("Enter the power:");

    if (exponentInput === null || exponentInput === "") {
        return;
    }

    const exponent = Number(exponentInput);

    if (!Number.isFinite(exponent)) {
        alert("Please enter a valid number.");
        return;
    }

    try {
        const base = evaluateCurrentNumber();
        const answer = base ** exponent;
        historyDisplay.textContent = `${base} ^ ${exponent}`;
        setDisplayValue(answer);
        addHistory(`${base} ^ ${exponent}`, answer);
    } catch (error) {
        showError();
    }
}

function factorial() {
    try {
        const number = Number(safeEvaluate(display.value));

        if (!Number.isInteger(number) || number < 0 || number > 170) {
            alert("Factorial requires a whole number from 0 to 170.");
            return;
        }

        let result = 1;
        for (let i = 2; i <= number; i++) {
            result *= i;
        }

        historyDisplay.textContent = `${number}!`;
        setDisplayValue(result);
        addHistory(`${number}!`, result);
    } catch (error) {
        showError();
    }
}

function addHistory(expression, answer) {
    const item = document.createElement("li");
    item.textContent = `${expression} = ${Number.isInteger(answer) ? answer : Number(answer.toFixed(10))}`;
    historyList.prepend(item);
}

function clearHistory() {
    historyList.innerHTML = "";
}

document.addEventListener("keydown", (event) => {
    const { key } = event;

    if (/[0-9+\-*/().]/.test(key)) {
        appendValue(key);
        return;
    }

    if (key === "Enter") {
        calculate();
        return;
    }

    if (key === "Backspace") {
        deleteLast();
        return;
    }

    if (key === "Escape") {
        clearDisplay();
    }
});

window.addEventListener("resize", fitDisplayText);