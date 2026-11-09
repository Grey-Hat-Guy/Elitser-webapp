const API_BASE = "https://elitser-backend.vercel.app/api";
const LINKEDIN_JOBS_URL = "https://www.linkedin.com/company/elitser/jobs/";
const jobsContainer = document.getElementById("jobsContainer");

function createJobCard(job) {
  const card = document.createElement("article");
  card.className = "job-card";

  const reference = document.createElement("span");
  reference.className = "job-reference";
  reference.textContent = job.job_reference || "";

  if (job.is_urgent) {
    const urgent = document.createElement("span");
    urgent.className = "job-urgent";
    urgent.textContent = "URGENT";
    reference.appendChild(urgent);
  }

  const title = document.createElement("h3");
  title.textContent = job.title;

  const meta = document.createElement("div");
  meta.className = "job-meta";

  [job.department, job.location, job.employment_type, job.salary_range]
    .filter(Boolean)
    .forEach((value) => {
      const pill = document.createElement("span");
      pill.className = "job-pill";
      pill.textContent = value;
      meta.appendChild(pill);
    });

  const description = document.createElement("p");
  description.className = "job-description";
  description.textContent = job.description;

  const actions = document.createElement("div");
  actions.className = "job-actions";

  const applyButton = document.createElement("a");
  applyButton.className = "apply-cv";
  applyButton.textContent = "Apply with CV";
  applyButton.href = `/apply.html?job=${encodeURIComponent(job.id)}`;

  const linkedInButton = document.createElement("a");
  linkedInButton.className = "apply-linkedin";
  linkedInButton.textContent = "Apply on LinkedIn";
  linkedInButton.href = LINKEDIN_JOBS_URL;
  linkedInButton.target = "_blank";
  linkedInButton.rel = "noopener noreferrer";

  actions.append(applyButton, linkedInButton);
  card.append(reference, title, meta, description, actions);

  return card;
}

async function loadJobs() {
  try {
    const response = await fetch(`${API_BASE}/jobs`);

    if (!response.ok) {
      throw new Error("Unable to fetch vacancies");
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.jobs)) {
      throw new Error("Invalid response from server");
    }

    jobsContainer.replaceChildren();

    if (result.jobs.length === 0) {
      const message = document.createElement("p");
      message.className = "jobs-message";
      message.textContent =
        "There are no current openings. Please check again later.";
      jobsContainer.appendChild(message);
      return;
    }

    result.jobs.forEach((job) => {
      jobsContainer.appendChild(createJobCard(job));
    });
  } catch (error) {
    console.error("Careers page error:", error);

    jobsContainer.replaceChildren();

    const message = document.createElement("p");
    message.className = "jobs-message";
    message.textContent =
      "Unable to load vacancies right now. Please try again later.";
    jobsContainer.appendChild(message);
  }
}

loadJobs();
