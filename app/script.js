let updateStatus = 0;
let url = "";
function makeStars(count) {
  let stars = "";
  for (let i = 0; i < count; i++) {
    stars = stars + "⭐️";
  }
  return stars;
}

function makeMovieListHTML(movies) {
  const listDiv = document.querySelector("#movie-list");
  // clearing old values
  listDiv.innerHTML = "";

  for (const movie of movies) {
    /*
    <div class="item" id="12344">
      <img src="https://i.pravatar.cc/300" alt="Ironman 2008 DVD cover">
      <h4>Ironman</h4>
      <p>2008</p>
      <p>⭐️⭐️⭐️⭐️</p>
      <p>Fantasy</p>
    </div>
    */
    const div = document.createElement("div");
    div.setAttribute("id", movie.id);
    div.classList.add("item");

    const img = document.createElement("img");
    img.setAttribute("src", movie.image.url);
    img.setAttribute("alt", movie.image.altInfo);
    div.appendChild(img);

    const h4 = document.createElement("h4");
    h4.textContent = movie.name;
    div.appendChild(h4);

    const pYear = document.createElement("p");
    pYear.textContent = movie.year;
    div.appendChild(pYear);

    const pRating = document.createElement("p");
    pRating.textContent = makeStars(movie.rating);
    div.appendChild(pRating);

    const pGenre = document.createElement("p");
    pGenre.textContent = movie.genre;
    div.appendChild(pGenre);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    div.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", function () {
      console.log(movie.id);
      console.log(movie.name);
      //deleteMovieInApi(movie);
      url = "http://localhost:1337/api/movies/" + movie.id;
      console.log(url);
      deleteMovieInApi(url);
    });
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    div.appendChild(updateBtn);
    updateBtn.addEventListener("click", function () {
      console.log(movie.id);
      console.log(movie.name);
      url = "http://localhost:1337/api/movies/" + movie.id;
      console.log(url);
      updateMovieInApi(movie);
      updateMovieForm(movie);
    });

    listDiv.appendChild(div);
  }
}

function updateMovieInApi(movie) {
  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  })
    .then(function (result) {
      return result.json();
    })
    .then(function (data) {
      getMoviesFromAPI();
      console.log("API success");
      console.log(data);
      updateMovieForm(movie);
    });
}
function updateMovieForm(movie) {
  console.log("working");
  updateStatus = 1;
  showForm();
  const FormTitle = document.getElementById("FormTite");
  FormTitle.innerHTML = "Updating " + movie.name + " Movie";
  document.getElementById("add-new-movie").value = "Update";
  document.getElementById("movie-name").value = movie.name;
  document.getElementById("movie-year").value = movie.year;
  document.getElementById("movie-rating").value = movie.rating;
  document.getElementById("movie-genre").value = movie.genre;
  document.getElementById("movie-image-url").value = movie.image.url;
  document.getElementById("movie-image-alt").value = movie.image.altInfo;
}
function addLoading() {
  const listDiv = document.querySelector("#movie-list");
  listDiv.innerHTML = "⏳ Please wait ...";
}
function showForm() {
  const el1 = document.querySelector("#all-movies");
  el1.classList.add("d-none");
  const el2 = document.querySelector("#add-movies");
  el2.classList.remove("d-none");
}
function getMoviesFromAPI() {
  addLoading();
  fetch("http://localhost:1337/api/movies")
    .then(function (result) {
      return result.json();
    })
    .then(function (data) {
      makeMovieListHTML(data);
    });
}

function createMovieInAPI(movie) {
  fetch("http://localhost:1337/api/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  })
    .then(function (result) {
      return result.json();
    })
    .then(function (data) {
      getMoviesFromAPI();
      console.log("API success");
      console.log(data);
    });
}

function deleteMovieInApi(url) {
  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  })
    .then(function (result) {
      return result.json();
      console.log("API success");
    })
    .then(function (data) {
      getMoviesFromAPI();
      console.log("DEL success");
      console.log(data);
    });
}

function hookButtons() {
  // add-movies-btn
  const addBtn = document.querySelector("#add-movies-btn");
  addBtn.addEventListener("click", function () {
    const el1 = document.querySelector("#all-movies");
    el1.classList.add("d-none");
    const el2 = document.querySelector("#add-movies");
    el2.classList.remove("d-none");
  });

  // show-movies-btn
  const showMoviesBtn = document.querySelector("#show-movies-btn");
  showMoviesBtn.addEventListener("click", function () {
    const el1 = document.querySelector("#all-movies");
    el1.classList.remove("d-none");
    const el2 = document.querySelector("#add-movies");
    el2.classList.add("d-none");
  });
}

function hookAddMovieForm() {
  const form = document.querySelector("#add-movie-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);

    /*
    {
    "name": "The Green Lantern",
    "year": "2007",
    "rating": "1",
    "genre": "Super hero",
    "image": {
        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzyF4A_SMjtSjIo2_BxxWaicBQvUI9jaqwxIu1-qDS-RnSBfS2IRBQtuvN_3u2-y-RKR0&usqp=CAU",
        "altInfo": "Green lantern DVD cover"
      }
    }
    */
    const movie = {
      name: formData.get("movie-name"),
      year: formData.get("movie-year"),
      rating: formData.get("movie-rating"),
      genre: formData.get("movie-genre"),
      image: {
        url: formData.get("movie-image-url"),
        altInfo: formData.get("movie-image-alt"),
      },
    };

    if (updateStatus == 0) {
      console.log("h2");
      createMovieInAPI(movie);
      form.reset();
    } else if (updateStatus == 1) {
      console.log("Updating...........");
      updatestatus = 0;
      updateMovieInApi(movie);
      console.log(movie);
      form.reset();
    }
  });
}

// --- start
getMoviesFromAPI();
hookButtons();
hookAddMovieForm();
