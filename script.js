document.addEventListener("DOMContentLoaded", function () {

  let imageInput = document.getElementById("image");

  if (imageInput) {
    imageInput.addEventListener("change", function (event) {
      let file = event.target.files[0];

      if (file) {
        let reader = new FileReader();

        reader.onload = function (e) {
          let preview = document.getElementById("preview");
          if (preview) {
            preview.src = e.target.result;
            preview.style.display = "block";
          }
        };

        reader.readAsDataURL(file);
      }
    });
  }

});

let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentUser = localStorage.getItem("currentUser");

function addPost() {
  let title = document.getElementById("title").value;
  let content = document.getElementById("content").value;

  if (!currentUser) {
    alert("Please login first");
    return;
  }

  let preview = document.getElementById("preview");
  let image = preview && preview.src ? preview.src : "";

  posts.push({
    id: Date.now(),
    title,
    content,
    image,
    author: currentUser
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  window.location.href = "index.html";
}

function displayPosts() {
  let container = document.getElementById("posts");
  if (!container) return;

  container.innerHTML = "";

  posts.forEach(post => {
    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${post.title}</h3>
      ${post.image ? `<img src="${post.image}" style="max-width:200px;"><br>` : ""}
      <p>${post.content}</p>
      <small>By: ${post.author}</small><br>
      ${
        (currentUser === post.author || currentUser === "admin")
        ? `<div>
            <button onclick="editPost(${post.id})">✏️ Edit</button>
            <button onclick="deletePost(${post.id})">🗑 Delete</button>
          </div>`
        : ""
      }
    `;

    container.appendChild(div);
  });
}

function deletePost(id) {
  let confirmDelete = confirm("Are you sure to delete this post?");
  
  if (confirmDelete) {
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
  }
}

function editPost(id) {
  localStorage.setItem("editId", id);
  window.location.href = "edit.html";
}

function loadEditData() {
  let id = localStorage.getItem("editId");
  if (!id) return;

  let post = posts.find(p => p.id == id);

  if (post) {
    document.getElementById("title").value = post.title;
    document.getElementById("content").value = post.content;

    let preview = document.getElementById("preview");
    if (preview && post.image) {
      preview.src = post.image;
      preview.style.display = "block";
    }
  }
}

function updatePost() {
  let id = localStorage.getItem("editId");
  let title = document.getElementById("title").value;
  let content = document.getElementById("content").value;

  posts = posts.map(post => {
    if (post.id == id) {
      let preview = document.getElementById("preview");
      let image = preview && preview.src ? preview.src : post.image;

      return { ...post, title, content, image };
    }
    return post;
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  window.location.href = "index.html";
}

let searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    let value = this.value.toLowerCase();

    let filtered = posts.filter(post =>
      post.title.toLowerCase().includes(value)
    );

    let container = document.getElementById("posts");
    container.innerHTML = "";

    filtered.forEach(post => {
      let div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${post.title}</h3>
        ${post.image ? `<img src="${post.image}" style="max-width:200px;"><br>` : ""}
        <p>${post.content}</p>
        <small>By: ${post.author}</small>
      `;

      container.appendChild(div);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  displayPosts();
  loadEditData();
});