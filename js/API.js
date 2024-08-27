export default class API {
  static getData() {
    return JSON.parse(localStorage.getItem("notes")) || [];
  }

  static saveData(allData) {
    localStorage.setItem("notes", JSON.stringify(allData));
  }
}
