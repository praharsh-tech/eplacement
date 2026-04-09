import { users } from "./data/userdata.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!role || !username || !password) {
      alert("Please fill all fields");
      return;
    }

    const user = users.find(
      (u) =>
        u.role === role &&
        u.username === username &&
        u.password === password
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    if (user.role === "student") {
      window.location.href = "./student/dashboard.html";
    } else if (user.role === "admin") {
      window.location.href = "./admin/admindashboard.html";
    }
  });
});