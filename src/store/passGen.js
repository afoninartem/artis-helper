export default () => {
  let password = "";
  const symbols = [];

  //UpperCase
  for (let i = 65; i < 91; i += 1) {
    symbols.push(String.fromCharCode(i));
  }

  //LowerCase
  for (let i = 97; i < 123; i += 1) {
    symbols.push(String.fromCharCode(i));
  }

  //digits
  for (let i = 1; i < 10; i += 1) {
    symbols.push(i.toString());
  }

  const tempArr = Array.from(symbols);

  do {
    for (let i = 0; i < 7; i += 1) {
      const randomIndex = Math.floor(Math.random() * tempArr.length);
      password += tempArr.splice(randomIndex, 1);
    }
  } while (!password.match(/\d/g));

  if (password.length > 6) password = password.slice(password.length - 6);

  return password;
};
