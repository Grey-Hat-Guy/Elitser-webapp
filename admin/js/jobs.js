import { supabase } from "./supabase.js";

const API_BASE = "https://elitser-backend.vercel.app/api";

const dashboardContainer = document.getElementById("dashboardContainer");
const adminEmail = document.getElementById("adminEmail");
const logoutButton = document.getElementById("logoutButton");

const jobsMessage = document.getElementById("jobsMessage");
const jobsTableWrapper = document.getElementById("jobsTableWrapper");
const jobsTableBody = document.getElementById("jobsTableBody");

const jobModal = document.getElementById("jobModal");
const jobForm = document.getElementById("jobForm");
const addJobButton = document.getElementById("addJobButton");
const closeModalButton = document.getElementById("closeModalButton");
const cancelJobButton = document.getElementById("cancelJobButton");
const saveJobButton = document.getElementById("saveJobButton");
const formMessage = document.getElementById("formMessage");

let accessToken = null;
let currentEditingJob = null;
let jobs = [];

async function redirectToLogin() {
  await supabase.auth.signOut();
  window.location.replace("./login.html");
}

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error("Authentication required");
  }

  accessToken = data.session.access_token;
  return accessToken;
}

async function apiRequest(endpoint, options = {}) {
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

async function verifyAdmin() {
  const result = await apiRequest("/admin/me");
  return result.admin;
}

function updateStatistics() {
  document.getElementById("totalJobs").textContent = jobs.length;

  document.getElementById("publishedJobs").textContent = jobs.filter(
    (job) => job.status === "published",
  ).length;

  document.getElementById("draftJobs").textContent = jobs.filter(
    (job) => job.status === "draft",
  ).length;

  document.getElementById("closedJobs").textContent = jobs.filter(
    (job) => job.status === "closed",
  ).length;
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "—";
  return cell;
}

function renderJobs() {
  jobsTableBody.replaceChildren();

  if (jobs.length === 0) {
    jobsMessage.textContent = "No vacancies have been created yet.";
    jobsMessage.hidden = false;
    jobsTableWrapper.hidden = true;
    return;
  }

  jobs.forEach((job) => {
    const row = document.createElement("tr");

    row.appendChild(createCell(job.job_reference));
    row.appendChild(createCell(job.title));
    row.appendChild(createCell(job.department));
    row.appendChild(createCell(job.location));
    row.appendChild(createCell(job.employment_type));

    const statusCell = document.createElement("td");
    const statusBadge = document.createElement("span");

    statusBadge.className = `job-status ${job.status}`;
    statusBadge.textContent = job.status;

    statusCell.appendChild(statusBadge);
    row.appendChild(statusCell);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");

    actions.className = "action-buttons";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "action-button";
    editButton.textContent = "Edit";
    editButton.dataset.action = "edit";
    editButton.dataset.id = job.id;

    const statusButton = document.createElement("button");
    statusButton.type = "button";
    statusButton.className = "action-button";
    statusButton.textContent = job.status === "published" ? "Close" : "Publish";
    statusButton.dataset.action = "toggle-status";
    statusButton.dataset.id = job.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action-button delete";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = job.id;

    actions.append(editButton, statusButton, deleteButton);
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);

    jobsTableBody.appendChild(row);
  });

  jobsMessage.hidden = true;
  jobsTableWrapper.hidden = false;
}

async function loadJobs() {
  jobsMessage.textContent = "Loading vacancies...";
  jobsMessage.hidden = false;
  jobsTableWrapper.hidden = true;

  const result = await apiRequest("/admin/jobs");

  jobs = result.jobs;

  updateStatistics();
  renderJobs();
}

function showFormMessage(message, type = "error") {
  formMessage.textContent = message;
  formMessage.className = `message ${type}`;
}

function resetJobForm() {
  jobForm.reset();
  currentEditingJob = null;

  document.getElementById("modalTitle").textContent = "Create New Job";

  const referenceGroup = document.getElementById("referenceGroup");
  const jobReference = document.getElementById("jobReference");

  referenceGroup.hidden = false;
  jobReference.required = true;

  saveJobButton.textContent = "Create Job";
  formMessage.textContent = "";
  formMessage.className = "message";
}

function openCreateModal() {
  resetJobForm();
  jobModal.showModal();
}

function openEditModal(job) {
  resetJobForm();

  currentEditingJob = job;

  document.getElementById("modalTitle").textContent = "Edit Job";

  const referenceGroup = document.getElementById("referenceGroup");
  const jobReference = document.getElementById("jobReference");

  referenceGroup.hidden = true;
  jobReference.required = false;

  document.getElementById("jobTitle").value = job.title || "";
  document.getElementById("jobDepartment").value = job.department || "";
  document.getElementById("jobLocation").value = job.location || "";
  document.getElementById("employmentType").value = job.employment_type || "";
  document.getElementById("salaryRange").value = job.salary_range || "";
  document.getElementById("jobDescription").value = job.description || "";
  document.getElementById("isUrgent").checked = job.is_urgent;

  saveJobButton.textContent = "Save Changes";

  jobModal.showModal();
}

function getJobFormData() {
  return {
    title: document.getElementById("jobTitle").value.trim(),
    department: document.getElementById("jobDepartment").value.trim() || null,
    description: document.getElementById("jobDescription").value.trim(),
    location: document.getElementById("jobLocation").value.trim(),
    employment_type: document.getElementById("employmentType").value,
    salary_range: document.getElementById("salaryRange").value.trim() || null,
    is_urgent: document.getElementById("isUrgent").checked,
  };
}

jobForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  saveJobButton.disabled = true;
  saveJobButton.textContent = "Saving...";

  try {
    const formData = getJobFormData();

    if (currentEditingJob) {
      await apiRequest(`/admin/jobs/${currentEditingJob.id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
    } else {
      const jobReference = document.getElementById("jobReference").value.trim();

      if (!jobReference) {
        throw new Error("Job reference is required");
      }

      await apiRequest("/admin/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          job_reference: jobReference,
          status: "draft",
        }),
      });
    }

    jobModal.close();
    resetJobForm();

    await loadJobs();
  } catch (error) {
    showFormMessage(error.message);
  } finally {
    saveJobButton.disabled = false;
    saveJobButton.textContent = currentEditingJob
      ? "Save Changes"
      : "Create Job";
  }
});

jobsTableBody.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const { action, id } = button.dataset;
  const job = jobs.find((item) => item.id === id);

  if (!job) return;

  if (action === "edit") {
    openEditModal(job);
    return;
  }

  if (action === "toggle-status") {
    const newStatus = job.status === "published" ? "closed" : "published";

    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus === "closed" ? "close" : "publish"} this vacancy?`,
    );

    if (!confirmed) return;

    button.disabled = true;

    try {
      await apiRequest(`/admin/jobs/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      await loadJobs();
    } catch (error) {
      alert(error.message);
      button.disabled = false;
    }

    return;
  }

  if (action === "delete") {
    const confirmed = window.confirm(
      `Delete ${job.job_reference} - ${job.title}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    button.disabled = true;

    try {
      await apiRequest(`/admin/jobs/${id}`, {
        method: "DELETE",
      });

      await loadJobs();
    } catch (error) {
      alert(error.message);
      button.disabled = false;
    }
  }
});

addJobButton.addEventListener("click", openCreateModal);

closeModalButton.addEventListener("click", () => {
  jobModal.close();
});

cancelJobButton.addEventListener("click", () => {
  jobModal.close();
});

jobModal.addEventListener("close", resetJobForm);

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;

  const { error } = await supabase.auth.signOut();

  if (error) {
    logoutButton.disabled = false;
    alert("Unable to log out. Please try again.");
    return;
  }

  window.location.replace("./login.html");
});

async function initializeDashboard() {
  try {
    const admin = await verifyAdmin();

    adminEmail.textContent = admin.email;
    dashboardContainer.hidden = false;

    await loadJobs();
  } catch (error) {
    console.error("Dashboard initialization error:", error);

    if (
      error.message.includes("Authentication required") ||
      error.message.includes("Invalid or expired session") ||
      error.message.includes("Admin access denied")
    ) {
      return redirectToLogin();
    }

    jobsMessage.textContent = "Unable to load vacancies. Please refresh.";
  }
}

initializeDashboard();
