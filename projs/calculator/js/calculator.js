// calculator
'use strict'

var gNum1 = '';
var gNum2 = null;
var gOp = '';
var gMemoryNum = null;
var gFinished = false;
var gLastResult = null;

function clearNums(key) {
    gNum1 = '';
    gNum2 = null;
    if (!gFinished || key === 'c') renderScreen();
    gFinished = false;
    gLastResult = null;
}

function numPressed(num) {
    if (gFinished) return;
    if (gNum2 === null) {
        gNum1 += num.toString();
        renderScreen(gNum1);
    } else {
        gNum2 += num.toString();
        renderScreen(gNum2);
    }
}

function setOp(op) {
    if (gFinished) return;
    if (op === '=') {
        if (gNum2 === null) return;
        else calculateResult();
        return;
    } else {
        gOp = op;
        if (gNum2 === null) gNum2 = '';
        var screen = document.querySelector('.screen');
        if (!gFinished) screen.innerText += ' ' + gOp;
    }
}

function renderScreen(num) {
    if (!num || num === null) num = 0;
    var str = num.toString();
    var shortStr = '';
    var screen = document.querySelector('.screen');
    str = str.substr(0, 8);
    screen.innerText = str;
}

function calculateResult() {
    var result = 0;
    var num1 = +gNum1;
    var num2 = +gNum2;
    switch (gOp) {
        case '+': {
            result = num1 + num2;
            break;
        }
        case '-': {
            result = num1 - num2;
            break;
        }
        case '/': {
            result = num1 / num2;
            break;
        }
        case '*': {
            result = num1 * num2;
            break;
        }
    }
    gLastResult = result;
    renderScreen(gLastResult);
    gNum1 = '';
    gNum2 = null;
    gOp = '';
    gFinished = true;
}

function memoryOp(op) {
    switch (op) {
        case 'MC': {
            gMemoryNum = '';
            return
        }
        case 'MR': {
            if (gNum2 === null) {
                gNum1 = gMemoryNum;
                renderScreen(gNum1);
            } else {
                gNum2 = gMemoryNum;
                renderScreen(gNum2);
            }
            return
        }
        case 'MS': {
            gMemoryNum = document.querySelector('.screen').innerText;
            return;
        }
        case 'M+': {
            if (gNum2 === null) {
                gNum1 = +gNum1 + +gMemoryNum;
                renderScreen(gNum1);
            }
            else {
                gNum2 = +gNum2 + +gMemoryNum;
                renderScreen(gNum2);
            }
            return
        }
    }
}