const switchCases = (num, word) => {
  let result = "";
  const thisCase = num % 10;
  if (word === "файл") {
    if (num >= 11 && num <= 15) return "файлов"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      // case 2:
      // case 3:
      // case 4:
      // result = "файла";
      // break;
      default:
        result = "файла";
    }
  }
  if (word === "раз") {
    if (num >= 11 && num <= 15) return "раз"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      case 2:
      case 3:
      case 4:
        result = "раза";
        break;
      default:
        result = "раз";
    }
  }
  if (word === "несоответствие") {
    if (num >= 11 && num <= 15) return "несоответствий"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      case 2:
      case 3:
      case 4:
        result = "несоответствия";
        break;
      default:
        result = "несоответствий";
    }
  }
  if (word === "продажа") {
    if (num >= 11 && num <= 15) return "продаж"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      case 2:
      case 3:
      case 4:
        result = "продажи";
        break;
      default:
        result = "продаж";
    }
  }
  if (word === "возврат") {
    if (num >= 11 && num <= 15) return "возвратов"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      case 2:
      case 3:
      case 4:
        result = "возврата";
        break;
      default:
        result = "возвратов";
    }
  }
  if (word === "документ") {
    if (num >= 11 && num <= 15) return "документов"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      case 2:
      case 3:
      case 4:
        result = "документа";
        break;
      default:
        result = "документов";
    }
  }
  if (word === "чек") {
    if (num >= 11 && num <= 15) return "чеков"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      case 2:
      case 3:
      case 4:
        result = "чека";
        break;
      default:
        result = "чеков";
    }
  }
  if (word === "день") {
    if (num >= 11 && num <= 15) return "дней"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      case 2:
      case 3:
      case 4:
        result = "дня";
        break;
      default:
        result = "дней";
    }
  }
  if (word === "заявка") {
    if (num >= 11 && num <= 15) return "заявок"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      case 2:
      case 3:
      case 4:
        result = "заявки";
        break;
      default:
        result = "заявок";
    }
  }
  if (word === "заказ") {
    if (num >= 11 && num <= 15) return "заказов"
    switch (thisCase) {
      case 1:
        result = word;
        break;
      case 2:
      case 3:
      case 4:
        result = "заказа";
        break;
      default:
        result = "заказов";
    }
  }
  return result;
}

module.exports = switchCases