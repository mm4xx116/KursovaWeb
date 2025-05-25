function generatePassword() {
  const length = +document.getElementById("length").value;
  const useLower = document.getElementById("lowercase").checked;
  const useUpper = document.getElementById("uppercase").checked;
  const useNumbers = document.getElementById("numbers").checked;
  const useSymbols = document.getElementById("symbols").checked;

  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const syms = "!@#$%^&*";

  let chars = "";
  if (useLower) chars += lowers;
  if (useUpper) chars += uppers;
  if (useNumbers) chars += nums;
  if (useSymbols) chars += syms;

  if (chars.length === 0) {
    alert("Оберіть хоча б один тип символів!");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  document.getElementById("generated").value = password;

  const result = zxcvbn(password);
  const score = result.score;

  const levels = ["Слабкий", "Слабкий", "Середній", "Сильний", "Дуже сильний"];
  const colors = ["red", "red", "orange", "green", "darkgreen"];

  const strengthEl = document.getElementById("strength");
  strengthEl.innerHTML = `Рівень безпеки: <span style="color: ${colors[score]}">⬤ ${levels[score]}</span>`;
}

function copyPassword() {
  const pwd = document.getElementById("generated");
  pwd.select();
  document.execCommand("copy");
  alert("Пароль скопійовано!");
}

// Менеджер
function loadPasswords() {
  return JSON.parse(localStorage.getItem("passwords") || "[]");
}

function savePasswords(passwords) {
  localStorage.setItem("passwords", JSON.stringify(passwords));
}

function displayPasswords() {
  const search = document.getElementById("search").value.toLowerCase();
  const passwords = loadPasswords();
  const passwordList = document.getElementById("password-list");
  passwordList.innerHTML = "";

  passwords.forEach((entry, index) => {
    if (entry.username.toLowerCase().includes(search)) {
      const div = document.createElement("div");
      div.className = "password-entry";
      div.innerHTML = `
        ${entry.username}<br/>
        <input type="password" value="${entry.password}" readonly />
        <button onclick="togglePasswordVisibility(this)">🔓</button>
        <button onclick="deletePassword(${index})">🗑</button>
      `;
      passwordList.appendChild(div);
    }
  });
}

function addPassword() {
  const username = document.getElementById("new-username").value;
  const password = document.getElementById("new-password").value;

  if (!username || !password) {
    alert("Заповніть усі поля");
    return;
  }

  const passwords = loadPasswords();
  passwords.push({ username, password });
  savePasswords(passwords);
  displayPasswords();

  document.getElementById("new-username").value = "";
  document.getElementById("new-password").value = "";
}

function deletePassword(index) {
  const passwords = JSON.parse(localStorage.getItem("passwords")) || [];
  passwords.splice(index, 1);
  localStorage.setItem("passwords", JSON.stringify(passwords));
  displayPasswords();
}

function togglePasswordVisibility(button) {
  const input = button.previousElementSibling;
  if (input.type === "password") {
    input.type = "text";
    button.textContent = "🔒";
  } else {
    input.type = "password";
    button.textContent = "🔓";
  }
}

function saveGeneratedPassword() {
  const password = document.getElementById("generated").value;
  const username = document.getElementById("save-username").value.trim();

  if (!password) {
    alert("Спочатку згенеруйте пароль");
    return;
  }

  if (!username) {
    alert("Введіть назву або логін для збереження");
    return;
  }

  const passwords = loadPasswords();
  passwords.push({ username, password });
  savePasswords(passwords);
  alert("Пароль збережено!");
  document.getElementById("save-username").value = "";
}

window.addEventListener("DOMContentLoaded", displayPasswords);