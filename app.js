const container = document.querySelector('.container');
const btnAddCalc = document.querySelector('.btnAddCalc');

btnAddCalc.addEventListener('click', () => {
  const calc = new Calculator(container);

  calc.render();
});

class Calculator {
  constructor(container) {
    this.container = container;

    this.calc = null;
    this.screen = null;
    this.result = null;
    this.enter = null;
    this.buttons = null;
    this.button = null;
    this.NUMBER_OF_BUTTONS = 24;
    this.MAX_FRACTIONAL_PART = 7;
    this.ATTRIBUTE_DATA_SIGN = 'data-sign';

    this.CLASSES = {
      CALCULATOR: 'calc',
      SCREEN: 'screen',
      RESULT: 'result',
      ENTER: 'enter',
      BUTTONS: 'buttons',
      BUTTON: 'btn',
      NUMBER: 'num',
      SIGN: 'sign',
      EQUAL: 'equal',
      FRACTION: 'fraction',
      SQRT: 'sqrt',
      DEGREE: 'degree',
      DECIMAL_POINT: 'decimalPoint',
      BACKSPACE: 'backspace',
      SWAP_SIGN: 'swapSign',
      CLEAR_ENTER: 'enterClear',
      CLEAR_ALL: 'allClear',
    };

    this.OPERATORS = {
      PLUS: '+',
      MINUS: '-',
      MULTIPLICATION: '*',
      DIVISION: '/',
    };

    this.BUTTON_ORDER = [
      {
        class: this.CLASSES.SIGN,
        text: '%',
      },
      {
        class: this.CLASSES.CLEAR_ENTER,
        text: 'CE',
      },
      {
        class: this.CLASSES.CLEAR_ALL,
        text: 'C',
      },
      {
        class: this.CLASSES.BACKSPACE,
        text: '&xlArr;',
      },
      {
        class: this.CLASSES.FRACTION,
        text: '1/X',
      },
      {
        class: this.CLASSES.DEGREE,
        text: 'X<sup>2</sup>',
      },
      {
        class: this.CLASSES.SQRT,
        text: '&radic;X',
      },
      {
        class: this.CLASSES.SIGN,
        text: '&divide;',
        dataSign: this.OPERATORS.DIVISION,
      },
      {
        class: this.CLASSES.NUMBER,
        text: '7',
      },
      {
        class: this.CLASSES.NUMBER,
        text: '8',
      },
      {
        class: this.CLASSES.NUMBER,
        text: '9',
      },
      {
        class: this.CLASSES.SIGN,
        text: '&times;',
        dataSign: this.OPERATORS.MULTIPLICATION,
      },
      {
        class: this.CLASSES.NUMBER,
        text: '4',
      },
      {
        class: this.CLASSES.NUMBER,
        text: '5',
      },
      {
        class: this.CLASSES.NUMBER,
        text: '6',
      },
      {
        class: this.CLASSES.SIGN,
        text: '&ndash;',
        dataSign: this.OPERATORS.MINUS,
      },
      {
        class: this.CLASSES.NUMBER,
        text: '1',
      },
      {
        class: this.CLASSES.NUMBER,
        text: '2',
      },
      {
        class: this.CLASSES.NUMBER,
        text: '3',
      },
      {
        class: this.CLASSES.SIGN,
        text: this.OPERATORS.PLUS,
        dataSign: this.OPERATORS.PLUS,
      },
      {
        class: this.CLASSES.SWAP_SIGN,
        text: '+/-',
      },
      {
        class: this.CLASSES.NUMBER,
        text: '0',
      },
      {
        class: this.CLASSES.DECIMAL_POINT,
        text: '.',
      },
      {
        class: this.CLASSES.EQUAL,
        text: '=',
      },
    ];

    this.nums = null;
    this.signs = null;
    this.btnThatClearEnter = null;
    this.btnThatAllClear = null;
    this.equal = null;
    this.fraction = null;
    this.sqrt = null;
    this.degree = null;
    this.decimalPoint = null;
    this.backspace = null;
    this.swapSign = null;

    this.state = {
      sum: '',
      lastSign: '',
    };
  }

  createCalculator() {
    this.calc = document.createElement('div');
    this.calc.classList.add(this.CLASSES.CALCULATOR);
    this.container.appendChild(this.calc);
  }

  createScreen() {
    this.screen = document.createElement('div');
    this.screen.classList.add(this.CLASSES.SCREEN);
    this.calc.appendChild(this.screen);

    this.result = document.createElement('div');
    this.result.classList.add(this.CLASSES.RESULT);
    this.screen.appendChild(this.result);

    this.enter = document.createElement('div');
    this.enter.classList.add(this.CLASSES.ENTER);
    this.screen.appendChild(this.enter);
  }

  createButtons() {
    this.buttons = document.createElement('div');
    this.buttons.classList.add(this.CLASSES.BUTTONS);
    this.calc.appendChild(this.buttons);

    for (let i = 0; i < this.NUMBER_OF_BUTTONS; i++) {
      this.button = document.createElement('button');
      this.button.classList.add(
        this.CLASSES.BUTTON,
        this.BUTTON_ORDER[i].class
      );
      this.button.innerHTML = this.BUTTON_ORDER[i].text;

      if (this.BUTTON_ORDER[i].hasOwnProperty('dataSign')) {
        this.button.setAttribute(
          this.ATTRIBUTE_DATA_SIGN,
          this.BUTTON_ORDER[i].dataSign
        );
      }
      this.buttons.appendChild(this.button);
    }
  }

  render() {
    this.createCalculator();
    this.createScreen();
    this.createButtons();

    this.addEvents();
  }

  addEvents() {
    this.buttons.addEventListener('click', (event) => {
      this.addEventNums(event);
      this.addEventSign(event);
      this.addEventBtnCE(event);
      this.addEventBtnClear(event);
      this.addEventDecimalPoint(event);
      this.addEventSwapSign(event);
      this.addEventFraction(event);
      this.addEventSqrt(event);
      this.addEventDegree(event);
      this.addEventBackspace(event);
      this.addEventEqual(event);
    });
  }

  addEventNums(event) {
    if (!event.target.classList.contains(this.CLASSES.NUMBER)) {
      return;
    }
    this.enter.innerText += `${event.target.innerText}`;
    this.state.sum += `${event.target.innerText}`;
  }

  addEventSign(event) {
    if (!event.target.classList.contains(this.CLASSES.SIGN)) {
      return;
    }
    if (!this.isEmptyString(this.state.sum)) {
      const resultText = this.result.innerHTML;
      const lastEl = this.state.sum[this.state.sum.length - 1];
      if (lastEl !== this.state.lastSign) {
        this.result.innerHTML = `${eval(this.state.sum)}&nbsp;${
          event.target.innerText
        }`;
        this.state.sum = eval(this.state.sum) + event.target.dataset.sign;
        this.state.lastSign = `${event.target.dataset.sign}`;
        this.enter.innerText = '';
      } else {
        this.result.innerHTML = `${resultText.slice(
          0,
          this.state.sum.length - 1
        )} ${event.target.innerHTML}`;
        this.state.sum =
          eval(this.state.sum.slice(0, this.state.sum.length - 1)) +
          event.target.dataset.sign;
        this.state.lastSign = `${event.target.dataset.sign}`;
      }
    } else if (
      this.state.sum === '' &&
      event.target.dataset.sign === this.OPERATORS.MINUS
    ) {
      this.state.sum += '0-';
      this.result.innerHTML = `0&nbsp;${event.target.innerText}`;
      this.state.lastSign = `${event.target.dataset.sign}`;
    }
  }

  addEventBtnCE(event) {
    if (!event.target.classList.contains('enterClear')) {
      return;
    }
    if (!this.isEmptyString(this.state.sum)) {
      const searchEqual = this.result.innerText.indexOf('=');
      if (this.result.innerText === '') {
        this.enter.innerText = '';
        this.state.sum = '';
      } else if (searchEqual !== -1) {
        this.enter.innerText = '';
        this.state.sum = '';
        this.resetEnterValue();
      } else {
        this.enter.innerText = '';
        let lastEl = this.state.sum[this.state.sum.length - 1];
        while (lastEl !== this.state.lastSign) {
          this.state.sum = this.state.sum.slice(0, this.state.sum.length - 1);
          lastEl = this.state.sum[this.state.sum.length - 1];
        }
      }
    }
  }

  addEventBtnClear(event) {
    if (!event.target.classList.contains(this.CLASSES.CLEAR_ALL)) {
      return;
    }
    this.enter.innerText = '';
    this.state.sum = '';
    this.resetEnterValue();
  }

  addEventDecimalPoint(event) {
    if (!event.target.classList.contains(this.CLASSES.DECIMAL_POINT)) {
      return;
    }
    if (!this.isEmptyString(this.enter.innerText)) {
      const searchEqual = this.result.innerText.indexOf('=');
      const splitEnterText = this.enter.innerText.split('.');

      if (searchEqual !== -1) this.resetEnterValue();

      if (splitEnterText.length === 1) {
        this.enter.innerText += '.';
        this.state.sum += '.';
      }
    } else {
      this.enter.innerText += '0.';
      this.state.sum += '0.';
    }
  }

  addEventSwapSign(event) {
    if (!event.target.classList.contains(this.CLASSES.SWAP_SIGN)) {
      return;
    }
    if (this.state.sum != '') {
      const enterText = this.enter.innerText;
      if (+enterText > 0) {
        this.enter.innerHTML = `-${enterText}`;
        let searchLastSign = this.state.sum.indexOf(this.state.lastSign);
        this.state.sum =
          this.state.sum.slice(0, searchLastSign + 1) +
          `(${this.enter.innerText})`;
      } else if (+enterText < 0) {
        this.enter.innerHTML = enterText.slice(1);
        let searchLastSign = this.state.sum.indexOf(this.state.lastSign);
        this.state.sum =
          this.state.sum.slice(0, searchLastSign + 1) + this.enter.innerText;
      }
    }
  }

  addEventFraction(event) {
    if (!event.target.classList.contains(this.CLASSES.FRACTION)) {
      return;
    }
    if (this.state.sum != '') {
      let newSum = eval(`1/(${this.state.sum})`);
      let fractionalPart = `${newSum}`.split('.').pop();
      if (fractionalPart.length > this.MAX_FRACTIONAL_PART)
        newSum = `${parseFloat(newSum).toFixed(this.MAX_FRACTIONAL_PART)}`;
      this.enter.innerText = newSum;
      this.state.sum = newSum;
      this.resetEnterValue();
    }
  }

  addEventSqrt(event) {
    if (!event.target.classList.contains(this.CLASSES.SQRT)) {
      return;
    }
    if (this.state.sum != '') {
      let newSum = Math.sqrt(eval(this.state.sum));
      let fractionalPart = `${newSum}`.split('.').pop();
      if (fractionalPart.length > this.MAX_FRACTIONAL_PART)
        newSum = `${parseFloat(newSum).toFixed(this.MAX_FRACTIONAL_PART)}`;
      this.enter.innerText = `${newSum}`;
      this.state.sum = `${newSum}`;
      this.resetEnterValue();
    }
  }

  addEventDegree(event) {
    if (!event.target.classList.contains(this.CLASSES.DEGREE)) {
      return;
    }
    if (this.state.sum != '') {
      let newSum = Math.pow(eval(this.state.sum), 2);
      let fractionalPart = `${newSum}`.split('.').pop();
      if (fractionalPart.length > this.MAX_FRACTIONAL_PART) {
        newSum = `${parseFloat(newSum).toFixed(this.MAX_FRACTIONAL_PART)}`;
      }
      this.enter.innerText = `${newSum}`;
      this.state.sum = `${newSum}`;
      this.resetEnterValue();
    }
  }

  addEventBackspace(event) {
    if (!event.target.classList.contains(this.CLASSES.BACKSPACE)) {
      return;
    }
    if (this.enter.innerText != '') {
      const searchEqual = this.result.innerText.indexOf('=');
      if (searchEqual === -1) {
        const enterText = this.enter.innerText;
        this.state.sum = this.state.sum.slice(0, this.state.sum.length - 1);
        this.enter.innerText = enterText.slice(0, enterText.length - 1);
      } else {
        this.resetEnterValue();
      }
    }
  }

  addEventEqual(event) {
    if (!event.target.classList.contains(this.CLASSES.EQUAL)) {
      return;
    }
    if (this.state.sum != '') {
      const searchEqual = this.result.innerText.indexOf('=');
      if (searchEqual === -1) {
        this.state.sum = `${eval(this.state.sum)}`;
        let fractionalPart = this.state.sum.split('.').pop();
        if (fractionalPart.length > this.MAX_FRACTIONAL_PART)
          this.state.sum = `${parseFloat(this.state.sum).toFixed(
            this.MAX_FRACTIONAL_PART
          )}`;
        this.result.innerHTML += `&nbsp;${this.enter.innerText}&nbsp;=`;
        this.enter.innerText = this.state.sum;
      }
    }
  }

  resetEnterValue() {
    this.result.innerText = '';
  }

  isEmptyString(string) {
    return string === '';
  }
}
