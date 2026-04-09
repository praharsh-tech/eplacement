//  LOAD USER
const user = JSON.parse(localStorage.getItem("loggedInUser"));
let showAllJobs = false;

// PROTECT ROUTE
if (!user || user.role !== "student") {
  window.location.href = "../index.html";
}

function showToast(message, type = "default") {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.innerText = message;
  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");

  // color
  toast.classList.remove("bg-black", "bg-red-500", "bg-green-500");

  if (type === "error") {
    toast.classList.add("bg-red-500", "text-white");
  } else if (type === "success") {
    toast.classList.add("bg-green-500", "text-white");
  } else {
    toast.classList.add("bg-black", "text-white");
  }

  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2000);
}

//  SET USER DATA
document.getElementById("welcome").innerText = "Hi, " + user.name;
document.getElementById("name").innerText = user.name;
document.getElementById("dept").innerText = user.dept;
document.getElementById("cgpa").innerText = user.cgpa;
document.getElementById("dob").innerText = "DOB: " + user.dob;
document.getElementById("gender").innerText = "Gender: " + user.gender;

//  FIXED PHOTO
document.getElementById("photo").src =
  user.pfp;

//  LOAD APPLICATIONS
let applications = JSON.parse(localStorage.getItem("applications")) || [];
let myApps = applications.filter(app => app.userId === user.id);
const savedCV = localStorage.getItem("cv_" + user.id);

if (savedCV) {
  document.getElementById("cvStatus").innerHTML = `
    Uploaded ✅ 
    <a href="${savedCV}" target="_blank" class="text-blue-600 underline ml-2">
      View CV
    </a>
  `;
}

// 📊 STATS
document.getElementById("applications").innerText = myApps.length;
document.getElementById("status").innerText =
  myApps.length > 0 ? "Applied" : "Not Applied";

//  ANNOUNCEMENT
document.getElementById("announcement").innerText =
  "🚀 New companies are hiring! Apply before deadlines.";

//  TIPS
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

document.getElementById("allJobsBtn").addEventListener("click", () => {
  showAllJobs = true;
  renderJobs();
});

document.getElementById("eligibleBtn").addEventListener("click", () => {
  showAllJobs = false;
  renderJobs();
});

// ==========================
//  JOB SYSTEM (UPDATED)
// ==========================

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
const container = document.getElementById("placementsContainer");
container.innerHTML = "";

//  If no jobs
if (jobs.length === 0) {
  container.innerHTML = `
    <div class="bg-white p-5 rounded-xl shadow text-center text-gray-500">
      No jobs available yet
    </div>
  `;
}

//  LOOP JOBS (UPDATED UI)
function renderJobs() {

  const container = document.getElementById("placementsContainer");
  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-5 rounded-xl shadow text-center text-gray-500">
        No jobs available yet
      </div>
    `;
    return;
  }

  jobs.forEach(job => {

    const card = document.createElement("div");

    const studentDept = user.dept;

    if (!showAllJobs) {
      if (!job.eligibleDepts || !job.eligibleDepts.includes(studentDept)) return;
    }

    card.className = `
      bg-white rounded-2xl shadow-lg p-5 
      border-l-4 border-blue-500 cursor-pointer
      transform hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02]
      transition duration-300
    `;

    card.innerHTML = `
      <h3 class="font-bold text-lg text-blue-600">${job.company}</h3>
      <p class="text-sm text-gray-600 mt-2">${job.role}</p>
      <p class="text-sm font-semibold text-indigo-600 mt-1">₹${job.package}</p>
    `;

    card.addEventListener("click", () => openModal(job));

    container.appendChild(card);
  });

}

// ==========================
//  MODAL SYSTEM (NEW)
// ==========================

const modal = document.getElementById("jobModal");
const closeModal = document.getElementById("closeModal");
const modalCompany = document.getElementById("modalCompany");
const modalRole = document.getElementById("modalRole");
const modalPackage = document.getElementById("modalPackage");
const modalDesc = document.getElementById("modalDesc");
const applyBtnModal = document.getElementById("applyBtnModal");

let currentJobId = null;

function openModal(job) {
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // 🔥 animate in
  setTimeout(() => {
    document.getElementById("modalBox").classList.remove("scale-90", "opacity-0");
    document.getElementById("modalBox").classList.add("scale-100", "opacity-100");
  }, 10);

  document.body.style.overflow = "hidden";

  modalCompany.innerText = job.company;
  modalRole.innerText = job.role;
  modalPackage.innerText = job.package;
  modalDesc.innerText = job.description || "No description available";

  currentJobId = job.id;
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal.click();
  }
});

// CLOSE MODAL
closeModal.addEventListener("click", () => {

  const box = document.getElementById("modalBox");

  // 🔥 animate out
  box.classList.remove("scale-100", "opacity-100");
  box.classList.add("scale-90", "opacity-0");

  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }, 200);

  
});
// APPLY FROM MODAL
applyBtnModal.addEventListener("click", () => {

  const hasCV = localStorage.getItem("cv_" + user.id);

  // 
  if (!hasCV) {
    showToast("⚠ Please upload your CV before applying!");
    return;
  }

  let applications =
    JSON.parse(localStorage.getItem("applications")) || [];

  if (applications.some(app => app.userId === user.id && app.jobId === currentJobId)) {
    return;
  }

  applications.push({
    userId: user.id,
    jobId: currentJobId,
    appliedAt: new Date().toLocaleString()
  });

  localStorage.setItem("applications", JSON.stringify(applications));

  location.reload();
});
// ==========================
//  CV UPLOAD (ADVANCED)
// ==========================

const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", () => {
  const fileInput = document.getElementById("cvUpload");
  const file = fileInput.files[0];

  if (!file) {
    document.getElementById("cvStatus").innerText = "Select a file first";
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    localStorage.setItem("cv_" + user.id, reader.result);

    document.getElementById("cvStatus").innerHTML = `
      Uploaded ✅ 
      <a href="${reader.result}" target="_blank" class="text-blue-600 underline ml-2">
        View CV
      </a>
    `;
  };

  reader.readAsDataURL(file);
});

//  PROFILE STRENGTH
let strength = 40;

if (user.cgpa >= 8) strength += 20;
if (localStorage.getItem("cv_" + user.id)) strength += 20;
if (myApps.length > 0) strength += 20;

if (strength > 100) strength = 100;

document.getElementById("profileBar").style.width = strength + "%";
document.getElementById("profileText").innerText =
  strength + "% Complete";

//  LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html";
});

function renderAppliedJobs() {
  const container = document.getElementById("appliedJobsContainer");

  const applications =
    JSON.parse(localStorage.getItem("applications")) || [];

  const myApps = applications.filter(app => app.userId === user.id);

  container.innerHTML = "";

  if (myApps.length === 0) {
    container.innerHTML = `<p class="text-sm text-gray-500">No applied jobs yet</p>`;
    return;
  }

  myApps.forEach(app => {
    const job = jobs.find(j => j.id === app.jobId);

    const div = document.createElement("div");
    div.className = "text-sm bg-gray-50 p-2 rounded";

    div.innerHTML = `
      ${job?.company || "Deleted"} - ${job?.role || ""}
    `;

    container.appendChild(div);
  });
}

renderAppliedJobs();