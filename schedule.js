let guestList = {};

function buildGuestListFromCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const list = {};

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map(cell => cell.trim().replace(/^"|"$/g, ""));
    const data = Object.fromEntries(headers.map((key, idx) => [key, row[idx] || ""]));

    const fullName = `${data["First Name"]} ${data["Last Name"]}`.toLowerCase();
    const tags = data["Tags (Optional)"]
      ? data["Tags (Optional)"].split("|").map(t => t.trim().toLowerCase())
      : [];

    list[fullName] = tags;
  }

  return list;
}

// Load the guest list from CSV when page loads
window.addEventListener("DOMContentLoaded", () => {
  fetch("guestlist.csv")
    .then((res) => res.text())
    .then((csvText) => {
      guestList = buildGuestListFromCSV(csvText);
      console.log("Guest list loaded:", guestList);
    })
    .catch((err) => {
      console.error("Failed to load guest list:", err);
      document.getElementById("error").textContent = "Error loading guest list.";
      document.getElementById("error").classList.remove("hidden");
    });

  // 🎯 Add Enter key listener here
  const input = document.getElementById("guestName");
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submit or page reload
      checkSchedule();
    }
  });
});

function checkSchedule() {
  const name = document.getElementById("guestName").value.trim().toLowerCase();
  const events = guestList[name];

  document.getElementById("error").classList.add("hidden");
  document.getElementById("templeWedding").classList.add("hidden");
  document.getElementById("chapelWedding").classList.add("hidden");

  if (!events || events.length === 0) {
    document.getElementById("error").classList.remove("hidden");
    return;
  }

  if (events.includes("temple")) {
    document.getElementById("templeWedding").classList.remove("hidden");
  }

  if (events.includes("chapel")) {
    document.getElementById("chapelWedding").classList.remove("hidden");
  }
}

