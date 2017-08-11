// Глобальный объект MyForm
function MyForm(id) {
  this.form = document.getElementById(id);
  this.inputFio = this.form.querySelector("input[name='fio']");
  this.inputEmail = this.form.querySelector("input[name='email']");
  this.inputPhone = this.form.querySelector("input[name='phone']");
  this.button = this.form.querySelector("#submitButton");
  this.resultContainer = this.form.querySelector("#resultContainer");
  this.isValid = true;
  this.errorFields = [];
  this.button.onclick = () => {
    this.submit();
  };
}

MyForm.prototype.validate = function() {
  let data = this.getData();
  this.nameValidation(data.fio);
  this.emailValidation(data.email);
  this.phoneValidation(data.phone);
  return { isValid: this.isValid, errorFields: this.errorFields };
};

// Функция вызова ошибки
MyForm.prototype.throwError = function(el) {
  this.isValid = false;
  this.errorFields.push(el.name);
  el.classList.add("error");
  return 0;
};

// Убираем ошибку, если всё ок
MyForm.prototype.disableError = function(el) {
  this.isValid = true;
  this.errorFields.splice(this.errorFields.indexOf(el.name), 1);
  el.classList.remove("error");
  return 0;
};

// Функция обработки ФИО
MyForm.prototype.nameValidation = function(str) {
  let arrNames = str.split(" ").filter(el => {
    return el.replace(/[^A-Za-zА-Яа-яё]/gim, "");
  });
  if (arrNames.length == 3) {
    this.disableError(this.inputFio);
  } else {
    this.throwError(this.inputFio);
  }
};

// Функция обработки Email
MyForm.prototype.emailValidation = function(str) {
  const pattern = /[a-zA-Z0-9.+@]+@(ya\.ru|(yandex\.(ru|ua|by|kz|com)))/;
  str.match(pattern)
    ? this.disableError(this.inputEmail)
    : this.throwError(this.inputEmail);
};

// Маска ввода телефона
var phoneNumber = new PhoneMask(document.getElementById("phone_mask"), {
  pattern: "+7(___)___-__-__",
  patternChar: "_",
  allowedRegExp: /^\d$/
});

// Валидируем номер телефона
MyForm.prototype.phoneValidation = function(str) {
  let numArray = str.replace(/[^0-9]/gim, "").split(""),
    sumNum = 0;
  if (numArray.length != 11) {
    this.throwError(this.inputPhone);
    return 0;
  }
  for (var k = 0; k < numArray.length; k++) sumNum += +numArray[k];
  sumNum > 30
    ? this.throwError(this.inputPhone)
    : this.disableError(this.inputPhone);
};

// Получаем данные с формы
MyForm.prototype.getData = function() {
  let formData = {},
    inputs = Array.from(this.form.querySelectorAll("input"));
  for (let i = 0; i < inputs.length; i++) {
    formData[inputs[i].name] = inputs[i].value;
  }
  return formData;
};

MyForm.prototype.setData = function(obj) {
  [this.inputFio.value, this.inputEmail.value, this.inputPhone.value] = [
    obj.fio,
    obj.email,
    obj.phone
  ];
};

MyForm.prototype.submit = function() {
  this.validate();
  if (this.isValid) {
    this.button.setAttribute("disabled", true);
    // Отправляем запрос тут
  }
};

let nodeTest = new MyForm("myForm");
