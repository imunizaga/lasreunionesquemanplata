function ajaxGet(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('responseText:' + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + ' in ' + xmlhttp.responseText);
        return;
      }

      callback(data);
    }
  };

  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}

// ---- Cats
var catApiUrl = 'https://api.thecatapi.com/v1/images/search?';
var dogApiUrl = 'https://api.thedogapi.com/v1/images/search?';
var moneyApiUrl = 'moneyApi';
var apiUrl = catApiUrl;

// ---- Dogs
//var apiUrl = 'https://api.thedogapi.com/v1/images/search?'

// ---- sizes
// http://api.giphy.com/v1/gifs/search?api_key=VK7vgk34YgkHXmVaozKWk55AR4uDZ3wH&q=money

// -- sizes
//apiUrl += "size=full&" // full size
// apiUrl += "size=med&" // medium size
//apiUrl += "size=small&" // small size

// -- formats
apiUrl += 'mime_type=jpg,png';// just static imagrs
//apiUrl += "mime_types=gif"// just gifs

// Add your API-Key to have access to all the images in the platform, not just the demo ones
// apiUrl += "YOUR-API-KEY"

var CAT = 'cat';
var DOG = 'dog';
var MONEY = 'money';
var currentTimer;

var countDownDate;
var display;
var dashboard;
var finished = false;
var interval;
var isPaused = true;
var loading = false;
var nextImageUrl;
var pauseTime = null;
var people;
var accumulatedMoney = 0;
var startTime;
var lastUpdateTime;
var millisecondsPassed;

// DOM variables
var apiUrlInput = document.getElementById('apiUrl');

function currentApi() {
  if (apiUrl.includes(dogApiUrl)) {
    return DOG;
  } else if (apiUrl.includes(catApiUrl)) {
    return CAT;
  }

  return MONEY;
}

function reset() {
  document.querySelector('body').classList.add('not-started');
  isPaused = true;
  display.innerHTML = '';
  dashboard.innerHTML = '';
  clearInterval(interval);

  people = 0;
  accumulatedMoney = 0;
}

function setCurrentApi(theme) {
  var body = document.querySelector('body');

  if (theme === DOG) {
    body.classList.remove('cat-theme');
    body.classList.remove('money-theme');
    body.classList.add('dog-theme');
    apiUrl = dogApiUrl;

  } else if (theme === MONEY) {
    this.className = 'btn btn-money';

    body.classList.remove('dog-theme');
    body.classList.remove('cat-theme');
    body.classList.add('money-theme');
    apiUrl = moneyApiUrl;

  } else {
    this.className = 'btn btn-cat';
    body.classList.remove('dog-theme');
    body.classList.remove('money-theme');
    body.classList.add('cat-theme');
    apiUrl = catApiUrl;
  }
}

function increasePeople() {
  people += 1;
  updateDashboard();
}

function decreasePeople() {
  if (people > 0) {
    people -= 1;
    updateDashboard();
  }
}

function finish() {
  var audio;
  finished = true;

  if (currentApi() == CAT) {
    audio = new Audio('http://soundbible.com/grab.php?id=1954&type=mp3');
  } else {
    audio = new Audio('http://soundbible.com/grab.php?id=75&type=mp3');
  }

  audio.play();
}

function updateImage(seconds) {
  if (seconds == 55 || !document.querySelector('img').src) {
    preloadImage();
  }

  if (seconds == 0 ||
    !document.getElementById('image-wrapper').style.backgroundImage) {
    setImage();
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
    if (apiUrl.includes('dog')) {
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
    '<i class="fas fa-user"></i> ' + people +
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
  var value = Math.floor(27500 * people * (milliseconds / (60 * 6)) / 10000);
  accumulatedMoney += value;

  if (!document.getElementById('image-wrapper').style.backgroundImage) {
    setImage();
  }

  currency = 'CLP';

  if (accumulatedMoney > 1000000) {
    text = App.utils.thousandSeparator(
      Math.round(accumulatedMoney / 10000) / 100
    ) + ' MM';
  } else {
    text = App.utils.thousandSeparator(accumulatedMoney) + ' ' + currency;
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
  document.title = text + ' Cattimer!';
}

function startTimer(values) {

  if (currentTimer == MONEY) {
    startTime = new Date();
    lastUpdateTime = new Date((new Date()).getTime() - values.minutes * 60000);
    millisecondsPassed = 0;
  } else {
    countDownDate = new Date((new Date()).getTime() + values.minutes * 60000);
  }

  updateTimer();

  interval = setInterval(updateTimer, 1000);
}

function preloadImage() {
  if (loading) {
    return;
  }

  loading = true;

  function success(data) {
    loading = false;

    nextImageUrl = data[0].url;

    var img = document.querySelector('img');
    var imageMissing = !img.src;

    img.src = nextImageUrl;

    if (!img.src && !isPaused) {
      var style = 'url(' + nextImageUrl + ')';
      document.querySelectorAll('.image-background').forEach(function(el) {
        el.style.backgroundImage = style;
      });

      updateTimer();
      apiUrlInput.value = nextImageUrl;
    }
  }

  if (apiUrl == moneyApiUrl) {
    success([{
      url: moneyImages[Math.floor(Math.random() * moneyImages.length)]
    }]);
  } else {
    ajaxGet(apiUrl, success);
  }
}

function setImage() {
  var img = document.querySelector('img');

  if (nextImageUrl) {
    var style = 'url(' + nextImageUrl + ')';
    apiUrlInput.value = nextImageUrl;
    document.querySelectorAll('.image-background').forEach(function(el) {
      el.style.backgroundImage = style;
    });
  }
}

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
  isPaused = false;
  display = document.querySelector('#timer');
  dashboard = document.querySelector('#dashboard');

  if (currentTimer === undefined) {
    currentTimer = currentApi();
    document.querySelector('body').classList.add(currentTimer + '-timer');

    if (currentTimer !== MONEY) {
      moneyButtons = document.querySelectorAll('.d-money');

      for (var i = 0; i < moneyButtons.length; i++) {
        moneyButtons[i].remove();
      }
    }
  }

  if (currentTimer === MONEY) {
    people = values.count;
  }

  startTimer(values);
}

function setupFom(form, onSubmit) {
  var input = form.querySelector('input');
  var button = form.querySelector('.setup-form button');

  if (input.offsetParent !== null) {
    input.focus();
  }

  input.onkeyup = function() {
    var minutes = this.value.trim();

    if (input.value != '') {
      try {
        minutes = parseInt(minutes);
        button.classList.remove('hide');
      } catch (error) {
        button.classList.add('hide');
      }
    } else {
      button.classList.add('hide');
    }
  };

  form.onsubmit = function(e) {
    e.preventDefault();
    onSubmit(form);
  };

}

function setupMoneyForms(onSubmit) {
  var form = document.querySelector('.setup-form-money');
  setupFom(form, onSubmit);
}

function setupAnimalsForms(onSubmit) {
  var form = document.querySelector('.setup-form-animals');
  setupFom(form, onSubmit);
}

function setupForms() {
  function onSubmit(form) {
    var formData = new FormData(form);
    var key;
    values = {};

    try {
      for (key of formData.keys()) {
        values[key] = parseInt(formData.get(key));

        if (isNaN(values[key]) || values[key] === undefined) {
          form.querySelector(
            'input[name="' + key + '"]'
          ).classList.add('has-error');

          return;
        }
      }

      document.querySelector('body').classList.remove('not-started');

    } catch (error) {
      form.querySelector(
        'input[name="' + key + '"]'
      ).classList.add('has-error');

      return;
    }

    start(values);
  }

  setupMoneyForms(onSubmit);
  setupAnimalsForms(onSubmit);
}

window.onload = function() {
  preloadImage();

  var button = document.querySelector('.setup-form button');
  var params = (new URL(document.location)).searchParams;
  var qTime = params.get('t');
  var minutes = 0;
  var minutesStrings;
  setCurrentApi(CAT);

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
      start(minutes);

    } catch (error) {
    }
  } else {
    setupForms();
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

      if (this.className.includes('btn-user-plus')) {
        return increasePeople();
      } else if (this.className.includes('btn-user-minus')) {
        return decreasePeople();
      }

      if (this.className.includes(CAT)) {
        setCurrentApi(CAT);
      } else if (this.className.includes(DOG)) {
        setCurrentApi(DOG);
      } else {
        setCurrentApi(MONEY);
      }

      nextImageUrl = null;
      document.querySelectorAll('.image-background').forEach(function(el) {
        el.style.backgroundImage = '';
      });

      document.querySelector('img').removeAttribute('src');

      preloadImage();
    };
  });
};

