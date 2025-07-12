const supabase = window.supabase.createClient(
  "https://epsmnexwxcismleuqweu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc21uZXh3eGNpc21sZXVxd2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODg4NjUsImV4cCI6MjA2NzM2NDg2NX0.ttQr9tXCC6xNtqUjW0zQ4xJQW6UE62ejmm7eDI5nwxw" // anon public key
);

// Load the guest list from CSV when page loads
window.addEventListener("DOMContentLoaded", () => {
  // 🎯 Add Enter key listener here
  const input = document.getElementById("guestName");
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submit or page reload
      checkSchedule();
    }
  });
});

function splitName(fullNameInput) {
  const parts = fullNameInput.trim().toLowerCase().split(/\s+/);
  
  if (parts.length === 0) return { firstName: "", lastName: "" };

  const lastName = parts.pop(); // take the last part
  const firstName = parts.join(" "); // everything before that

  return {
    firstName,
    lastName
  };
}

async function checkSchedule() {
  const nameInput = document.getElementById("guestName");
  const inputName = nameInput.value.trim();
  const fullName = inputName.toLowerCase();

  const errorEl = document.getElementById("error");
  const templeWeddingEl = document.getElementById("templeWedding");
  const chapelWeddingEl = document.getElementById("chapelWedding");
  const enterNameEl = document.getElementById("enterName");
  const helloNameEl = document.getElementById("helloName");
  const RSVPButtonEl = document.getElementById("RSVPButton");

  errorEl.classList.add("hidden");
  templeWeddingEl.classList.add("hidden");
  chapelWeddingEl.classList.add("hidden");
  enterNameEl.classList.remove("hidden");
  helloNameEl.classList.add("hidden");

  if (!fullName) return;

  const name = splitName(fullName)

  const { data, error } = await supabase
    .from("guestlist")
    .select("tags")
    .eq("first_name", name.firstName)
    .eq("last_name", name.lastName)
    .limit(1);
    console.log("test result:", { data, error });

  if (error || !data || data.length === 0) {
    document.getElementById("error").classList.remove("hidden");
    return;
  }

  enterNameEl.classList.add("hidden");
  RSVPButtonEl.classList.remove("hidden");
  helloNameEl.classList.remove("hidden");
  const guestNameEl = helloNameEl.querySelector(".guestName");
  guestNameEl.textContent = `${inputName}`;

  const tags = data[0].tags
    .split("|")
    .map(t => t.trim().toLowerCase());

  if (tags.includes("temple")) {
    templeWeddingEl.classList.remove("hidden");
  }

  if (tags.includes("chapel")) {
    chapelWeddingEl.classList.remove("hidden");
  }
}
