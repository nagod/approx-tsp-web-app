// TODMake Singleton
import { Examples } from "../Resources/Examples/Examples";

export default class FileService {
  static readFileAsText(file) {
    const reader = new FileReader();
    return reader.readAsText(file);
  }

  static getAllExamples() {
    return Examples;
  }

  static getExampleByKey(key) {
    return Examples[key].data;
  }
}
