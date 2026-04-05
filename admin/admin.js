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

// 📊 UPDATE STATS
function updateStats() {
  document.getElementById("totalJobs").innerText = jobs.length;
  document.getElementById("totalApplications").innerText = applications.length;
}

// 🎯 RENDER JOBS
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
    card.className = "border p-4 rounded-lg flex justify-between items-center";

    card.innerHTML = `
      <div>
        <h4 class="font-semibold">${job.company}</h4>
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

// ➕ ADD JOB
document.getElementById("jobForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const company = document.getElementById("company").value.trim();
  const role = document.getElementById("role").value.trim();
  const package = document.getElementById("package").value.trim();

  if (!company || !role || !package) {
    alert("Fill all fields");
    return;
  }

  const newJob = {
    id: Date.now(),
    company,
    role,
    package
  };

  jobs.push(newJob);

  localStorage.setItem("jobs", JSON.stringify(jobs));

  e.target.reset();

  renderJobs();
  updateStats();
});

// ❌ DELETE JOB
document.getElementById("jobsContainer").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const jobId = Number(e.target.dataset.id);

    jobs = jobs.filter(job => job.id !== jobId);

    // also remove related applications
    applications = applications.filter(app => app.jobId !== jobId);

    localStorage.setItem("jobs", JSON.stringify(jobs));
    localStorage.setItem("applications", JSON.stringify(applications));

    renderJobs();
    updateStats();
  }
});

// 🚪 LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html";
});

// 🚀 INITIAL LOAD
renderJobs();
updateStats();