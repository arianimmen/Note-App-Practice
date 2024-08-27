import API from "./API.js";
import Ui from "./Ui.js";

const root = document;
const app = new Ui(document, API.getData(), (data) => {
  API.saveData(data);
});
