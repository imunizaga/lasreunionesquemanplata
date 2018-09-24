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


function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    if (seconds == 0) {
      setImage();
    }

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}

function setImage() {
  ajax_get(api_url, function(data) {
    var html = '<img src="' + data[0]["url"] + '">';
    document.getElementById("image-wrapper").innerHTML = html;
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

  var seconds = 60 * minutes,
    display = document.querySelector('#timer');
  startTimer(seconds, display);
};
