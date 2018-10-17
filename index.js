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

function startTimer(minutesDuration, display) {
  var countDownDate = new Date((new Date()).getTime() + minutesDuration * 60000);

  function updateTimer() {
    // Get todays date and time
    var now = new Date();

    // Find the distance between now and the count down date
    var milliseconds = countDownDate - now;

    // If the count down is finished, write some text
    if (milliseconds < 0) {
      clearInterval(interval);
      if (apiUrl.includes('dog')) {
        display.innerHTML = 'Guau!';
      } else {
        display.innerHTML = 'Miau!';
      }
      return;
    }

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    var hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

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
    // Display the result in the element with id="demo"
    display.innerHTML = text + seconds + "s ";
  }
  updateTimer();
  var interval = setInterval(updateTimer, 500);
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

    if (!img.src) {
      var style = 'url(' + nextImageUrl + ')';
      document.querySelectorAll(".image-background").forEach(function(el) {
        el.style.backgroundImage = style;
      });
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

preloadImage();

window.onload = function () {
  var minutes;

  while (!minutes || minutes < 0) {
    try {
      minutes = parseInt(prompt("Please a number of minutes", "120"));
    } catch(error) {
    }
  }

  startTimer(minutes, document.querySelector('#timer'));

  document.querySelectorAll('.btn').forEach(function(e) {
    e.onclick = function() {
      if (this.className.includes('dog')) {
        document.querySelector('body').className = 'dog';
        apiUrl = apiUrl.replace('cat', 'dog');
      } else {
        this.className = 'btn btn-cat';
        document.querySelector('body').className = 'cat';
        apiUrl = apiUrl.replace('dog', 'cat');
      }
      document.querySelectorAll(".image-background").forEach(function(el) {
        el.style.backgroundImage = '';
      });
      document.querySelector('img').removeAttribute("src");
      preloadImage();
    }
  })
};
