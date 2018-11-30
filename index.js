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
var apiUrl = 'https://api.thecatapi.com/v1/images/search?'

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

var loading = false;
var nextImageUrl;
var countDownDate;
var display;
var interval;
var isPaused = true;
var pauseTime = null;


function updateTimer() {
  if (isPaused) {
    return;
  }

  // Get todays date and time
  var now = new Date();

  // Find the distance between now and the count down date
  var milliseconds = countDownDate - now;

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

  // Display the result in the element with id="demo"
  display.innerHTML = text;
}

function startTimer(minutesDuration) {
  countDownDate = new Date((new Date()).getTime() + minutesDuration * 60000);

  updateTimer();
  interval = setInterval(updateTimer, 500);
}

function preloadImage() {
  if (loading) {
    return
  }
  loading = true;

  ajax_get(apiUrl, function(data) {
    loading = false;

    nextImageUrl = data[0]["url"];

    var img = document.querySelector('img');

    if (!img.src && !isPaused) {
      var style = 'url(' + nextImageUrl + ')';
      document.querySelectorAll(".image-background").forEach(function(el) {
        el.style.backgroundImage = style;
      });
      updateTimer();
    }

    document.querySelector("img").src = nextImageUrl;

  });
}

function setImage() {
  var img = document.querySelector('img');

  if (nextImageUrl) {
    var style = 'url(' + nextImageUrl + ')';
    document.querySelectorAll(".image-background").forEach(function(el) {
      el.style.backgroundImage = style;
    });
  }
}

function pause() {
  isPaused = true;
  pauseTime = new Date();
}

function play() {
  isPaused = false;

  var now = new Date();

  d = now - pauseTime;
  countDownDate.setTime(countDownDate.getTime() + d);
}

function start(minutes) {
  isPaused = false;
  display = document.querySelector('#timer');
  startTimer(minutes);
}

window.onload = function () {
  preloadImage();

  var input = document.querySelector(".form-container input");
  var button = document.querySelector(".form-container button");
  var em = document.querySelector(".form-container em");
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

    input.focus();

    input.onkeyup = function() {
      var minutes = this.value.trim();

      if (arguments[0].keyCode == 13) {
        onSubmit();
      }

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
  }

  function onSubmit() {
    var minutes = input.value.trim();

    if (minutes == '') {
      input.classList.add("has-error");
      return;
    }

    try {
      minutes = parseInt(minutes);
      document.querySelector("body").classList.remove("not-started");
      start(minutes);
    } catch(error) {
      input.classList.add("has-error");
    }

  }

  button.onclick = onSubmit;

  document.querySelectorAll('.btn').forEach(function(e) {
    e.onclick = function() {
      if (this.className.includes('play')) {
        this.className = this.className.replace('play', 'pause');
        return play();
      } else if (this.className.includes('pause')) {
        this.className = this.className.replace('pause', 'play');
        return pause();
      }

      if (this.className.includes('dog')) {
        document.querySelector('body').classList.remove('cat');
        document.querySelector('body').classList.add('dog');
        apiUrl = apiUrl.replace('cat', 'dog');
      } else {
        this.className = 'btn btn-cat';
        document.querySelector('body').classList.remove('dog')
        document.querySelector('body').classList.add('cat')
        apiUrl = apiUrl.replace('dog', 'cat');
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
