"use strict";

class AnnotationHelper {
  getValidations() {
    let regex = /(@.*?)(\))|(private|public|protected)(?!.*function)[\s\w].*/g;
    let regex2 = /(@.*?)[\s\w].*|(private|public|protected)(?!.*function)[\s\w].*/g;
  }

}