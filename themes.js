var themeManager = {
  nextImageUrl: undefined,
  prevImageUrl: undefined,
  themes: {}
};

themeManager.themes.cat = {
  url: 'https://api.thecatapi.com/v1/images/search?'
};

themeManager.themes.dog = {
  url: 'https://api.thedogapi.com/v1/images/search?'
};

themeManager.themes.money = {
  url: 'moneyApi'
};

themeManager.currentTheme = themeManager.themes.money;

themeManager.showLastImage = function() {
  themeManager.nextImageUrl = themeManager.prevImageUrl;
  themeManager.setImage();
};

themeManager.imageLoaded = function(data) {
  themeManager.loading = false;

  themeManager.nextImageUrl = data[0].url;

  var img = document.querySelector('img');
  var imageMissing = !img.src;

  if (!img.src) {
    img.src = themeManager.nextImageUrl;
    var style = 'url(' + themeManager.nextImageUrl + ')';
    document.querySelectorAll('.image-background').forEach(function(el) {
      el.style.backgroundImage = style;
    });

    updateTimer();
    apiUrlInput.value = themeManager.nextImageUrl;
  }
};

themeManager.finish = function() {
  var audio;

  if (themeManager.currentTheme == themeManager.themes.cat) {
    audio = new Audio('http://soundbible.com/grab.php?id=1954&type=mp3');
  } else if (themeManager.currentTheme == themeManager.themes.dog) {
    audio = new Audio('http://soundbible.com/grab.php?id=75&type=mp3');
  }

  if (audio) {
    audio.play();
  }
};

themeManager.preloadImage = function() {
  if (themeManager.loading) {
    return;
  }

  themeManager.loading = true;

  if (themeManager.currentTheme == themeManager.themes.money) {
    moneyImageIndex += 1;
    moneyImageIndex = moneyImageIndex % moneyImages.length;

    themeManager.imageLoaded([{
      url: moneyImages[moneyImageIndex]
    }]);
  } else {
    ajaxGet(themeManager.currentTheme.url, themeManager.imageLoaded);
  }
};

themeManager.setImage = function() {
  var img = document.querySelector('img');

  if (themeManager.nextImageUrl) {
    if (currentImageUrl && currentImageUrl != themeManager.nextImageUrl) {
      if (!themeManager.prevImageUrl) {
        document.querySelector('.btn-backward').classList.remove('d-none');
      }

      themeManager.prevImageUrl = currentImageUrl;
    }

    currentImageUrl = themeManager.nextImageUrl;

    var style = 'url(' + themeManager.nextImageUrl + ')';
    apiUrlInput.value = themeManager.nextImageUrl;
    document.querySelectorAll('.image-background').forEach(function(el) {
      el.style.backgroundImage = style;
    });
  }
};

themeManager.setTheme = function(theme) {
  var body = document.querySelector('body');

  themeManager.currentTheme = theme;
  themeManager.nextImageUrl = null;

  if (theme === themeManager.themes.dog) {
    body.classList.remove('cat-theme');
    body.classList.remove('money-theme');
    body.classList.add('dog-theme');

  } else if (theme === themeManager.themes.money) {
    this.className = 'btn btn-money';

    body.classList.remove('dog-theme');
    body.classList.remove('cat-theme');
    body.classList.add('money-theme');

  } else {
    this.className = 'btn btn-cat';
    body.classList.remove('dog-theme');
    body.classList.remove('money-theme');
    body.classList.add('cat-theme');
  }

  document.querySelectorAll('.image-background').forEach(function(el) {
    el.style.backgroundImage = '';
  });

  document.querySelector('img').removeAttribute('src');

  themeManager.preloadImage();

};
