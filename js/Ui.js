export default class Ui {
  constructor(root, data, saveData) {
    this.saveDataToStorage = saveData;
    this.notes = data; // Getting the data and storing it in notes
    this.root = root; // Setting the root
    this.addToDom(this.notes); // Adding notes to the DOM
    this.searchNote(); // Calling the searchNote Method (activating the search bar)
    this.toggleAcitive(); // Activating the toggle button

    //*--------------------------------  Setting the default values --------------------------------------------*

    // ID 0 means it is a unique and new id and doesn't exist, in the programm when we want to edit a note,
    // we add its value in here, so localy in different method we can use the id
    this.id = 0;

    this.descriptionValue = ""; // This value will use in creating new note title and description
    this.titleValue = ""; // This value will use in creating new note title and description

    // --------------------------------------------------------------------------------------------------------

    const addBtn = this.root.querySelector(".adding-notes-btn"); // Selecting the add button (purple button)
    addBtn.addEventListener("click", this.addToNotes.bind(this));

    const addBtnModal = this.root.querySelector(".notes-modal__buttons__add"); // Getting the add buttun in the modal
    addBtnModal.addEventListener("click", this.createNewNote.bind(this));

    const closeBtnModal = this.root.querySelector(
      ".notes-modal__buttons__cancel"
    );
    closeBtnModal.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeTheAddModal();
    });
  }

  addToDom(data) {
    let result = "";

    // Adding data(notes) in to the DOM
    data.forEach((note) => {
      const note_html = this._createNoteHTML(note); //Creating each note html with _createNoteHtml method
      result += note_html;
    });
    this.root.querySelector(".notes-container").innerHTML = result; // Updating the DOM

    const trashIcons = [...this.root.querySelectorAll(".note__header__trash")]; // Selecting the trash Icons
    trashIcons.forEach((item) => {
      item.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id); // Getting the trash icon id
        this.deleteNote(id); // Calling the delete function when the user click on the trash icon
      });
    });

    const editBtns = [...this.root.querySelectorAll(".note__header__edit")];
    editBtns.forEach((item) => {
      item.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id); // Getting the trash icon id
        this.id = id; // Setting the local ID to be our selected note ID
        this.addToNotes(); //Updating the DOM
      });
    });
  }

  _createNoteHTML(note) {
    // Creating the html note for each note
    return `
      <div class="note__self">
        <div class="note__header">
          <div class="note__header__date">
            <div class="note__date__icon"></div>
            <p>${new Date(note.updated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
          </div>
          <div class="note__header__icons">
            <img
              src="./assets/images/8666681_edit_icon.svg"
              alt="edit icon"
              class="note__header__edit icon"
              data-id = "${note.id}" 
            />
            <img
              src="./assets/images/icons8-trash.svg"
              alt=""
              class="note__header__trash icon"
              data-id = "${note.id}"
             />
          </div>
        </div>

        <div class="note__text">
          <h2>${note.title}</h2>
          <p>
          ${note.description}
          </p>
        </div>

        <div class="note__update">
          <p>${this.lastUpdate(note.updated)}</p>
        </div>
      </div>
    `;
  }

  addToNotes() {
    this.openTheAddModal(); // Opening the Modal

    const titleInput = this.root.querySelector(".notes-modal-title"); //Selecting the title input
    titleInput.addEventListener("input", (e) => {
      this.titleValue = e.target.value; // Updating the title variable
    });

    //Selecting the description input
    const descriptionInput = this.root.querySelector(
      ".notes-modal-description"
    );
    descriptionInput.addEventListener("input", (e) => {
      this.descriptionValue = e.target.value; // Updating the description variable
    });

    this.root.querySelector(".search-bar").value = ""; // Making the search bar value to be empty
    this.addToDom(this.notes); // Updating the DOM
  }

  createNewNote(e) {
    let existed = 0; // Defaul value of exited note is 0 meaning note doens't exist
    e.preventDefault(); // Prevent the refresh by js

    // Checking if the note exist
    this.notes.forEach((note) => {
      if (note.id == this.id) {
        note.title = this.titleValue.trim();
        note.description = this.descriptionValue.trim();
        note.updated = new Date().toISOString();

        this.id = 0; // Removing the id from our local id
        existed = 1; // Setting the exsited value to one so we know the note already exist

        this.saveNotes(); // Saving the Note
        this.closeTheAddModal(); // Closing the Modal
      }
    });

    if (!existed) {
      // Making a new Note Object
      const newNote = {
        id: new Date().getTime(),
        title: this.titleValue.trim(),
        description: this.descriptionValue.trim(),
        updated: new Date().toISOString(),
      };

      this.notes.push(newNote); // Adding the note to the array

      this.saveNotes(); // Saving the Note

      this.closeTheAddModal(); // Closing the Modal
    }
  }

  openTheAddModal() {
    const modal = this.root.querySelector(".adding-notes-modal");
    modal.style.display = "block"; //Adding a block view to pop up the modal

    // Checking if the user click outside of our modal so we can close it
    this.root.addEventListener("click", (e) => {
      if (e.target.classList.contains("adding-notes-modal")) {
        this.closeTheAddModal(); // Closing the Modal
      }
    });

    // Checking if the id exist
    if (this.id != 0) {
      this.notes.forEach((note) => {
        if (note.id == this.id) {
          // Updating the input in modal based on the existed note
          this.root.querySelector(".notes-modal-title").value = note.title;
          this.root.querySelector(".notes-modal-description").value =
            note.description;

          // Updating the local title and description Value
          this.titleValue = note.title;
          this.descriptionValue = note.description;
        }
      });
    }
  }

  closeTheAddModal() {
    this.titleValue = ""; // Setting the defalut titleValue to nothing
    this.descriptionValue = ""; // Setting the defalut Description Value to nothing
    this.id = 0; // Reseting the ID

    this.root.querySelector(".notes-modal-title").value = ""; // Deleting the previous the input
    this.root.querySelector(".notes-modal-description").value = ""; // Deleting the previous the input

    this.root.querySelector(".adding-notes-modal").style.display = "none"; //Adding a block view to pop up the modal
  }

  deleteNote(id) {
    const allNotes = this.notes;

    this.notes = allNotes.filter((note) => note.id !== id); // Filtering the notes
    this.saveNotes(); // Saving the notes
    this.addToDom(this.notes); // Updating the DOM
  }

  searchNote() {
    const searchBar = this.root.querySelector(".search-bar"); // Getting the search bar element

    searchBar.addEventListener("input", (e) => {
      const target = e.target.value.trim().toLowerCase(); // Getting the value from the search bar

      const filteredNotes = this.notes.filter((note) => {
        return note.title.trim().toLowerCase().includes(target); // Checking if the text exist in our title
      });

      this.addToDom(filteredNotes); // Updating the DOMN
    });
  }

  lastUpdate(inputDate) {
    const date = new Date(inputDate); // Getting the note time
    const now = new Date(); // Getting the current time

    // Checking what was the last edit time ex: 2sec ago, 1 hour ago and .........
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (weeks < 4) {
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    } else if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else {
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    }
  }

  toggleAcitive() {
    const toggle = this.root.querySelector(".toggle"); // Getting the toggle button
    const toggle_circle = this.root.querySelector(".toggle__circle");

    // Css root variables for light theme
    const originalVariables = {
      "--color-background": "#fff",
      "--color-fonts": " #000000",
      "--color-notes-background": "#f3f5f8",
      "--color-modalBack": "#f3f5f8",
    };

    // Css root variables for dark themn
    const newVariables = {
      "--color-background": "#161615",
      "--color-fonts": "#fff",
      "--color-notes-background": "#1F1F1F",
      "--color-modalBack": "#272727",
    };

    this.toggle = 0; // Setting a toggle for checking the light/dark mode

    toggle.addEventListener("click", () => {
      if (this.toggle === 0) {
        this.toggle = 1; // Changing the toggle

        changeColorToDark(newVariables, toggle_circle); // Changing to dark mode
      } else {
        this.toggle = 0; // Changing the toggle
        changeColorToLight(originalVariables); // Changing to Light mode
      }
    });

    function changeColorToDark(css) {
      // Changing the root colors
      for (const [key, value] of Object.entries(css)) {
        document.documentElement.style.setProperty(`${key}`, `${value}`);
      }

      // Changing the icons color
      const sheet = document.styleSheets[0];
      sheet.insertRule(
        ".icon { filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(190deg) brightness(104%) contrast(102%); }",
        sheet.cssRules.length
      );

      toggle_circle.style.marginLeft = "20px"; // Makes the animation of the toggle possible
    }

    function changeColorToLight(css, root) {
      // Changing the root colors
      for (const [key, value] of Object.entries(css)) {
        document.documentElement.style.setProperty(`${key}`, `${value}`);
      }

      // Changing the icons color
      const sheet = document.styleSheets[0];
      sheet.insertRule(
        ".icon { filter: invert(0%) sepia(100%) saturate(0%) hue-rotate(268deg) brightness(112%) contrast(107%); }",
        sheet.cssRules.length
      );

      toggle_circle.style.marginLeft = "0px"; // Makes the animation of the toggle possible
    }
  }

  saveNotes() {
    // Sorting the Data

    this.notes.sort((a, b) =>
      new Date(a.updated) < new Date(b.updated) ? 1 : -1
    );

    // Saving the Data
    this.saveDataToStorage(this.notes);

    this.addToDom(this.notes); // Adding the note to the dom
  }
}
