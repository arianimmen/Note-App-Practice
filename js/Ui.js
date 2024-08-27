export default class Ui {
  constructor(root, data, saveData) {
    this.saveDataToStorage = saveData;
    this.notes = data; // Getting the data and storing it in notes
    this.root = root; // Setting the rout
    this.addToDom(this.notes); // Adding notes to the DOMs

    const addBtn = this.root.querySelector(".adding-notes-btn"); // Selecting the add button (purple button)
    addBtn.addEventListener("click", this.addToNotes.bind(this));
  }

  addToDom(data) {
    let result = "";
    // Adding data(notes) in to the DOM
    data.forEach((note) => {
      const note_html = this._createNoteHTML(note); //Creating each note html with _createNoteHtml method
      result += note_html;
    });
    this.root.querySelector(".notes-container").innerHTML = result; // Updating the DOM
  }

  _createNoteHTML(note) {
    // Creating the html note for each note
    return `
      <div class="note__self">
        <div class="note__header">
          <div class="note__header__date">
            <div class="note__date__icon">X</div>
            <p>${note.updated}</p>
          </div>
          <img
            src="./assets/images/8666681_edit_icon.svg"
            alt="edit icon"
            class="note__header__edit"
          />
        </div>

        <div class="note__text">
          <h2>${note.title}</h2>
          <p>
          ${note.description}
          </p>
        </div>

        <div class="note__update">
          <p>1h ago</p>
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

    const descriptionInput = this.root.querySelector(
      ".notes-modal-description"
    ); //Selecting the description input
    descriptionInput.addEventListener("input", (e) => {
      this.descriptionValue = e.target.value; // Updating the description variable
    });

    const addBtn = this.root.querySelector(".notes-modal__buttons__add"); // Getting the add buttun in the modal
    addBtn.addEventListener("click", this.createNewNote.bind(this));
  }

  createNewNote(e) {
    e.preventDefault();

    const newNote = {
      // Making a new Note Object
      id: new Date().getTime(),
      title: this.titleValue,
      description: this.descriptionValue,
      updated: new Date().toISOString(),
    };

    this.notes.push(newNote); // Adding the note to the array
    this.saveNotes(); // Saving the Note
    this.addToDom(this.notes); // Adding the note to the dom

    this.closeTheAddModal();
  }

  openTheAddModal() {
    this.root.querySelector(".adding-notes-modal").style.display = "block"; //Adding a block view to pop up the modal
  }

  closeTheAddModal() {
    this.titleValue = ""; // Setting the defalut titleValue to nothing
    this.descriptionValue = ""; // Setting the defalut Description Value to nothing

    this.root.querySelector(".notes-modal-title").value = ""; // Deleting the previous the input
    this.root.querySelector(".notes-modal-description").value = ""; // Deleting the previous the input

    this.root.querySelector(".adding-notes-modal").style.display = "none"; //Adding a block view to pop up the modal
  }

  saveNotes() {
    // Sorting the Data
    this.notes.sort((a, b) =>
      new Date(a.updated) < new Date(b.updated) ? 1 : -1
    );

    // Saving the Data
    this.saveDataToStorage(this.notes);
  }
}
