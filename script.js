"use strict";

// Opretter array til hvor alle studerende skal ned i, efter de er blevet rettet til
const allStudents = [];
let filteredStudents = allStudents;
let theSystemIsHacked = false;

// Laver en skabelon til hvad hver studerende skal indholde
const Student = {
  firstName: "",
  middelName: "",
  lastName: "",
  nickName: "",
  house: "",
  image: "",
  gender: "",
  blood: "",
  squad: false,
  prefects: false,
  expelled: false,
};

//
const studentSection = document.querySelector("#student_list");
const popupSection = document.querySelector("#popup");

// Opretter variablerne så de er globale og kan kaldes fra flere funktioner
let firstName;
let middelName;
let lastName;
let nickName;
let house;
let image;

// Knapper
const filterButtons = document.querySelectorAll(`[data-action="filter"]`);

// sorter og filtrering
const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

/* // Animation på overskrift
let typewriter = document.querySelector(".heading").textContent; // Henter tekst der skal udskrives
let numberOfLetters; // Variabel der skal tælles på */

window.addEventListener("DOMContentLoaded", start);

function start() {
  getJSON();
  hackedButton();
  registerFilterButtons();

  //animationHeading();
}

/* function animationHeading() {
  numberOfLetters = typewriter.length; // Loopet skal køre det antal gange, som teksten indholder karakterer.
  typewriter = typewriter.split("");
  console.log(typewriter);
  for (let i = 0; i < numberOfLetters; i++) {
    setTimeout(addClasse(typewriter[i]), 2000);
  }
}

function addClasse(letter) {
  console.log(letter);
  letter.className + "headingg";
} */

function getJSON() {
  console.log("getJSON");

  /*   // Henter json med fetch
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    }); */

  Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((resp) => resp.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((resp) => resp.json())]).then((jsonData) => {
    // when loaded, prepare objects
    prepareObjects(jsonData[0], jsonData[1]);
  });
}

function prepareObjects(studentArray, bloodArray) {
  studentArray.forEach((elm) => {
    // Create new object with cleaned data - and store that in the allStudents array (kalder funktioner, så hvert navn kan bearbejdes der)
    const student = Object.create(Student);
    student.firstName = getFirstName(elm.fullname);
    student.middelName = getMiddelName(elm.fullname);
    student.lastName = getLastName(elm.fullname);
    student.nickName = getNickName(elm.fullname);
    student.house = elm.house;
    student.image = getImage(elm.fullname);
    student.gender = elm.gender;
    student.blood = getBloodStatus(student, bloodArray);
    allStudents.push(student);
  });

  console.log(bloodArray);
  // Retter efterfølgende bogstaverne til.
  changeLetters();
  buildList();
  document.querySelector("#search").addEventListener("input", searchStudent);
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
    middelName = "";
  }

  if (middelName === `"Ernie"`) {
    middelName = "";
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
  if (lastName === firstName) {
    lastName = "";
  }
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
    nickName = "";
  }

  return nickName;
}

function getImage(fullname) {
  // billede = (efternavn)(_)(første bogstav i fornnavn)(.png) - dog er det ikke den helt rigtige sti til alle billeder
  if (lastName === `Patil`) {
    image = `./images/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
  } else if (firstName === `Leanne`) {
    image = `images/hogwarts.png`;
  } else if (firstName === `Justin`) {
    lastName = lastName.split("-");
    image = `./images/${lastName[1].toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
  } else {
    image = `./images/${lastName.toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
  }
  return image;
}

function getBloodStatus(student, blood) {
  //console.log("getBloodStatus");
  student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1).toLowerCase();

  if (blood.half.includes(student.lastName)) {
    student.blood = "Half-blood";
  } else if (blood.pure.includes(student.lastName)) {
    student.blood = "Pure-blood";
  } else {
    student.blood = "Muggle-blood";
  }
  return student.blood;
}

function changeLetters() {
  allStudents.forEach((student) => {
    student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1).toLowerCase();
    student.middelName = student.middelName.substring(0, 1).toUpperCase() + student.middelName.substring(1).toLowerCase(); // Cannot read property 'substring' of undefined
    student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1).toLowerCase();
    if (student.lastName.includes("-")) {
      let findHypen = student.lastName.split("-");
      console.log(findHypen[1]);
      findHypen[1] = findHypen[1].substring(0, 1).toUpperCase() + findHypen[1].substring(1).toLowerCase();
      student.lastName = findHypen.join("-");
    }
    student.house = student.house.trim();
    student.house = student.house.substring(0, 1).toUpperCase() + student.house.substring(1).toLowerCase();
    student.gender = student.gender.substring(0, 1).toUpperCase() + student.gender.substring(1).toLowerCase();
  });
}

function showStudents(students) {
  // funktion "showStudents" med data fra databasen som array
  const allStudentTemplate = document.querySelector(".student"); // Opretter en variable til templaten

  students.forEach((student) => {
    // Looper igennem arrayet
    const klon = allStudentTemplate.cloneNode(true).content; // Gør det muligt at klone ned i template

    klon.querySelector(".studentcard .student_photo").src = `${student.image}`; // billede hentes
    klon.querySelector(".studentcard .student_name").textContent = `${student.firstName} ${student.lastName}`; // navn hentes MANGLER MELLEMNAVN
    klon.querySelector(".studentcard .house").textContent = `${student.house}`; // hus hentes
    klon.querySelector(".read_more").addEventListener("click", () => readMore(student));

    // Expelled
    klon.querySelector("[data-field=expelled]").addEventListener("click", clickExpelled);
    if (student.expelled) {
      klon.querySelector("[data-field=expelled]").classList.add("expelled_true");
      klon.querySelector(".studentcard").style.background = "#313131";
      klon.querySelector(".student_photo").style.filter = "grayscale(1)";
    }

    function clickExpelled() {
      console.log("clickExpelled");
      if (student.firstName === "Sophie") {
        student.expelled === false;
        canNotExpell();
      } else if (student.expelled === true) {
        student.expelled = false;
        console.log("den studerende bliver IKKE expelled");
      } else if (student.expelled === false) {
        student.expelled = true;
        console.log("den studerende bliver expelled");
      }
      buildList();
    }

    // Squad
    if (student.squad === true) {
      klon.querySelector(".squad img").classList.remove("false");
    } else if (student.squad === false) {
      klon.querySelector(".squad img").classList.add("false");
    }

    klon.querySelector("[data-field=squad]").addEventListener("click", clickSquad);

    function clickSquad() {
      if (theSystemIsHacked) {
        student.squad = true;
        limitedSquad(student);
      } else if (student.house === "Slytherin" || student.blood === "Pure-blood") {
        if (student.squad) {
          student.squad = false;
        } else {
          student.squad = true;
        }
      } else {
        canNotBeSquad(student);
      }
      buildList();
    }

    function canNotBeSquad(student) {
      console.log("test");
      document.querySelector("#noSquad").classList.remove("hide");
      document.querySelector("#noSquad .close").addEventListener("click", closeDialog);
    }

    function closeDialog() {
      document.querySelector("#noSquad").classList.add("hide");
      document.querySelector("#noSquad .close").removeEventListener("click", closeDialog);
    }

    // Prefectss
    if (student.prefects === true) {
      klon.querySelector(".prefects img").classList.remove("false");
    } else if (student.prefects === false) {
      klon.querySelector(".prefects img").classList.add("false");
    }

    klon.querySelector("[data-field=prefects]").addEventListener("click", clickPrefects);

    function clickPrefects() {
      if (student.prefects) {
        student.prefects = false;
      } else {
        tryToMakeAPrefects(student);
      }
      buildList();
    }

    studentSection.appendChild(klon); // Kloner ned i sektionen
  });
}

function tryToMakeAPrefects(selectedStudent) {
  const prefects = filteredStudents.filter((student) => student.prefects);

  const other = prefects.filter((student) => student.house === selectedStudent.house);
  const gender = other.filter((student) => student.gender === selectedStudent.gender);
  const numberOfPrefects = gender.length;

  console.log(prefects);
  console.log(numberOfPrefects);
  console.log(other);
  console.log(gender);
  console.log(selectedStudent.gender);

  // if there is another of the same type
  if (numberOfPrefects >= 1) {
    console.log("there can only be one from each gender as a prefects");
    removeOther(gender[0]);
  } /* else if (numberOfPrefects >= 2) {
    console.log("there can only be two prefects");
    removeAorB(other[0], other[1]);
  }  */ else {
    makePrefects(selectedStudent);
  }

  function removeOther(prefectsOther) {
    // ask the user to ignore or remove the other
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other p").innerHTML = `There can only be one of each gender as a prefects from each house! <br> <br>
    Do you wish to remove ${prefectsOther.firstName}?`;
    document.querySelector("#remove_other .close").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeOther").addEventListener("click", removeOther);

    // show name on button
    document.querySelector("#remove_other [data-field=prefectsOther]").textContent = prefectsOther.firstName;

    // if the user ignore, do nothing
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document.querySelector("#remove_other .close").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other #removeOther").removeEventListener("click", removeOther);
    }

    // if remove A
    function removeOther() {
      removePrefects(prefectsOther);
      makePrefects(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  /*   function removeAorB(prefectsA, prefectsB) {
    // ask the user to ignore or remove A or B
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .close").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", removeA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", removeB);

    // show names on buttons
    document.querySelector("#remove_aorb [data-field=prefectsA]").textContent = prefectsA.firstName;
    document.querySelector("#remove_aorb [data-field=prefectsB]").textContent = prefectsB.firstName;

    // if the user ignore, do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document.querySelector("#remove_aorb .close").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #removea").removeEventListener("click", removeA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", removeB);
    }

    // if remove A
    function removeA() {
      removePrefects(prefectsA);
      makePrefects(selectedStudent);
      buildList();
      closeDialog();
    }

    // else remove B
    function removeB() {
      removePrefects(prefectsB);
      makePrefects(selectedStudent);
      buildList();
      closeDialog();
    }
  } */

  function removePrefects(winnerPrefects) {
    winnerPrefects.prefects = false;
  }

  function makePrefects(student) {
    student.prefects = true;
  }
}

function readMore(student) {
  console.log(student);
  const readMoreTemplate = document.querySelector(".about"); // Opretter en variable til templaten
  document.querySelector("#popup").innerHTML = "";

  document.querySelector("#popup").classList.add("active");

  const klon = readMoreTemplate.cloneNode(true).content; // Gør det muligt at klone ned i template

  klon.querySelector(".about_student .student_photo").src = `${student.image}`;

  klon.querySelector(".about_student .fullname").textContent = `${student.firstName} ${student.middelName} ${student.lastName}`;
  if (student.nickName === "") {
    klon.querySelector(".about_student .nickname").textContent = "";
  } else {
    klon.querySelector(".about_student .nickname").textContent = `Also know as: ${student.nickName}`;
  }
  klon.querySelector(".about_student .house").textContent = `House: ${student.house}`;
  klon.querySelector(".about_student .gender").textContent = `Gender: ${student.gender}`;
  klon.querySelector(".about_student .blood").textContent = `Blood status: ${student.blood}`;

  klon.querySelector(".about_student .close").addEventListener("click", () => {
    document.querySelector("#popup").classList.remove("active");
  });

  if (student.prefects) {
    klon.querySelector(".prefects_or_not").textContent = `Prefects: Yes`;
  } else {
    klon.querySelector(".prefects_or_not").textContent = `Prefects: No`;
  }

  if (student.squad) {
    klon.querySelector(".squad_or_not").textContent = `Member of inquisitorial squad: Yes`;
  } else {
    klon.querySelector(".squad_or_not").textContent = `Member of inquisitorial squad: No`;
  }

  popupSection.appendChild(klon); // Kloner ned i sektionen

  // Theme for popup
  if (student.house === "Slytherin") {
    document.querySelector("#popup").style.background = "#377A43";
    document.querySelector(".crest").src = "./images/slytherin.png";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#popup").style.background = "#34528A";
    document.querySelector(".crest").src = "./images/ravenclaw.png";
  } else if (student.house === "Gryffindor") {
    document.querySelector("#popup").style.background = "#85302B";
    document.querySelector(".crest").src = "./images/gryffindor.png";
  } else {
    document.querySelector("#popup").style.background = "#ab9739";
    document.querySelector(".crest").src = "./images/hufflepuff.png";
  }
}

// FILTERBUTTONS

function registerFilterButtons() {
  document.querySelector("#filter").addEventListener("click", openFilterDropDown);
  document.querySelector("#sort").addEventListener("click", openSortDropDown);

  function openFilterDropDown() {
    const filterDropdown = document.querySelector("#filter .dropdown");
    if (filterDropdown.style.display === "grid") {
      filterDropdown.style.display = "none";
      document.querySelector("#filter .arrow").textContent = "Filter by ▼";
    } else {
      filterDropdown.style.display = "grid";
      document.querySelector("#filter .arrow").textContent = "Filter by ▲";
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", selectFilter);
    });
  }

  function openSortDropDown() {
    const sortDropdown = document.querySelector("#sort .dropdown");
    if (sortDropdown.style.display === "grid") {
      sortDropdown.style.display = "none";
      document.querySelector("#sort .arrow").textContent = "Sort by ▼";
    } else {
      sortDropdown.style.display = "grid";
      document.querySelector("#sort .arrow").textContent = "Sort by ▲";
    }

    document.querySelectorAll(`[data-action="sort"]`).forEach((sortButton) => {
      sortButton.addEventListener("click", selectSort);
    });
  }

  /*   function openDropDown() {
    document.querySelector(".dropdown").style.display = "grid";
    filterButtons.forEach((button) => {
      button.addEventListener("click", selectFilter);
    });
    document.querySelectorAll(`[data-action="sort"]`).forEach((sortButton) => {
      sortButton.addEventListener("click", selectSort);
    });
  } */
}

function selectFilter(event) {
  const selctedFilter = event.target.dataset.filter;
  setFilter(selctedFilter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allStudents;

  if (settings.filterBy === "slytherin") {
    filteredList = filteredStudents.filter(isSlytherin);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = filteredStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "gryffindor") {
    filteredList = filteredStudents.filter(isGryffindor);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = filteredStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "prefects") {
    filteredList = filteredStudents.filter(iPrefects);
  } else if (settings.filterBy === "squad") {
    filteredList = filteredStudents.filter(isSquad);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  }

  return filteredList;
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function iPrefects(student) {
  return student.prefects === true;
}

function isSquad(student) {
  return student.squad === true;
}

function isExpelled(student) {
  return student.expelled === true;
}

function selectSort(event) {
  const selectedSort = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find old sortby element
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortBy");

  // indicate active sort
  event.target.classList.add("sortBy");

  // toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(selectedSort, sortDir);
  setSort(selectedSort, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

function buildList() {
  filteredStudents = allStudents.filter((student) => student.expelled === false);
  console.log(filteredStudents);
  const currentList = filterList(filteredStudents);

  //const currentList = filterList(filteredStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

function displayList(student) {
  // clear the list
  document.querySelector("#student_list").innerHTML = "";

  document.querySelector("#number_of_students").innerHTML = `Number of students: ${student.length}`; // udskriver antallet af elever

  // build a new list
  showStudents(student);
}

/* Search student */

function searchStudent() {
  //console.log(allStudents);
  const search = document.querySelector("#site-search").value;

  function filterItems(arr, query) {
    return arr.filter((el) => el.firstName.toLowerCase().includes(query.toLowerCase()) + el.lastName.toLowerCase().includes(query.toLowerCase())); // on fullname
  }

  const searchedStudent = filterItems(allStudents, search);

  displayList(searchedStudent);
}

// HACKING

function hackedButton() {
  document.querySelector("#ball").addEventListener("click", hackTheSystem);
}

function hackTheSystem() {
  theSystemIsHacked = true;
  console.log("hackTheSystem");
  document.querySelector("#ball").removeEventListener("click", hackTheSystem);

  ballFlyAway();
}

function ballFlyAway() {
  document.querySelector("#ball").classList.add("flyaway");
  document.querySelector("#ball").addEventListener("animationend", () => {
    document.querySelector("#ball").classList.add("hidden");
    angryBall();
  });
}

function angryBall() {
  document.querySelector("#angryball").classList.remove("hidden");
  document.querySelector("#angryball").classList.add(".angryball");
  setTimeout(() => {
    document.querySelector("#evil").play();
  }, 1650);
  document.querySelector("#angryball").addEventListener("animationend", () => {
    document.querySelector("#ball").classList.add("hidden");
  });

  injectedMe();
  randomBlood();

  buildList();
}

function injectedMe() {
  console.log("injectedMe");

  const injectedMe = {
    firstName: "Sophie",
    middelName: "Feline",
    lastName: "Spang",
    nickName: "Soph",
    house: "Gryffindor",
    image: "./images/myself.jpg",
    gender: "Girl",
    blood: "Pure-blood",
    squad: false,
    prefects: false,
    expelled: false,
  };

  filteredStudents = allStudents.push(injectedMe);
  return filteredStudents;
}

function canNotExpell() {
  document.querySelector("#noExpell").classList.remove("hide");
  document.querySelector("#noExpell .close").addEventListener("click", closeDialog);

  function closeDialog() {
    document.querySelector("#noExpell").classList.add("hide");
    document.querySelector("#noExpell .close").removeEventListener("click", closeDialog);
  }
}

function randomBlood() {
  allStudents.forEach((student) => {
    if (student.blood === "Pure-blood") {
      student.blood = getRandomInt(2); // giver et nummer mellem 0-2.

      if (student.blood == 0) {
        // Hvis tallet er 0, så får den studerende "half-blood" angivet som blood status.
        student.blood = "Half-blood";
      } else {
        student.blood = "Pure-blood";
      }
    } else if (student.blood === "Muggle-blood" || student === "Half-blood") {
      student.blood = "Pure-blood";
    }
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function limitedSquad(student) {
  console.log("limitedSquad");
  if (student.squad === true) {
    setTimeout(() => {
      student.squad = false;
      document.querySelector("#evil").play();
      buildList();
    }, 3000);
  }
}
