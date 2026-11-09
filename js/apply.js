import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const API_BASE = "https://elitser-backend.vercel.app/api";

const SUPABASE_URL = "https://hgytwrnkuoafdobstryl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_Hh2Af5hag8Yqo6e2iq_Qyg_fj5kvgSV";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const applicationForm = document.getElementById("applicationForm");
const selectedJob = document.getElementById("selectedJob");
const pageMessage = document.getElementById("pageMessage");
const resumeInput = document.getElementById("resume");
const fileName = document.getElementById("fileName");
const uploadArea = document.querySelector(".upload-area");
const submitButton = document.getElementById("submitApplication");

let currentJob = null;

function showMessage(message, type = "error") {
  pageMessage.textContent = message;
  pageMessage.className = `application-message ${type}`;
  pageMessage.hidden = false;
}

function validateResume(file) {
  if (!file) {
    throw new Error("Please select your CV or resume.");
  }

  const allowedExtensions = ["pdf", "doc", "docx"];
  const extension = file.name.split(".").pop().toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    throw new Error("Only PDF, DOC and DOCX files are supported.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Your CV must not exceed 5 MB.");
  }

  if (file.size === 0) {
    throw new Error("The selected file is empty.");
  }

  return true;
}

async function loadSelectedJob() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("job");

  if (!jobId) {
    throw new Error(
      "No vacancy was selected. Please return to the Careers page.",
    );
  }

  const response = await fetch(`${API_BASE}/jobs`);

  if (!response.ok) {
    throw new Error("Unable to retrieve vacancy details. Please try again.");
  }

  const result = await response.json();

  if (!result.success || !Array.isArray(result.jobs)) {
    throw new Error("Unable to retrieve vacancy details.");
  }

  currentJob = result.jobs.find((job) => job.id === jobId);

  if (!currentJob) {
    throw new Error(
      "This vacancy is no longer available. Please check the Careers page.",
    );
  }

  document.getElementById("jobTitle").textContent = currentJob.title;
  document.getElementById("jobReference").textContent =
    `Job Reference: ${currentJob.job_reference}`;

  document.getElementById("applicationJobLabel").textContent =
    `${currentJob.title} (${currentJob.job_reference})`;

  selectedJob.hidden = false;
  applicationForm.hidden = false;
}

function handleSelectedFile(file) {
  if (!file) return;

  try {
    validateResume(file);
    fileName.textContent = file.name;
    pageMessage.hidden = true;
  } catch (error) {
    resumeInput.value = "";
    fileName.textContent = "Click to select your CV or drag and drop here";

    showMessage(error.message);
  }
}

// Open file picker on click
uploadArea.addEventListener("click", () => {
  resumeInput.click();
});

// Keyboard accessibility
uploadArea.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    resumeInput.click();
  }
});

// Handle file picker selection
resumeInput.addEventListener("change", () => {
  handleSelectedFile(resumeInput.files[0]);
});

// Drag and drop
uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("dragging");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragging");
});

uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadArea.classList.remove("dragging");

  const file = event.dataTransfer.files[0];

  if (!file) return;

  try {
    validateResume(file);

    const transfer = new DataTransfer();
    transfer.items.add(file);
    resumeInput.files = transfer.files;

    handleSelectedFile(file);
  } catch (error) {
    resumeInput.value = "";
    fileName.textContent = "Click to select your CV or drag and drop here";

    showMessage(error.message);
  }
});

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentJob) {
    showMessage("Please select a valid vacancy.");
    return;
  }

  const resume = resumeInput.files[0];

  try {
    validateResume(resume);

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    showMessage("Uploading your resume...", "success");

    const uploadUrlResponse = await fetch(
      `${API_BASE}/applications/upload-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: currentJob.id,
          fileName: resume.name,
          fileSize: resume.size,
          fileType: resume.type,
        }),
      },
    );

    const uploadUrlResult = await uploadUrlResponse.json();

    if (!uploadUrlResponse.ok || !uploadUrlResult.success) {
      throw new Error(
        uploadUrlResult.message || "Unable to prepare resume upload.",
      );
    }

    const { error: uploadError } = await supabase.storage
      .from("career-resumes-temp")
      .uploadToSignedUrl(uploadUrlResult.path, uploadUrlResult.token, resume, {
        contentType: resume.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error("Resume upload failed. Please try again.");
    }

    showMessage("Resume uploaded. Submitting your application...", "success");

    const applicationData = {
      jobId: currentJob.id,
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      mobile: document.getElementById("mobile").value.trim(),
      linkedin: document.getElementById("linkedin").value.trim(),
      location: document.getElementById("location").value,
      industry: document.getElementById("industry").value,
      resumePath: uploadUrlResult.path,
      resumeFileName: resume.name,
    };

    const submitResponse = await fetch(`${API_BASE}/applications/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    const submitResult = await submitResponse.json();

    if (!submitResponse.ok || !submitResult.success) {
      throw new Error(
        submitResult.message || "Unable to submit your application.",
      );
    }

    showMessage("Your application has been submitted successfully!", "success");

    applicationForm.reset();

    fileName.textContent = "Click to select your CV or drag and drop here";
  } catch (error) {
    console.error("Application submission error:", error);

    showMessage(error.message || "Something went wrong. Please try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Application";
  }
});

async function initializeApplication() {
  applicationForm.hidden = false;

  try {
    await loadSelectedJob();
  } catch (error) {
    showMessage(error.message);
  }
}

initializeApplication();
