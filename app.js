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

    this.buttonOrder = [
      {
        class: 'sign',
        text: '%',
      },
      {
        class: 'enterClear',
        text: 'CE',
      },
      {
        class: 'allClear',
        text: 'C',
      },
      {
        class: 'backspace',
        text: '&xlArr;',
      },
      {
        class: 'fraction',
        text: '1/X',
      },
      {
        class: 'degree',
        text: 'X<sup>2</sup>',
      },
      {
        class: 'sqrt',
        text: '&radic;X',
      },
      {
        class: 'sign',
        text: '&divide;',
        dataSign: '/',
      },
      {
        class: 'num',
        text: '7',
      },
      {
        class: 'num',
        text: '8',
      },
      {
        class: 'num',
        text: '9',
      },
      {
        class: 'sign',
        text: '&times;',
        dataSign: '*',
      },
      {
        class: 'num',
        text: '4',
      },
      {
        class: 'num',
        text: '5',
      },
      {
        class: 'num',
        text: '6',
      },
      {
        class: 'sign',
        text: '&ndash;',
        dataSign: '-',
      },
      {
        class: 'num',
        text: '1',
      },
      {
        class: 'num',
        text: '2',
      },
      {
        class: 'num',
        text: '3',
      },
      {
        class: 'sign',
        text: '+',
        dataSign: '+',
      },
      {
        class: 'swapSign',
        text: '+/-',
      },
      {
        class: 'num',
        text: '0',
      },
      {
        class: 'decimalPoint',
        text: '.',
      },
      {
        class: 'equal',
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

    this.classes = {
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
      CLEAR_ENTER: 'btnThatClearEnter',
      CLEAR_ALL: 'btnThatAllClear',
    };

    this.state = {
      sum: '',
      lastSign: '',
    };
  }

  createCalculator() {
    this.calc = document.createElement('div');
    this.calc.classList.add(this.classes.CALCULATOR);
    this.container.appendChild(this.calc);
  }

  createScreen() {
    this.screen = document.createElement('div');
    this.screen.classList.add(this.classes.SCREEN);
    this.calc.appendChild(this.screen);

    this.result = document.createElement('div');
    this.result.classList.add(this.classes.RESULT);
    this.screen.appendChild(this.result);

    this.enter = document.createElement('div');
    this.enter.classList.add(this.classes.ENTER);
    this.screen.appendChild(this.enter);
  }

  createButtons() {
    this.buttons = document.createElement('div');
    this.buttons.classList.add(this.classes.BUTTONS);
    this.calc.appendChild(this.buttons);

    for (let i = 0; i < 24; i++) {
      this.button = document.createElement('button');
      this.button.classList.add(this.classes.BUTTON, this.buttonOrder[i].class);
      this.button.innerHTML = this.buttonOrder[i].text;
      if (this.buttonOrder[i].hasOwnProperty('dataSign')) {
        this.button.setAttribute('data-sign', this.buttonOrder[i].dataSign);
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
    if (!event.target.classList.contains('num')) return;
    this.enter.innerText += `${event.target.innerText}`;
    this.state.sum += `${event.target.innerText}`;
  }

  addEventSign(event) {
    if (!event.target.classList.contains('sign')) return;
    if (this.state.sum !== '') {
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
        )}&nbsp;${event.target.innerHTML}`;
        this.state.sum =
          eval(this.state.sum.slice(0, this.state.sum.length - 1)) +
          event.target.dataset.sign;
        this.state.lastSign = `${event.target.dataset.sign}`;
      }
    } else if (this.state.sum === '' && event.target.dataset.sign === '-') {
      this.state.sum += '0-';
      this.result.innerHTML = `0&nbsp;${event.target.innerText}`;
      this.state.lastSign = `${event.target.dataset.sign}`;
    }
  }

  addEventBtnCE(event) {
    if (!event.target.classList.contains('enterClear')) return;
    if (this.state.sum !== '') {
      const searchEqual = this.result.innerText.indexOf('=');
      if (this.result.innerText === '') {
        this.enter.innerText = '';
        this.state.sum = '';
      } else if (searchEqual !== -1) {
        this.enter.innerText = '';
        this.state.sum = '';
        this.result.innerText = '';
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
    if (!event.target.classList.contains('allClear')) return;
    this.enter.innerText = '';
    this.state.sum = '';
    this.result.innerText = '';
  }

  addEventDecimalPoint(event) {
    if (!event.target.classList.contains('decimalPoint')) return;
    const enterText = this.enter.innerText;
    if (enterText !== '') {
      const searchEqual = this.result.innerText.indexOf('=');
      const splitEnterText = enterText.split('.');

      if (searchEqual !== -1) this.result.innerText = '';

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
    if (!event.target.classList.contains('swapSign')) return;
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
    if (!event.target.classList.contains('fraction')) return;
    if (this.state.sum != '') {
      let newSum = eval(`1/(${this.state.sum})`);
      let fractionalPart = `${newSum}`.split('.').pop();
      if (fractionalPart.length > 7)
        newSum = `${parseFloat(newSum).toFixed(7)}`;
      this.enter.innerText = newSum;
      this.state.sum = newSum;
      this.result.innerText = '';
    }
  }

  addEventSqrt(event) {
    if (!event.target.classList.contains('sqrt')) return;
    if (this.state.sum != '') {
      let newSum = Math.sqrt(eval(this.state.sum));
      let fractionalPart = `${newSum}`.split('.').pop();
      if (fractionalPart.length > 7)
        newSum = `${parseFloat(newSum).toFixed(7)}`;
      this.enter.innerText = `${newSum}`;
      this.state.sum = `${newSum}`;
      this.result.innerText = '';
    }
  }

  addEventDegree(event) {
    if (!event.target.classList.contains('degree')) return;
    if (this.state.sum != '') {
      let newSum = Math.pow(eval(this.state.sum), 2);
      let fractionalPart = `${newSum}`.split('.').pop();
      if (fractionalPart.length > 7)
        newSum = `${parseFloat(newSum).toFixed(7)}`;
      this.enter.innerText = `${newSum}`;
      this.state.sum = `${newSum}`;
      this.result.innerText = '';
    }
  }

  addEventBackspace(event) {
    if (!event.target.classList.contains('backspace')) return;
    if (this.enter.innerText != '') {
      const searchEqual = this.result.innerText.indexOf('=');
      if (searchEqual === -1) {
        const enterText = this.enter.innerText;
        this.state.sum = this.state.sum.slice(0, this.state.sum.length - 1);
        this.enter.innerText = enterText.slice(0, enterText.length - 1);
      } else {
        this.result.innerText = '';
      }
    }
  }

  addEventEqual(event) {
    if (!event.target.classList.contains('equal')) return;
    if (this.state.sum != '') {
      const searchEqual = this.result.innerText.indexOf('=');
      if (searchEqual === -1) {
        this.state.sum = `${eval(this.state.sum)}`;
        let fractionalPart = this.state.sum.split('.').pop();
        if (fractionalPart.length > 7)
          this.state.sum = `${parseFloat(this.state.sum).toFixed(7)}`;
        this.result.innerHTML += `&nbsp;${this.enter.innerText}&nbsp;=`;
        this.enter.innerText = this.state.sum;
      }
    }
  }
}
