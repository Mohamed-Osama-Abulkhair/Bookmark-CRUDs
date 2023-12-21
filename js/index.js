let inputs = document.getElementsByTagName("input");
let nameInput = document.getElementById("nameInput");
let URLInput = document.getElementById("URLInput");
let addBtn = document.getElementsByClassName("addBtn")[0];

let nameError = document.getElementsByClassName("error-message")[0];
let rejexName = /^[a-zA-Z]{3,7}(?:\s[a-zA-Z]{3,7})*$/;
let URLError = document.getElementsByClassName("error-message")[1];
let rejexURL = /^(https?|ftp):\/\/[^\s\/$.?#][^\s]*$/;

let displayError = (regex, input, errorMessage) => {
  if (regex.test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    errorMessage.classList.add("d-none");
    addValidation();
  } else {
    input.classList.add("is-invalid");
    errorMessage.classList.remove("d-none");
    addValidation();
  }
};

let addValidation = () => {
  for (var i = 0; i < inputs.length - 1; i++) {
    if (inputs[i].value == "") {
      addBtn.disabled = "true";
    } else {
      if (rejexName.test(nameInput.value) && rejexURL.test(URLInput.value)) {
        addBtn.removeAttribute("disabled");
      } else {
        addBtn.disabled = "true";
      }
    }
  }
};


nameInput.onkeyup = () => {
  displayError(rejexName, nameInput, nameError);
};
URLInput.onkeyup = () => {
  displayError(rejexURL, URLInput, URLError);
};

// ________________________________________________________________

let searchInput = document.getElementById("searchInput");
let deleteAllBtn = document.getElementById("deleteAllBtn");
let bookmarkCards = document.getElementById("bookmarkCards");
let bookmarkCardsArray = [];
let currentIndex = 0;

if (JSON.parse(localStorage.getItem("bookmarks")) != null) {
  bookmarkCardsArray = JSON.parse(localStorage.getItem("bookmarks"));
  displayBookmark();
  deleteAllBtn.removeAttribute("disabled");
} else {
  deleteAllBtn.disabled = "true";
}

let checkOperation = () => {
  if (addBtn.innerHTML == "Submit") {
    addBookmark();
  } else {
    updateBookmark();
  }
  displayBookmark();
  clearInputs();
  addValidation();
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("is-valid");
  }
  deleteAllBtn.removeAttribute("disabled");
};

addBtn.addEventListener("click", checkOperation);

let addBookmark = () => {
  let bookmark = {
    name: nameInput.value,
    url: URLInput.value,
  };
  bookmarkCardsArray.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarkCardsArray));
};

function displayBookmark() {
  let container = "";
  for (let i = 0; i < bookmarkCardsArray.length; i++) {
    container += `  <div class="col-md-4">
          <div class="bookmark p-3 position-relative">
            <div class="circleBg">
              <h5 class="index">${i + 1}</h5>
            </div>
              <h4 class=" mb-3">${bookmarkCardsArray[i].name}</h4>
            <a href="${bookmarkCardsArray[i].url}" target="_blank" id="link">
              <button class="btn py-2 px-4" id="visitBtn" title="visit">
                <i class="fa-solid fa-eye"></i></button
            ></a>
            <button
              class="btn btn-warning m-2 py-2 px-4"
              title="update"
              onclick="getBookmarkInfo(${i})"
            >
              <i class="fa-solid fa-square-pen"></i>
            </button>
            <button
              class="btn btn-danger m-2 py-2 px-4"
              title="delete"
              onclick="deleteBookmark(${i})"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
      </div>
  `;
  }
  bookmarkCards.innerHTML = container;
}

function clearInputs() {
  for (let i = 0; i < inputs.length - 1; i++) {
    inputs[i].value = "";
  }
}

function getBookmarkInfo(index) {
  currentIndex = index;
  let bookmarkInfo = bookmarkCardsArray[currentIndex];
  nameInput.value = bookmarkInfo.name;
  URLInput.value = bookmarkInfo.url;

  addBtn.innerHTML = "Update";
  addBtn.className = "btn btn-warning";
}

function updateBookmark() {
  let bookmark = {
    name: nameInput.value,
    url: URLInput.value,
  };
  bookmarkCardsArray[currentIndex] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarkCardsArray));
  addBtn.innerHTML = "Submit";
  addBtn.className = "btn addBtn";
}

function deleteBookmark(index) {
  bookmarkCardsArray.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarkCardsArray));
  displayBookmark();
  if (bookmarkCardsArray == 0) {
    localStorage.removeItem("bookmarks");
    deleteAllBtn.disabled = true;
  }
}

searchInput.onkeyup = () => {
  let container = "";
  for (let i = 0; i < bookmarkCardsArray.length; i++) {
    if (
      bookmarkCardsArray[i].name
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      container += `  <div class="col-md-4">
          <div class="bookmark p-3 position-relative">
            <div class="circleBg">
              <h5 class="index">${i + 1}</h5>
            </div>
              <h4 class=" mb-3">${bookmarkCardsArray[i].name}</h4>
            <a href="${bookmarkCardsArray[i].url}" target="_blank" id="link">
              <button class="btn py-2 px-4" id="visitBtn" title="visit">
                <i class="fa-solid fa-eye"></i></button
            ></a>
            <button
              class="btn btn-warning m-2 py-2 px-4"
              title="update"
              onclick="getBookmarkInfo(${i})"
            >
              <i class="fa-solid fa-square-pen"></i>
            </button>
            <button
              class="btn btn-danger m-2 py-2 px-4"
              title="delete"
              onclick="deleteBookmark(${i})"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
      </div>
  `;
    }
    bookmarkCards.innerHTML = container;
  }
};

deleteAllBtn.onclick = () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-danger ",
      cancelButton: "btn btn-success",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your Bookmarks have been deleted.",
          icon: "success",
        });
        localStorage.removeItem(
          "bookmarks",
          JSON.stringify(bookmarkCardsArray)
        );
          bookmarkCardsArray=[]
        deleteAllBtn.disabled = "true";
        bookmarkCards.innerHTML = "";
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your Bookmarks are safe :)",
          icon: "error",
        });
      }
    });
};
