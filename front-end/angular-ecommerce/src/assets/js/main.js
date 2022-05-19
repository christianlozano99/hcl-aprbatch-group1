
// Sign Up form validation originally from https://www.the-art-of-web.com/javascript/validate-password/
document.addEventListener("DOMContentLoaded", function () {
    // JavaScript form validation

    var checkPassword = function (str) {
      var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      return re.test(str);
    };

    var checkForm = function (e) {
      re = /^\w+$/;
      if (this.pwd1.value != "" && this.pwd1.value == this.pwd2.value) {
        if (!checkPassword(this.pwd1.value)) {
          alert("The password you have entered is not valid!");
          this.pwd1.focus();
          e.preventDefault();
          return;
        }
      } else {
        alert("Error: Please check that you've entered and confirmed your password!");
        this.pwd1.focus();
        e.preventDefault();
        return;
      }
      alert("Both username and password are VALID!");
    };

    var myForm = document.getElementById("signUpForm");
    myForm.addEventListener("submit", checkForm, true);

    var myForm2 = document.getElementById("pwdForm");
    myForm2.addEventListener("submit", checkForm, true);
    // HTML5 form validation

    var supports_input_validity = function () {
      var i = document.createElement("input");
      return "setCustomValidity" in i;
    }

    if (supports_input_validity()) {
      var usernameInput = document.getElementById("email2");
      usernameInput.setCustomValidity(usernameInput.title);

      var pwd1Input = document.getElementById("pwd1");

      pwd1Input.setCustomValidity(pwd1Input.title);

      var pwd2Input = document.getElementById("pwd2");

      // input key handlers
      usernameInput.addEventListener("keyup", function (e) {
        usernameInput.setCustomValidity(this.validity.patternMismatch ? usernameInput.title : "");
      }, false);

      pwd1Input.addEventListener("keyup", function (e) {
        this.setCustomValidity(this.validity.patternMismatch ? pwd1Input.title : "");
        if (this.checkValidity()) {
          pwd2Input.pattern = RegExp.escape(this.value);
          pwd2Input.setCustomValidity(pwd2Input.title);
        } else {
          pwd2Input.pattern = this.pattern;
          pwd2Input.setCustomValidity("");
        }
      }, false);

      pwd2Input.addEventListener("keyup", function (e) {
        this.setCustomValidity(this.validity.patternMismatch ? pwd2Input.title : "");
      }, false);

    }

  }, false);