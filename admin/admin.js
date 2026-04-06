import { users } from "../data/userdata";

// 🔐 LOAD USER
const user = JSON.parse(localStorage.getItem("loggedInUser"));

// 🚫 PROTECT ROUTE
if (!user || user.role !== "admin") {
  window.location.href = "../index.html";
}

// 🎯 SET ADMIN NAME
document.getElementById("adminName").innerText = "Hi, " + user.name;

// 📦 LOAD DATA
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let applications = JSON.parse(localStorage.getItem("applications")) || [];

// ==========================
// 📊 STATS
// ==========================
function updateStats() {
  document.getElementById("totalJobs").innerText = jobs.length;
  document.getElementById("totalApplications").innerText = applications.length;
}

// ==========================
// 🎯 RENDER JOBS
// ==========================
function renderJobs() {
  const container = document.getElementById("jobsContainer");
  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML = `
      <p class="text-gray-500 text-sm">No jobs added yet</p>
    `;
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement("div");

    card.className = `
      border p-4 rounded-lg flex justify-between items-center
      transform hover:-translate-y-1 hover:shadow-lg transition
    `;

    card.innerHTML = `
      <div>
        <h4 class="font-semibold text-blue-600">${job.company}</h4>
        <p class="text-sm text-gray-600">
          ${job.role} | ₹${job.package}
        </p>
      </div>

      <button 
        class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        data-id="${job.id}">
        Delete
      </button>
    `;

    container.appendChild(card);
  });
}

// ==========================
// ➕ ADD JOB
// ==========================
document.getElementById("jobForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const company = document.getElementById("company").value.trim();
  const role = document.getElementById("role").value.trim();
  const jobpackage = document.getElementById("package").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!company || !role || !jobpackage) {
    alert("Fill all fields");
    return;
  }

  const newJob = {
    id: Date.now(),
    company,
    role,
    jobpackage,
    description
  };

  jobs.push(newJob);
  localStorage.setItem("jobs", JSON.stringify(jobs));

  e.target.reset();

  renderJobs();
  updateStats();
  renderApplications();
});

// ==========================
// ❌ DELETE JOB
// ==========================
document.getElementById("jobsContainer").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const jobId = Number(e.target.dataset.id);

    jobs = jobs.filter(job => job.id !== jobId);
    applications = applications.filter(app => app.jobId !== jobId);

    localStorage.setItem("jobs", JSON.stringify(jobs));
    localStorage.setItem("applications", JSON.stringify(applications));

    renderJobs();
    updateStats();
    renderApplications();
  }
});

// ==========================
// 📊 RENDER APPLICATIONS (FIXED)
// ==========================
function renderApplications() {
  const container = document.getElementById("applicationsContainer");
  container.innerHTML = "";

  if (applications.length === 0) {
    container.innerHTML = `
      <p class="text-gray-500 text-sm">No applications yet</p>
    `;
    return;
  }

  applications.forEach(app => {
    const job = jobs.find(j => j.id === app.jobId);

    // ✅ FIXED: use imported users
    const student = users.find(u => u.id === app.userId);
    const studentName = student ? student.name : "Unknown Student";

    // 📄 CV
    const cv = localStorage.getItem("cv_" + app.userId);

    const card = document.createElement("div");

    card.className = `
      bg-white rounded-xl p-4 shadow
      transform hover:-translate-y-1 hover:shadow-lg transition
    `;

    card.innerHTML = `
      <div class="flex justify-between items-center">

        <div>
          <h4 class="font-semibold text-blue-600">${studentName}</h4>
          <p class="text-sm text-gray-600">
            Applied for <strong>${job?.company || "Unknown Job"}</strong>
          </p>
          <p class="text-xs text-gray-400">
            ${app.appliedAt || ""}
          </p>
        </div>

        <div class="flex gap-2">
          ${
            cv
              ? `<a href="${cv}" target="_blank"
                   class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                   View CV
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

// ==========================
// 🖱 DASHBOARD CLICK
// ==========================
const dashboardCard = document.getElementById("dashboardCard");

if (dashboardCard) {
  dashboardCard.addEventListener("click", () => {
    alert("Dashboard clicked 📊");
  });
}

// ==========================
// 🚪 LOGOUT
// ==========================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html";
});

// ==========================
// 🚀 INITIAL LOAD
// ==========================
renderJobs();
updateStats();
renderApplications();