const screen = document.getElementsByClassName('cal-screen');
const keyboard = document.getElementsByClassName('keyboard');

function calculateResult(value) {
	let str = value;

	let newStr = '';
	if (str.includes('(')) {
	  for (let i of str) {
	    
	    if (i != '(' && i != ')') {
	      newStr += i;
	    }
	  }
	} else {
		newStr = str;
	}
	let arrNumber = newStr.split(' + ');

	let handleArr = (symbol) => {
	  arrNumber = arrNumber.map((i) => {
	    return i.split(` ${symbol} `);
	  });
	  arrNumber = arrNumber.flat();
	};

	handleArr('-');
	handleArr('x');
	handleArr('÷');

	let objInd = {};
	let count = 0;
	for (let i in str) {
	  if ( str[i - 1] == ' ' && (str[i] == '+' || str[i] == '-' || str[i] == 'x' || str[i] == '÷')) {
	    objInd['symbol' + count] = {symbol: str[i], ind: count};
	    ++count;
	  }
	}

	let arrPlus = [];
	let objPlus = {};
	let countPlus = 0;
	
	let multiplyAndDevide = (arr) => {
		return arr.reduce((a, b, index) => {
		
		if (objInd[`symbol${index - 1}`]['symbol'] == 'x') {
			if (index > 1 && (objInd[`symbol${index - 2}`]['symbol'] == '+' 
				|| objInd[`symbol${index - 2}`]['symbol'] == '-')) {
				arrPlus[arrPlus.length - 1] = Number(a)*Number(b);
			} else if (index > 1 && (objInd[`symbol${index - 2}`]['symbol'] != '+' 
				|| objInd[`symbol${index - 2}`]['symbol'] != '-')) {
				arrPlus[arrPlus.length - 1] = Number(a)*Number(b);
			} else {
				arrPlus.push(Number(a)*Number(b));
			}
			return Number(a) * Number(b);
		} else if (objInd[`symbol${index - 1}`]['symbol'] == '÷') {
			if (index > 1 && (objInd[`symbol${index - 2}`]['symbol'] == '+' 
				|| objInd[`symbol${index - 2}`]['symbol'] == '-')) {
				arrPlus[arrPlus.length - 1] = Number(a)/Number(b);
			} else if (index > 1 && (objInd[`symbol${index - 2}`]['symbol'] != '+' 
				|| objInd[`symbol${index - 2}`]['symbol'] != '-')) {
				arrPlus[arrPlus.length - 1] = Number(a)/Number(b);
			} else {
				arrPlus.push(Number(a)/Number(b));
			}
			return Number(a) / Number(b);
		} else {
			if (index == 1) {
				arrPlus.push(a);
			}
			arrPlus.push(b);
			objPlus[`symbol${countPlus}`] = {
				symbol: objInd[`symbol${index - 1}`]['symbol'],
				index: countPlus
			};
			countPlus++;
			return b;
		}
	});
	}

	let checkMultiplyOrDevide = () => {
		let check;
		for (let i in objInd) {
			if (objInd[i].symbol == 'x' || objInd[i].symbol == '÷') {
				check = true;
			}
		}
		if (check) {
			if (arrPlus.length == 0) {
				multiplyAndDevide(arrNumber);
			}
		} else {
			arrPlus = arrNumber;
			objPlus = objInd;
		}
	}
	checkMultiplyOrDevide();

	return arrPlus.reduce((a, b, index) => {
		if (objPlus[`symbol${index - 1}`]['symbol'] == '+') {
			return Number(a) + Number(b);
		} else if (objPlus[`symbol${index - 1}`]['symbol'] == '-') {
			return Number(a) - Number(b);
		}
	});
}

function animate() {
	let countPx = 20;
	screen[0].children[0].style.top = '20px';
	screen[0].children[1].style.top = '20px';
	let myAnimte = setInterval(() => {
		if (countPx == 0) {
			clearInterval(myAnimte);
		}
		screen[0].children[0].style.top = --countPx + 'px';
		screen[0].children[1].style.top = --countPx + 'px';
	}, 5);
	
}

keyboard[0].addEventListener('click', onClickBtn);
function onClickBtn(e) {
	let clear =  document.getElementsByClassName('clear');
	let value;
	let show = screen[0].children[1];
	let showPrev = screen[0].children[0];
	let showSubstring = show.textContent.substring(show.textContent.length-1);
	let dataOnScreen = show.textContent;


  if (e.target.tagName == 'DIV') {
  	value = e.target.children[0].textContent; 
  } else if (e.target.tagName == 'BUTTON') {
  	value = e.target.textContent;
  }
  if (show.textContent.length != 0 && value != 'AC') {
		clear[0].children[0].textContent = 'CE';
	}
  if (value == 'AC' || value == 'CE') {
  	if (value == 'AC') {
  		show.textContent = '';
  		showPrev.textContent = '';
  	} else if (value == 'CE') {
  		show.textContent = show.textContent.substring(0, show.textContent.length - 1);
  	}
  } else if (value == '=') {
  	let number = show.textContent.substring(show.textContent.length -1);
  	if (number == Number(number) || number == ')') {
  		
	  	clear[0].children[0].textContent = 'AC';
	  	if (show.textContent.length > 25) {
	  		showPrev.textContent = 
	  		'...' + show.textContent.substring(show.textContent.length - 24, show.textContent.length - 1);
	  	} else {
	  		showPrev.textContent = show.textContent;
	  	}
	  	let result = String(calculateResult(show.textContent));
	  	if (result.split('.').length == 1) {
	  		show.textContent = result;
	  	} else {
	  		show.textContent = result.split('.')[1].length > 5 ? String(Number(result).toFixed(5)) : result;
	  	}
	  	
	  	animate();
  	}
  	
  } else if (value == '±') {
  	let result = '';
  	let index;
  	let arr = [...show.textContent];
  	arr.forEach((item, ind) => {
  		if (Number(item) == item || item == '.') {
  			if (result == '') {
  				index = ind;
  			}
  			item != ' ' ? result += item : false;
  		} else {
  			result = '';
  		}
  	})
  	if (result != '' && arr[index - 1] != ')') {
  		if (arr[index - 1] != Number(arr[index - 1])) {
  			arr.splice(index, result.length,' (-',...result,')');
  		} else {
  			arr.splice(index, result.length,'(-',...result,')');
  		}
  		show.textContent = arr.join('');
  	}
  } else {
  	if (show.textContent == '' && 
  		(value != '.' && value != '+' && value != '÷' && value != 'x' && value != '-')) {
  		show.textContent += value;
	  } else if (show.textContent != '' 
	  	&& (value == '.' || value == '+' || value == '÷' || value == 'x' || value == '-')
	  	&& (Number(showSubstring) == showSubstring || showSubstring == ')') 
	  	&& showSubstring != ' ') {
	  	if (value == '.') {
	  		show.textContent += value;
	  	} else {
	  		show.textContent += ` ${value} `;
		  }
	  } else if (show.textContent != '' && Number(value) == value && showSubstring != ')') {
	  	show.textContent += value;
	  }
  }
}



