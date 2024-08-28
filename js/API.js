export default class API {
  static getData() {
    return JSON.parse(localStorage.getItem("notes")) || [];
  }

  static getTheme() {
    return JSON.parse(localStorage.getItem("theme")) || 0;
  }

  static saveData(allData) {
    localStorage.setItem("notes", JSON.stringify(allData));
  }

  static saveTheme(theme) {
    localStorage.setItem("theme", JSON.stringify(theme));
  }
}
