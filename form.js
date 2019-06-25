function onFormSubmit(form) {
  var formData = new FormData(form);
  var key;
  var values = {};

  try {
    for (key of formData.keys()) {
      values[key] = parseInt(formData.get(key));

      if (isNaN(values[key])) {
        values[key] = formData.get(key);
      }

      if (values[key] === undefined) {
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

function validateForm() {
  var form = document.querySelector('.setup-form');
  var button = form.querySelector('.setup-form button');

  var minutesInput = form.querySelector('input[name="minutes"]');
  var minutes = minutesInput.value.trim();

  var peopleCountInput = form.querySelector('input[name="peopleCount"]');
  var peopleCount = peopleCountInput.value.trim();

  if (minutesInput.value !== '') {
    try {
      minutes = parseInt(minutes);
      peopleCount = parseInt(peopleCount);

      if (minutes >= 0 && peopleCount > 0) {
        button.classList.remove('hide');
      } else {
        button.classList.add('hide');
      }
    } catch (error) {
      button.classList.add('hide');
    }
  } else {
    button.classList.add('hide');
  }
}


function setupForm() {
  var form = document.querySelector('.setup-form');

  var minutesInput = form.querySelector('input[name="minutes"]');

  minutesInput.onkeyup = validateForm;
  var inputs = form.querySelectorAll('input');

  for (var i = 0; i < inputs.length; i += 1) {
    inputs[i].onchange = validateForm;
  }

  form.onsubmit = function(e) {
    e.preventDefault();
    onFormSubmit(form);
  };

  validateForm();
}
