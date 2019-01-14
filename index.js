function ajax_get(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('responseText:' + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch(err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

// ---- Cats
var catApiUrl = 'https://api.thecatapi.com/v1/images/search?'
var dogApiUrl = 'https://api.thedogapi.com/v1/images/search?'
var moneyApiUrl = 'https://66.media.tumblr.com/tumblr_mak6ktGGkA1ru90dzo1_250.gif'
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
apiUrl += "mime_type=jpg,png"// just static imagrs
//apiUrl += "mime_types=gif"// just gifs

// Add your API-Key to have access to all the images in the platform, not just the demo ones
// apiUrl += "YOUR-API-KEY"

var CAT = 'cat';
var DOG = 'dog';
var MONEY = 'money';
var countDownDate;
var display;
var finished = false;
var interval;
var isPaused = true;
var loading = false;
var nextImageUrl;
var pauseTime = null;
var people;

// DOM variables
var apiUrlInput = document.getElementById("apiUrl");


function currentApi() {
    if (apiUrl.includes(dogApiUrl)) {
      return DOG;
    } else if (apiUrl.includes(catApiUrl)) {
      return CAT;
    }

    return MONEY;
}

function reset() {
  document.querySelector("body").classList.add("not-started");
  isPaused = true;
  display.innerHTML = '';
  clearInterval(interval);
}

function setCurrentApi(theme) {
  var body = document.querySelector('body');

  if (theme == DOG) {
    if (currentApi() == MONEY && interval) {
      reset();
    }

    body.classList.remove('cat');
    body.classList.remove('money');
    body.classList.add('dog');
    apiUrl = dogApiUrl;

  } else if(theme == MONEY) {
    if (interval) {
      reset();
    }

    this.className = 'btn btn-money';
    body.classList.remove('dog')
    body.classList.remove('cat');
    body.classList.add('money')
    apiUrl = moneyApiUrl;

  } else {
    if (currentApi() == MONEY && interval) {
      reset();
    }

    this.className = 'btn btn-cat';
    body.classList.remove('dog');
    body.classList.remove('money');
    body.classList.add('cat')
    apiUrl = catApiUrl;

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
  var hours = roundMethod((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = roundMethod((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = roundMethod((milliseconds % (1000 * 60)) / 1000);

  if (seconds == 55 || !document.querySelector("img").src) {
    preloadImage();
  }

  if (seconds == 0 || !document.getElementById("image-wrapper").style.backgroundImage) {
    setImage();
  }

  text = '';

  if (days) {
    text = days + "d ";
  }

  if (hours) {
    text += hours + "h ";
  }

  // Display the result in the element with id="demo"
  if (minutes) {
    text += minutes + "m ";
  }

  text += seconds + "s ";

  if (milliseconds < 0) {
    if (apiUrl.includes('dog')) {
      text = 'Guau!<br>' + text;
    } else {
      text = 'Miau!<br>' + text;
    }
  }

  return text;
}

function getMoneyValue() {
  // Find the distance between now and the count down date
  var milliseconds = new Date() - startTime;

  // Time calculations for days, hours, minutes and seconds
  var value = Math.floor(27500 * people * (milliseconds / (60 * 6)) / 10000);

  if (!document.getElementById("image-wrapper").style.backgroundImage) {
    setImage();
  }

  currency = 'CLP'

  if (value > 1000000) {
    value = Math.round(value / 10000) / 100;
    currency = 'MM'
  }

  text = App.utils.thousandSeparator(value) + ' ' + currency;

  return text;
}

function copyToClipboard() {
  /* Select the text field */
  apiUrlInput.select();

  /* Copy the text inside the text field */
  document.execCommand("copy");

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
  alert("Link a la foto copiada al portapapeles: " + apiUrlInput.value);
}


function updateTimer() {
  if (isPaused) {
    return;
  }

  if (currentApi() == MONEY) {
    text = getMoneyValue();
  } else {
    text = getTimerText();
  }

  // Display the result in the element with id="demo"
  display.innerHTML = text;
  document.title = text + ' Cattimer!';
}

function startTimer(minutesDuration) {
  if (minutesDuration) {
    countDownDate = new Date((new Date()).getTime() + minutesDuration * 60000);
  } else {
    startTime = new Date();
  }

  updateTimer();

  interval = setInterval(updateTimer, 1000);
}

function preloadImage() {
  if (loading) {
    return
  }
  loading = true;

  function success(data) {
    loading = false;

    nextImageUrl = data[0]["url"];

    var img = document.querySelector('img');
    var imageMissing = !img.src;

    img.src = nextImageUrl;

    if (!img.src && !isPaused) {
      var style = 'url(' + nextImageUrl + ')';
      document.querySelectorAll(".image-background").forEach(function(el) {
        el.style.backgroundImage = style;
      });
      updateTimer();
      apiUrlInput.value = nextImageUrl;
    }
  }

  if (apiUrl == moneyApiUrl) {
    success([{
      'url': moneyApiUrl,
    }]);
  } else {
    ajax_get(apiUrl, success);
  }
}

function setImage() {
  var img = document.querySelector('img');

  if (nextImageUrl) {
    var style = 'url(' + nextImageUrl + ')';
    apiUrlInput.value = nextImageUrl;
    document.querySelectorAll(".image-background").forEach(function(el) {
      el.style.backgroundImage = style;
    });
  }
}

function pause() {
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
  countDownDate.setTime(countDownDate.getTime() + d);

  var btn = document.querySelector('.btn.btn-play');
  btn.className = btn.className.replace('play', 'pause');

  var icon = btn.querySelector('.fa-play');
  icon.className = icon.className.replace('play', 'pause');
}

function start(value) {
  isPaused = false;
  display = document.querySelector('#timer');
  var minutes;

  if (currentApi() == MONEY) {
    people = value;
  } else {
    minutes = value;
  }

  startTimer(minutes);
}

function setupFom(form, onSubmit) {
  var input = form.querySelector('input');
  var button = form.querySelector(".setup-form button");

  if (input.offsetParent !== null) {
    input.focus();
  }

  input.onkeyup = function() {
    var minutes = this.value.trim();

    if (input.value != '') {
      try {
        minutes = parseInt(minutes);
        button.classList.remove("hide");
      } catch(error) {
        button.classList.add("hide");
      }
    } else {
      button.classList.add("hide");
    }
  }

  form.onsubmit = function(e) {
    e.preventDefault();
    onSubmit(form);
  }
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
    var input = form.querySelector('input');
    var value = input.value.trim();

    try {
      value = parseInt(value);
      document.querySelector("body").classList.remove("not-started");
      start(value);
    } catch(error) {
      input.classList.add("has-error");
    }
  }

  setupMoneyForms(onSubmit);
  setupAnimalsForms(onSubmit);
}

window.onload = function () {
  preloadImage();

  var button = document.querySelector(".setup-form button");
  var params = (new URL(document.location)).searchParams;
  var qTime = params.get("t");
  var minutes = 0;
  var minutesStrings;

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

      document.querySelector("body").classList.remove("not-started");
      start(minutes);

    } catch(error) {
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

      if (this.className.includes(CAT)) {
        setCurrentApi(CAT);
      } else if (this.className.includes(DOG)) {
        setCurrentApi(DOG);
      } else {
        setCurrentApi(MONEY);
      }

      nextImageUrl = null;
      document.querySelectorAll(".image-background").forEach(function(el) {
        el.style.backgroundImage = '';
      });
      document.querySelector('img').removeAttribute("src");
      preloadImage();
    }
  });
};
