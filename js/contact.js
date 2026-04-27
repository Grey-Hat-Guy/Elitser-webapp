export function initContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  if (form.dataset.listenerAttached) return;
  form.dataset.listenerAttached = "true";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      organization: document.getElementById("organization").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    Object.keys(data).forEach((key) => {
      if (!data[key]) delete data[key];
    });

    try {
      const res = await fetch(
        "https://elitser-backend.vercel.app/api/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();

      if (result.success) {
        alert("Message sent successfully");
        form.reset();
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  });
}
