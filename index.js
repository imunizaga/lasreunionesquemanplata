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
var api_url = 'https://api.thecatapi.com/v1/images/search?'

// ---- Dogs
//var api_url = 'https://api.thedogapi.com/v1/images/search?'

// -- sizes
//api_url += "size=full&" // full size
// api_url += "size=med&" // medium size
//api_url += "size=small&" // small size


// -- formats
api_url += "mime_type=jpg,png"// just static imagrs
//api_url += "mime_types=gif"// just gifs

// Add your API-Key to have access to all the images in the platform, not just the demo ones
// api_url += "YOUR-API-KEY"


function startTimer(minutesDuration, display) {
  var countDownDate = new Date((new Date()).getTime() + minutesDuration * 60000);

  function updateTimer() {
    // Get todays date and time
    var now = new Date();

    // Find the distance between now and the count down date
    var milliseconds = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    var hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

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
    display.innerHTML = text + minutes + "m " + seconds + "s ";

    // If the count down is finished, write some text
    if (milliseconds < 0) {
      clearInterval(x);
      display.innerHTML = "00:00";
    }
  }
  updateTimer();
  setInterval(updateTimer, 500);
}

function setImage() {
  ajax_get(api_url, function(data) {
    var style = 'url(' + data[0]["url"] + ')';
    document.querySelectorAll(".image-background").forEach(function(el) {
      el.style.backgroundImage = 'url(' + data[0]["url"] + ')';
    });
  });
}

window.onload = function () {
  var minutes;

  while (!minutes) {
    try {
      minutes = parseInt(prompt("Please a number of minutes", "120"));
    } catch(error) {
    }
  }

  startTimer(minutes, document.querySelector('#timer'));
};
