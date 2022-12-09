const windowWithCalculators = document.querySelector('.windowWithCalculators');
const btnAddCalc = document.querySelector('.btnAddCalc');

btnAddCalc.addEventListener('click', () => {
	const calc = new Calculator(windowWithCalculators);

	calc.render();
});

class Calculator {
	constructor(windowWithCalculators) {
		this.windowWithCalculators = windowWithCalculators;

		this.calc = null;
		this.enter = null;
		this.result = null;
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

		this.sum = '';
		this.lastSign = '';
	}

	render() {
		this.calc = document.createElement('div');
		this.calc.classList.add('calc');
		this.windowWithCalculators.appendChild(this.calc);

		this.calc.innerHTML += `
				<div class="screen">
					<div class="result"></div>
					<div class="enter"></div>
				</div>
				<div class="buttons">
					<button class="btn sign">%</button>
					<button class="btn enterClear">CE</button>
					<button class="btn allClear">C</button>
					<button class="btn backspace">&xlArr;</button>
					<button class="btn fraction">1/X</button>
					<button class="btn degree">X<sup>2</sup></button>
					<button class="btn sqrt">&radic;X</button>
					<button class="btn sign" data-sign="/">&divide;</button>
					<button class="btn num">7</button>
					<button class="btn num">8</button>
					<button class="btn num">9</button>
					<button class="btn sign" data-sign="*">&times;</button>
					<button class="btn num">4</button>
					<button class="btn num">5</button>
					<button class="btn num">6</button>
					<button class="btn sign" data-sign="-">&ndash;</button>
					<button class="btn num">1</button>
					<button class="btn num">2</button>
					<button class="btn num">3</button>
					<button class="btn sign" data-sign="+">+</button>
					<button class="btn swapSign">+/-</button>
					<button class="btn num">0</button>
					<button class="btn decimalPoint">.</button>
					<button class="btn equal">=</button>
				</div>
	`;
		this.addEvents();
	}

	addEvents() {
		this.enter = this.calc.querySelector('.enter');
		this.result = this.calc.querySelector('.result');
		this.nums = this.calc.querySelectorAll('.num');
		this.signs = this.calc.querySelectorAll('.sign');
		this.btnThatClearEnter = this.calc.querySelector('.enterClear');
		this.btnThatAllClear = this.calc.querySelector('.allClear');
		this.equal = this.calc.querySelector('.equal');
		this.fraction = this.calc.querySelector('.fraction');
		this.sqrt = this.calc.querySelector('.sqrt');
		this.degree = this.calc.querySelector('.degree');
		this.decimalPoint = this.calc.querySelector('.decimalPoint');
		this.backspace = this.calc.querySelector('.backspace');
		this.swapSign = this.calc.querySelector('.swapSign');
		this.sum = '';
		this.lastSign = '';

		for (const num of this.nums) {
			num.addEventListener('click', (event) => {
				this.enter.innerText += `${event.target.innerText}`;
				this.sum += `${event.target.innerText}`;
			});
		}

		for (const sign of this.signs) {
			sign.addEventListener('click', (event) => {
				if (this.sum !== '') {
					const resultText = this.result.innerHTML;
					const lastEl = this.sum[this.sum.length - 1];
					if (lastEl !== this.lastSign) {
						this.result.innerHTML = `${eval(this.sum)}&nbsp;${
							event.target.innerText
						}`;
						this.sum = eval(this.sum) + event.target.dataset.sign;
						this.lastSign = `${event.target.dataset.sign}`;
						this.enter.innerText = '';
					} else {
						this.result.innerHTML = `${resultText.slice(
							0,
							this.sum.length - 1
						)}&nbsp;${event.target.innerHTML}`;
						this.sum =
							eval(this.sum.slice(0, this.sum.length - 1)) +
							event.target.dataset.sign;
						this.lastSign = `${event.target.dataset.sign}`;
					}
				} else if (this.sum === '' && event.target.dataset.sign === '-') {
					this.sum += '0-';
					this.result.innerHTML = `0&nbsp;${event.target.innerText}`;
					this.lastSign = `${event.target.dataset.sign}`;
				}
			});
		}

		this.btnThatClearEnter.addEventListener('click', (event) => {
			if (this.sum !== '') {
				const searchEqual = this.result.innerText.indexOf('=');
				if (this.result.innerText === '') {
					this.enter.innerText = '';
					this.sum = '';
				} else if (searchEqual !== -1) {
					this.enter.innerText = '';
					this.sum = '';
					this.result.innerText = '';
				} else {
					this.enter.innerText = '';
					let lastEl = this.sum[this.sum.length - 1];
					while (lastEl !== this.lastSign) {
						this.sum = this.sum.slice(0, this.sum.length - 1);
						lastEl = this.sum[this.sum.length - 1];
					}
				}
			}
		});

		this.btnThatAllClear.addEventListener('click', (event) => {
			this.enter.innerText = '';
			this.sum = '';
			this.result.innerText = '';
		});

		this.decimalPoint.addEventListener('click', () => {
			const enterText = this.enter.innerText;
			if (enterText !== '') {
				const searchEqual = this.result.innerText.indexOf('=');
				const splitEnterText = enterText.split('.');

				if (searchEqual !== -1) this.result.innerText = '';

				if (splitEnterText.length === 1) {
					this.enter.innerText += '.';
					this.sum += '.';
				}
			} else {
				this.enter.innerText += '0.';
				this.sum += '0.';
			}
		});

		this.swapSign.addEventListener('click', () => {
			if (this.sum != '') {
				const enterText = this.enter.innerText;
				if (+enterText > 0) {
					this.enter.innerHTML = `-${enterText}`;
					let searchLastSign = this.sum.indexOf(this.lastSign);
					this.sum =
						this.sum.slice(0, searchLastSign + 1) + `(${this.enter.innerText})`;
				} else if (+enterText < 0) {
					this.enter.innerHTML = enterText.slice(1);
					let searchLastSign = this.sum.indexOf(this.lastSign);
					this.sum =
						this.sum.slice(0, searchLastSign + 1) + this.enter.innerText;
				}
			}
		});

		this.fraction.addEventListener('click', (event) => {
			if (this.sum != '') {
				let newSum = eval(`1/(${this.sum})`);
				let fractionalPart = `${newSum}`.split('.').pop();
				if (fractionalPart.length > 7)
					newSum = `${parseFloat(newSum).toFixed(7)}`;
				this.enter.innerText = newSum;
				this.sum = newSum;
				this.result.innerText = '';
			}
		});

		this.sqrt.addEventListener('click', (event) => {
			if (this.sum != '') {
				let newSum = Math.sqrt(eval(this.sum));
				let fractionalPart = `${newSum}`.split('.').pop();
				if (fractionalPart.length > 7)
					newSum = `${parseFloat(newSum).toFixed(7)}`;
				this.enter.innerText = `${newSum}`;
				this.sum = `${newSum}`;
				this.result.innerText = '';
			}
		});

		this.degree.addEventListener('click', (event) => {
			if (this.sum != '') {
				let newSum = Math.pow(eval(this.sum), 2);
				let fractionalPart = `${newSum}`.split('.').pop();
				if (fractionalPart.length > 7)
					newSum = `${parseFloat(newSum).toFixed(7)}`;
				this.enter.innerText = `${newSum}`;
				this.sum = `${newSum}`;
				this.result.innerText = '';
			}
		});

		this.equal.addEventListener('click', (event) => {
			if (this.sum != '') {
				const searchEqual = this.result.innerText.indexOf('=');
				if (searchEqual === -1) {
					this.sum = `${eval(this.sum)}`;
					let fractionalPart = this.sum.split('.').pop();
					if (fractionalPart.length > 7)
						this.sum = `${parseFloat(this.sum).toFixed(7)}`;
					this.result.innerHTML += `&nbsp;${this.enter.innerText}&nbsp;=`;
					this.enter.innerText = this.sum;
				}
			}
		});

		this.backspace.addEventListener('click', (event) => {
			if (this.enter.innerText != '') {
				const searchEqual = this.result.innerText.indexOf('=');
				if (searchEqual === -1) {
					const enterText = this.enter.innerText;
					this.sum = this.sum.slice(0, this.sum.length - 1);
					this.enter.innerText = enterText.slice(0, enterText.length - 1);
				} else {
					this.result.innerText = '';
				}
			}
		});
	}
}
