console.log("ADMIN JS RUNNING");

// ===============================
// AUTH + USERS
// ===============================
import { users as defaultUsers } from "../data/userdata.js";

// signup users
let signupUsers = JSON.parse(localStorage.getItem("signupStudents")) || [];

// merge (no duplicates)
let allUsers = [...defaultUsers];

signupUsers.forEach(u => {
  if (!allUsers.find(user => user.username === u.username)) {
    allUsers.push(u);
  }
});

// current user
const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user || user.role !== "admin") {
  window.location.href = "../index.html";
}

// profile UI
document.getElementById("adminName").innerText = "Hi, " + user.name;
document.getElementById("adminNameCard").innerText = user.name;
document.getElementById("adminPfp").src = user.pfp;

// ===============================
// DATA
// ===============================
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let applications = JSON.parse(localStorage.getItem("applications")) || [];

// ===============================
// STATS
// ===============================
function updateStats() {
  const students = allUsers.filter(u => u.role === "student");

  document.getElementById("totalJobs").innerText = jobs.length;
  document.getElementById("totalApplications").innerText = applications.length;
  document.getElementById("totalStudents").innerText = students.length;

  // big cards
  document.getElementById("totalJobsBig").innerText = jobs.length;
  document.getElementById("totalApplicationsBig").innerText = applications.length;
  document.getElementById("totalStudentsBig").innerText = students.length;
}

// ===============================
// TAB SWITCHING
// ===============================
const tabs = document.querySelectorAll(".tabBtn");
const views = document.querySelectorAll(".view");

tabs.forEach(btn => {
  btn.addEventListener("click", () => {

    tabs.forEach(b => b.classList.remove("bg-blue-600", "text-white"));
    tabs.forEach(b => b.classList.add("bg-white"));

    btn.classList.add("bg-blue-600", "text-white");

    const target = btn.dataset.tab;

    views.forEach(v => v.classList.add("hidden"));
    document.getElementById(target + "View").classList.remove("hidden");
  });
});

// ===============================
// RENDER JOBS
// ===============================
function renderJobs() {
  const container = document.getElementById("jobsContainer");
  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML = `<p class="text-gray-500 text-sm">No jobs added yet</p>`;
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement("div");

    card.className = `
      border p-4 rounded-lg flex justify-between items-center
      hover:shadow-lg transition hover:-translate-y-1
    `;

    card.innerHTML = `
      <div>
        <h4 class="font-semibold text-blue-600">${job.company}</h4>
        <p class="text-sm text-gray-600">${job.role} | ₹${job.package}</p>
      </div>

      <button class="bg-red-500 text-white px-3 py-1 rounded text-sm"
        data-id="${job.id}">
        Delete
      </button>
    `;

    container.appendChild(card);
  });
}

// ===============================
// ADD JOB
// ===============================
document.getElementById("jobForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const deptChecks = document.querySelectorAll(".deptCheck");
  const selectedDepts = [];

  deptChecks.forEach(cb => {
    if (cb.checked) {
      selectedDepts.push(cb.value);
    }
  });

  const newJob = {
    id: Date.now(),
    company: document.getElementById("company").value.trim(),
    role: document.getElementById("role").value.trim(),
    package: document.getElementById("package").value.trim(),
    description: document.getElementById("description").value.trim(),
    eligibleDepts: selectedDepts
  };

  jobs.push(newJob);
  localStorage.setItem("jobs", JSON.stringify(jobs));

  e.target.reset();
  deptChecks.forEach(cb => cb.checked = false);

  renderJobs();
  updateStats();
  renderApplications();
});

// ===============================
// DELETE JOB
// ===============================
document.getElementById("jobsContainer").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = Number(e.target.dataset.id);

    jobs = jobs.filter(j => j.id !== id);
    applications = applications.filter(a => a.jobId !== id);

    localStorage.setItem("jobs", JSON.stringify(jobs));
    localStorage.setItem("applications", JSON.stringify(applications));

    renderJobs();
    updateStats();
    renderApplications();
  }
});

// ===============================
// APPLICATIONS
// ===============================
function renderApplications() {
  const container = document.getElementById("applicationsContainer");
  container.innerHTML = "";

  if (applications.length === 0) {
    container.innerHTML = `<p class="text-gray-500 text-sm">No applications yet</p>`;
    return;
  }

  applications.forEach(app => {
    const job = jobs.find(j => j.id === app.jobId);
    const student = allUsers.find(u => u.id === app.userId);

    const cv = localStorage.getItem("cv_" + app.userId);

    const card = document.createElement("div");

    card.className = "bg-white rounded-xl p-4 shadow hover:shadow-lg transition";

    card.innerHTML = `
      <div class="flex justify-between items-center">

        <div class="flex items-center gap-3">

          <img src="${student?.pfp || ''}" 
               class="w-10 h-10 rounded-full object-cover border">

          <div>
            <h4 class="font-semibold text-blue-600">
              ${student?.name || "Unknown"}
            </h4>
            <p class="text-sm text-gray-600">
              ${job?.company || "Deleted"} - ${job?.role || ""}
            </p>
          </div>

        </div>

        <div class="flex gap-2">
          ${
            cv
              ? `<a href="${cv}" target="_blank"
                  class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  CV
                </a>`
              : `<span class="text-xs text-gray-400">No CV</span>`
          }

          <span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            Applied
          </span>
        </div>

      </div>
    `;

    container.appendChild(card);
  });
}

// ===============================
// LOGOUT
// ===============================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html";
});

// ===============================
// INIT
// ===============================
renderJobs();
renderApplications();
updateStats();