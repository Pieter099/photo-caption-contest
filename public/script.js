const API = "http://localhost:3000";

let token = null;
let currentImageId = null;

// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    token = data.token;
    document.getElementById("login-status").innerText = "✅ Logged in!";
    loadImages();
  } else {
    document.getElementById("login-status").innerText = "❌ Login failed";
  }
}

// LOAD ALL IMAGES
async function loadImages() {
  const res = await fetch(`${API}/images`);
  const images = await res.json();

  const container = document.getElementById("images-container");
  container.innerHTML = "";

  images.forEach(img => {
    const div = document.createElement("div");
    div.className = "image-card";

    div.innerHTML = `
      <img src="${img.url}" />
      <p>${img.title}</p>
    `;

    div.onclick = () => loadImageDetails(img.id);

    container.appendChild(div);
  });
}

// LOAD SINGLE IMAGE
async function loadImageDetails(id) {
  currentImageId = id;

  const res = await fetch(`${API}/images/${id}`);
  const data = await res.json();

  document.getElementById("image-detail").style.display = "block";

  document.getElementById("detail-img").src = data.url;
  document.getElementById("detail-title").innerText = data.title;

  const captionsList = document.getElementById("captions-list");
  captionsList.innerHTML = "";

  data.Captions.forEach(c => {
    const li = document.createElement("li");
    li.innerText = `${c.text} (by ${c.User.username})`;
    captionsList.appendChild(li);
  });
}

// ADD CAPTION
async function addCaption() {
  const text = document.getElementById("caption-input").value;

  const res = await fetch(`${API}/images/${currentImageId}/captions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });

  if (res.ok) {
    document.getElementById("caption-input").value = "";
    loadImageDetails(currentImageId);
  } else {
    alert("Failed to add caption");
  }
}