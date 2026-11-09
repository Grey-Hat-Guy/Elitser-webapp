import { supabase } from "./supabase.js";

const API_BASE = "https://elitser-backend.vercel.app/api";

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const loginLoader = document.getElementById("loginLoader");
const loginButtonText = loginButton.querySelector(".button-text");

function showMessage(message, type = "error") {
  loginMessage.textContent = message;
  loginMessage.className = `message ${type}`;
}

async function verifyAdmin(accessToken) {
  const response = await fetch(`${API_BASE}/admin/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "You are not authorized to access this panel",
    );
  }

  return result.admin;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginButton.disabled = true;
  loginLoader.hidden = false;
  loginButtonText.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    await verifyAdmin(data.session.access_token);

    showMessage("Login successful. Redirecting...", "success");

    window.location.replace("./dashboard.html");
  } catch (error) {
    await supabase.auth.signOut();

    showMessage(error.message || "Unable to sign in.");
  } finally {
    loginButton.disabled = false;
    loginLoader.hidden = true;
    loginButtonText.textContent = "Sign In";
  }
});
