import { users as defaultUsers } from "../data/userdata.js";

// load signup users
let signupUsers = JSON.parse(localStorage.getItem("signupStudents")) || [];

// merge both
let users = [...defaultUsers, ...signupUsers];

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!role || !username || !password) {
    alert("Fill all fields");
    return;
  }

  const user = users.find(
    u => u.role === role && u.username === username && u.password === password
  );

  if (!user) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  if (user.role === "student") {
    window.location.href = "./student/dashboard.html";
  } else {
    window.location.href = "./admin/admindashboard.html";
  }
});