var CAT = 'cat';
var DOG = 'dog';
var MONEY = 'money';
var currentTimer = MONEY;

var countDownDate;
var display;
var dashboard;
var finished = false;
var interval;
var isPaused = true;
var loading = false;
var currentImageUrl;
var pauseTime = null;
var startTime;
var lastUpdateTime;
var millisecondsPassed;
var moneyImageIndex = Math.floor(Math.random() * moneyImages.length);
var configuration;

// DOM variables
var apiUrlInput = document.getElementById('apiUrl');

function reset() {
  document.querySelector('body').classList.add('not-started');
  isPaused = true;

  if (display) {
    display.innerHTML = '';
  }

  if (dashboard) {
    dashboard.innerHTML = '';
  }

  if (interval) {
    clearInterval(interval);
  }

  configuration = {
    peopleCount: 0,
    accumulatedMoney: 0
  }
}

function increasePeople() {
  configuration.peopleCount += 1;
  updateDashboard();
}

function decreasePeople() {
  if (configuration.peopleCount > 0) {
    configuration.peopleCount -= 1;
    updateDashboard();
  }
}

function finish() {
  finished = true;
  themeManager.finish();
}

function updateImage(seconds) {
  if (seconds == 55 || !document.querySelector('img').src) {
    themeManager.preloadImage();
  }

  if (seconds == 0 ||
    !document.getElementById('image-wrapper').style.backgroundImage) {
    themeManager.setImage();
  }
}

function getTimerText() {
  // Get todays date and time
  var now = new Date();

  // Find the distance between now and the count down date
  var milliseconds = countDownDate - now;

  if (milliseconds <= 0 && !finished) {
    finish();
  }

  var roundMethod = Math.floor;

  // If the count down is finished, write some text
  if (milliseconds < 0) {
    roundMethod = Math.ceil;
  }

  // Time calculations for days, hours, minutes and seconds
  var days = roundMethod(milliseconds / (1000 * 60 * 60 * 24));
  var hours = roundMethod(
    (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var minutes = roundMethod((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = roundMethod((milliseconds % (1000 * 60)) / 1000);

  updateImage(seconds);

  text = '';

  if (days) {
    text = days + 'd ';
  }

  if (hours) {
    text += hours + 'h ';
  }

  // Display the result in the element with id="demo"
  if (minutes) {
    text += minutes + 'm ';
  }

  text += seconds + 's ';

  if (milliseconds < 0) {
    if (themeManager.currentTheme.url.includes('dog')) {
      text = 'Guau!<br>' + text;
    } else {
      text = 'Miau!<br>' + text;
    }
  }

  return text;
}

function updateDashboard() {
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(millisecondsPassed / (1000 * 60 * 60 * 24));
  var hours = Math.floor(
    (millisecondsPassed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var minutes = Math.floor(
    (millisecondsPassed % (1000 * 60 * 60)) / (1000 * 60)
  );
  var seconds = Math.floor((millisecondsPassed % (1000 * 60)) / 1000);

  var timePassedText;

  updateImage(seconds);

  minutes = (minutes > 9 ? '' : '0') + minutes;
  seconds = (seconds > 9 ? '' : '0') + seconds;

  if (days > 0) {
    timePassedText = days + 'D ' + (hours > 9 ? '' : '0') + hours + ':H';
  } else if (hours > 0) {
    timePassedText = hours + ':' + minutes + ':' + seconds;
  } else {
    timePassedText = minutes + ':' + seconds;
  }

  dashboard.innerHTML = (
    '<i class="fas fa-user"></i> ' + configuration.peopleCount +
    '<br>' +
    '<i class="fas fa-clock"></i> ' + timePassedText
  );
}

function getMoneyValue() {
  // Find the distance between now and the count down date
  var milliseconds = new Date() - lastUpdateTime;
  millisecondsPassed += milliseconds;
  lastUpdateTime = new Date();

  // Time calculations for days, hours, minutes and seconds
  var value = Math.floor(
    configuration.hourlyCost *
    configuration.peopleCount *
    (millisecondsPassed / (60 * 6)) / 1000
  );
  configuration.accumulatedMoney += value;

  if (!document.getElementById('image-wrapper').style.backgroundImage) {
    themeManager.setImage();
  }

  if (configuration.accumulatedMoney > 1000000) {
    text = App.utils.thousandSeparator(
      Math.round(configuration.accumulatedMoney / 10000) / 100
    ) + ' MM';
  } else {
    text = App.utils.thousandSeparator(
      configuration.accumulatedMoney
    ) + ' ' + configuration.currency;
  }

  updateDashboard();

  return text;
}

function copyToClipboard() {
  /* Select the text field */
  apiUrlInput.select();

  /* Copy the text inside the text field */
  document.execCommand('copy');

  if (navigator && navigator.permissions) {
    navigator.permissions.query({
      name: 'clipboard-write'
    }).then(permissionStatus => {
      navigator.clipboard.writeText(apiUrlInput.value)
        .then(() => {
          console.log('Text copied to clipboard');
        })
        .catch(err => {
          // This can happen if the user denies clipboard permissions:
          console.error('Could not copy text: ', err);
        });
    });
  }

  /* Alert the copied text */
  alert('Link a la foto copiada al portapapeles: ' + apiUrlInput.value);
};

function updateTimer() {
  if (isPaused) {
    return;
  }

  if (currentTimer == MONEY) {
    text = getMoneyValue();
  } else {
    text = getTimerText();
  }

  // Display the result in the element with id="demo"
  display.innerHTML = text;
  document.title = text.replace(/<(?:.|\n)*?>/gm, '') + ' Cattimer!';
}

function startTimer(values) {

  startTime = new Date();
  lastUpdateTime = new Date((new Date()).getTime() - values.minutes * 60000);
  millisecondsPassed = 0;

  updateTimer();

  interval = setInterval(updateTimer, 1000);
};

function pause() {
  updateTimer();

  isPaused = true;
  pauseTime = new Date();
  var btn = document.querySelector('.btn.btn-pause');
  btn.className = btn.className.replace('pause', 'play');

  var icon = btn.querySelector('.fa-pause');
  icon.className = icon.className.replace('pause', 'play');
}

function play() {
  isPaused = false;

  var now = new Date();

  d = now - pauseTime;

  if (countDownDate !== undefined) {
    countDownDate.setTime(countDownDate.getTime() + d);
  }

  startTime = now;
  lastUpdateTime = startTime;

  var btn = document.querySelector('.btn.btn-play');
  btn.className = btn.className.replace('play', 'pause');

  var icon = btn.querySelector('.fa-play');
  icon.className = icon.className.replace('play', 'pause');
}

function start(values) {
  configuration = Object.assign({}, configuration, values);


  isPaused = false;
  display = document.querySelector('#timer');
  dashboard = document.querySelector('#dashboard');

  if (currentTimer === undefined) {
    document.querySelector('body').classList.add(currentTimer + '-timer');

    if (currentTimer !== MONEY) {
      moneyButtons = document.querySelectorAll('.d-money');

      for (var i = 0; i < moneyButtons.length; i++) {
        moneyButtons[i].remove();
      }
    }
  }

  startTimer(values);
}

window.onload = function() {
  themeManager.preloadImage();

  var button = document.querySelector('.setup-form button');
  var params = (new URL(document.location)).searchParams;
  var qTime = params.get('t');
  var minutes = 0;
  var minutesStrings;

  themeManager.setTheme(themeManager.themes.money);

  if (qTime != '' && qTime != null) {
    minutesStrings  = qTime.trim().split(':');

    try {
      for (var i in minutesStrings) {
        if (minutesStrings[i].includes('m')) {
          minutes += parseInt(minutesStrings[i].replace('m', ''));
        } else if (minutesStrings[i].includes('h')) {
          minutes += parseInt(minutesStrings[i].replace('h', '')) * 60;
        } else if (minutesStrings[i].includes('s')) {
          minutes += parseInt(minutesStrings[i].replace('s', '')) / 60;
        }
      }

      document.querySelector('body').classList.remove('not-started');
      start({minutes: minutes});

    } catch (error) {
    }
  } else {
    reset();
    setupForm();
  }

  document.querySelectorAll('.btn').forEach(function(e) {
    e.onclick = function() {
      if (this.className.includes('copy')) {
        return copyToClipboard();
      }

      if (this.className.includes('play')) {
        return play();
      } else if (this.className.includes('pause')) {
        return pause();
      }

      if (this.className.includes('backward')) {
        themeManager.showLastImage();
        return;
      }

      if (this.className.includes('timer')) {
        document.querySelector('body').classList.remove('timer-people');
        document.querySelector('body').classList.add('timer-timer');
        return;
      }

      if (this.className.includes('people')) {
        document.querySelector('body').classList.remove('timer-timer');
        document.querySelector('body').classList.add('timer-people');
        return;
      }

      if (this.className.includes('btn-user-plus')) {
        return increasePeople();
      } else if (this.className.includes('btn-user-minus')) {
        return decreasePeople();
      }

      if (this.className.includes('forward')) {
        themeManager.setTheme(themeManager.currentTheme);
      } else if (this.className.includes(CAT)) {
        themeManager.setTheme(themeManager.themes.cat);
      } else if (this.className.includes(DOG)) {
        themeManager.setTheme(themeManager.themes.dog);
      } else {
        themeManager.setTheme(themeManager.themes.money);
      }
    };
  });
};

