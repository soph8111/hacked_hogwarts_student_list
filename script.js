"use strict";

// Opretter array til hvor alle studerende skal ned i, efter de er blevet rettet til
const allStudents = [];

// Laver en skabelon til hvad hver studerende skal indholde
const Student = {
  firstName: "",
  middelName: "",
  lastName: "",
  nickName: "",
  house: "",
  image: "",
};

//
const studentSection = document.querySelector("#student_list");

// Opretter variablerne så de er globale og kan kaldes fra flere funktioner
let firstName;
let middelName;
let lastName;
let nickName;
let house;
let image;

window.addEventListener("DOMContentLoaded", getJSON);

function getJSON() {
  console.log("getJSON");

  // Henter json med fetch
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach((elm) => {
    // Create new object with cleaned data - and store that in the allStudents array (kalder funktioner, så hvert navn kan bearbejdes der)
    const student = Object.create(Student);
    student.firstName = getFirstName(elm.fullname);
    student.middelName = getMiddelName(elm.fullname);
    student.lastName = getLastName(elm.fullname);
    student.nickName = getNickName(elm.fullname);
    student.house = elm.house;
    student.image = getImage(elm.fullname);
    allStudents.push(student);
  });

  // Retter efterfølgende bogstaverne til.
  changeLetters();
  showStudens(allStudents);
}

console.log(allStudents);

function getFirstName(fullname) {
  //console.log("getFirstName");
  // Sørger for at der ikke er nogle navne der har mellemrum inden
  firstName = fullname.trimStart();

  // If-sætning, da en af eleverne kun har ét navn
  if (fullname.includes(" ")) {
    firstName = firstName.substring(0, firstName.indexOf(" "));
  } else {
    firstName = fullname;
  }
  return firstName;
  // console.log(firstName);
}

function getMiddelName(fullname) {
  // MANGLER AT SORTERER NICKNAMES FRA

  // console.log("getMiddelName");
  // Fjerner overflødige mellemrum, så mellemrummene ikke får en plads i arrayet
  middelName = fullname.trim();
  // Deler det fulde navn op i array, så hvert navn får deres egen plads i arrayet
  middelName = middelName.split(" ");

  // Hvis arrayet har mere end to navne, så skal navn nr.2 (plads nr. 0 i arrayet) blive til mellemnavnet. Hvis ikke, så bliver mellemnavnet til "undefined"
  if (middelName.length > 2) {
    // console.log("Har et mellemnavn");
    middelName = middelName[1];
    //   } else if (fullname.indexOf(` "`) >= 0) {
    //     middelName = "undefined";
  } else {
    //  console.log("Har ikke et mellemnavn");
    middelName = undefined;
  }

  return middelName;
  //  console.log(middelName);
}

function getLastName(fullname) {
  //console.log("getLastName");
  // console.log(fullname);
  // fjerner overflødige mellemrum
  lastName = fullname.trim();
  // efternavnet skal være lig med det der kommer efter det sidste mellemrum i det fulde navn
  lastName = lastName.substring(lastName.lastIndexOf(" ") + 1);
  //  console.log(lastName);
  return lastName;
}

function getNickName(fullname) {
  //console.log("getNickName");
  nickName = fullname.split(" ");

  // Hvis et navn indeholder ", så vil værdien være større end 0 (dvs. true), og dermed skal nickname være lig med navn nr. 2
  if (fullname.indexOf(` "`) >= 0) {
    nickName = nickName[1];
  } else {
    nickName = undefined;
  }

  return nickName;
}

function getImage(fullname) {
  // billede = (efternavn)(_)(første bogstav i fornnavn)(.png) - dog er det ikke den helt rigtige sti til alle billeder
  image = `./images/${lastName.toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
  return image;
}

function changeLetters() {
  allStudents.forEach((student) => {
    student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1).toLowerCase();
    //student.middelName = student.middelName.substring(0, 1).toUpperCase() + student.middelName.substring(1).toLowerCase(); // Cannot read property 'substring' of undefined
    student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1).toLowerCase();
    //let findHypen = student.lastName.substring(student.lastName.indexOf("-") + 1);
    //console.log(findHypen.substring(0, 1).toUpperCase() + findHypen.substring(1).toLowerCase());
    student.house = student.house.trim();
    student.house = student.house.substring(0, 1).toUpperCase() + student.house.substring(1).toLowerCase();
  });
}

function showStudens(students) {
  // funktion "showStudents" med data fra databasen som array
  console.log("showStudens"); // Tjekker om funktionen bliver vist
  const allStudentTemplate = document.querySelector(".student"); // Opretter en variable til templaten

  students.forEach((student) => {
    // Looper igennem arrayet
    const klon = allStudentTemplate.cloneNode(true).content; // Gør det muligt at klone ned i template

    klon.querySelector(".student_article .student_photo").src = `${student.image}`; // billede hentes
    klon.querySelector(".student_article .student_name").textContent = `${student.firstName} ${student.lastName}`; // navn hentes MANGLER MELLEMNAVN
    klon.querySelector(".student_article .house").textContent = `${student.house}`; // hus hentes

    studentSection.appendChild(klon); // Kloner ned i sektionen
  });
}
