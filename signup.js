import { users as defaultUsers } from "../data/userdata.js";

// Load users (or default)
let users = JSON.parse(localStorage.getItem("users")) || defaultUsers;

// Signup
document.getElementById("signupBtn").addEventListener("click", () => {

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const dept = document.getElementById("dept").value.trim();
  const cgpa = document.getElementById("cgpa").value.trim();

  // Validation
  if (!name || !username || !password || !dept || !cgpa) {
    alert("Please fill all fields");
    return;
  }

  // Check duplicate
  const exists = users.find(u => u.username === username);
  if (exists) {
    alert("User already exists");
    return;
  }

  // Create user
  const newUser = {
    id: Date.now(),
    role: "student",
    username,
    password,
    name,
    dept,
    cgpa: Number(cgpa),
    dob: "",
    gender: "",
    pfp: "https://randomuser.me/api/portraits/men/1.jpg"
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  // Auto login
  localStorage.setItem("loggedInUser", JSON.stringify(newUser));

  // Redirect
  window.location.href = "../student/studentdashboard.html";
});