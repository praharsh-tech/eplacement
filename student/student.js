// 🔐 LOAD USER
const user = JSON.parse(localStorage.getItem("loggedInUser"));

// 🚫 PROTECT ROUTE
if (!user || user.role !== "student") {
  window.location.href = "../index.html";
}

// 🎯 SET USER DATA
document.getElementById("welcome").innerText = "Hi, " + user.name;
document.getElementById("name").innerText = user.name;
document.getElementById("dept").innerText = user.dept;
document.getElementById("cgpa").innerText = user.cgpa;
document.getElementById("photo").src = user.pfp;

// 📦 LOAD APPLICATIONS
let applications = JSON.parse(localStorage.getItem("applications")) || [];
let myApps = applications.filter(app => app.userId === user.id);

// 📊 STATS
document.getElementById("applications").innerText = myApps.length;
document.getElementById("status").innerText =
  myApps.length > 0 ? "Applied" : "Not Applied";

// 📢 ANNOUNCEMENT
document.getElementById("announcement").innerText =
  "🚀 New companies are hiring! Apply before deadlines.";

// 🧠 TIPS
const tips = [
  "Complete your profile",
  "Upload your CV",
  "Apply early",
  "Prepare for interviews"
];

const tipsList = document.getElementById("tipsList");
tips.forEach(tip => {
  const li = document.createElement("li");
  li.textContent = "✔ " + tip;
  tipsList.appendChild(li);
});

// 📦 LOAD JOBS FROM LOCALSTORAGE
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

// 🎯 RENDER JOBS
const container = document.getElementById("placementsContainer");
container.innerHTML = "";

// ❗ If no jobs
if (jobs.length === 0) {
  container.innerHTML = `
    <div class="bg-white p-5 rounded-xl shadow text-center text-gray-500">
      No jobs available yet
    </div>
  `;
}

// 🔁 LOOP JOBS
jobs.forEach(job => {
  const alreadyApplied = myApps.some(app => app.jobId === job.id);

  const card = document.createElement("div");
  card.className = "bg-white rounded-xl shadow p-5";

  card.innerHTML = `
    <h3 class="font-semibold text-lg">${job.company}</h3>
    <p class="text-sm text-gray-600 mt-1">
      Role: ${job.role} <br>
      Package: ₹${job.package}
    </p>

    <button 
      class="mt-3 px-4 py-2 rounded text-sm text-white ${
        alreadyApplied
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }"
      ${alreadyApplied ? "disabled" : ""}
      data-id="${job.id}"
    >
      ${alreadyApplied ? "Applied" : "Apply Now"}
    </button>
  `;

  container.appendChild(card);
});

// 📝 APPLY EVENT (EVENT DELEGATION)
container.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const jobId = Number(e.target.dataset.id);

    let applications =
      JSON.parse(localStorage.getItem("applications")) || [];

    // ❌ Prevent duplicate apply
    if (applications.some(app => app.userId === user.id && app.jobId === jobId)) {
      return;
    }

    applications.push({
      userId: user.id,
      jobId: jobId
    });

    localStorage.setItem("applications", JSON.stringify(applications));

    location.reload(); // refresh UI
  }
});

// 📄 CV UPLOAD
const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", () => {
  const fileInput = document.getElementById("cvUpload");
  const file = fileInput.files[0];

  if (!file) {
    document.getElementById("cvStatus").innerText = "Please select a file";
    return;
  }

  // Store only filename (demo)
  localStorage.setItem("cv_" + user.id, file.name);

  document.getElementById("cvStatus").innerText =
    "Uploaded: " + file.name;
});

// 📊 PROFILE STRENGTH CALCULATION
let strength = 40;

if (user.cgpa >= 8) strength += 20;
if (localStorage.getItem("cv_" + user.id)) strength += 20;
if (myApps.length > 0) strength += 20;

// Cap at 100
if (strength > 100) strength = 100;

document.getElementById("profileBar").style.width = strength + "%";
document.getElementById("profileText").innerText =
  strength + "% Complete";

// 🚪 LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html";
});