"use strict";

///////////////////////////
// Observers
///////////////////////////

observers();
function observers() {
  const mainHeader = document.querySelector(".header");
  const calendarOptions = document.querySelector(".calendar-options-box");
  const navObsOptions = {
    root: null,
    threshold: 0,
    rootMargin: getComputedStyle(calendarOptions).height,
  };
  const calendarOptionsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // Removes/Adds special effect based on intersecting
      if (!entry.isIntersecting) {
        calendarOptions.classList.remove("nav-bar-show");
      } else {
        calendarOptions.classList.add("nav-bar-show");
      }
    });
  }, navObsOptions);
  calendarOptionsObserver.observe(mainHeader);

  /*
class MonthBoxObserver {
  monthBoxObserver = new IntersectionObserver(this.callbackFunction(entries), {
    root: null,
    threshold: 0,
  });
  constructor(element) {
    this.element = element;
    monthBoxObserver.observe(this.element);
  }

  callbackFunction(entries) {
    entries.forEach(function (entry) {
      const dividerLine = document.querySelector(".month-box .divider-line");
      if (entry.isIntersecting) dividerLine.classList.add("highlight");
      else dividerLine.classList.remove("highlight");
    });
  }
}

const monthBoxes = document.querySelectorAll(".month-box");
monthBoxes.forEach(function (monthBox) {
  new MonthBoxObserver(monthBox);
});
*/
}
///////////////////////////
// Calendar logic
///////////////////////////
calendar();
function calendar() {
  const calendarBox = document.querySelector(".calendar-month-box");
  const calendarYearInput = document.querySelector(
    ".calendar-year-option-input"
  );
  // All months with name and daysCount (February's daysCount change automatically based on year)
  const months = [
    { name: "January", daysCount: 31 },
    { name: "February", daysCount: 28 },
    { name: "March", daysCount: 31 },
    { name: "April", daysCount: 30 },
    { name: "May", daysCount: 31 },
    { name: "June", daysCount: 30 },
    { name: "July", daysCount: 31 },
    { name: "August", daysCount: 31 },
    { name: "September", daysCount: 30 },
    { name: "October", daysCount: 31 },
    { name: "November", daysCount: 30 },
    { name: "December", daysCount: 31 },
  ];
  class Month {
    constructor(year, month) {
      this.year = year;
      this.month = month;

      const This = this;
      // Calculates February's days and returns full months array for set year
      const modifiedMonths = months.map(function (month) {
        if (month.name === "February") {
          // Returns new object with with calculated months of February
          return {
            name: month.name,
            daysCount: This.calcLeapYear() ? 29 : 28,
          };
        } else {
          return month;
        }
      });
      this.months = modifiedMonths;
    }

    // Calculates if year is a leap year
    calcLeapYear() {
      if (this.year % 4 === 0 && this.year % 400) {
        return true;
      } else {
        return false;
      }
    }
    // Creates month box
    createMonthBox() {
      const boxHTML = `
        <div class='month-box'>
        <hr class='divider-line'>
        <p class='month-title'>${this.month}</p>
        <p class='year-title'>${this.year}</p>
        <div class='content'>
        <div class='content-box'>
        </div>
        </div>
        </div>`;

      calendarBox.insertAdjacentHTML("beforeend", boxHTML);

      let monthBox = document.querySelectorAll(".month-box");
      // Month box content
      const content =
        monthBox[monthBox.length - 1].querySelector(".content-box");

      // Cretes day names
      const dayNamesHTML = `
        <p class='day-name'>Mon</p>
        <p class='day-name'>Tue</p>
        <p class='day-name'>Wen</p>
        <p class='day-name'>Thu</p>
        <p class='day-name'>Fri</p>
        <p class='day-name'>Sat</p>
        <p class='day-name'>Sun</p>
      `;
      content.insertAdjacentHTML("beforeend", dayNamesHTML);

      monthBox = document.querySelectorAll(".month-box");
      return monthBox[monthBox.length - 1];
    }
    // Creates days for certain monthBox
    createDays(monthBox) {
      // Checks if monthBox contains month-box class
      if (!monthBox?.classList.contains("month-box")) return;

      const contentBox = monthBox.querySelector(".content-box");
      const curMonth = this.months[this.findMonthIndex(this.month)];

      // Calculates starting day
      const startingDay = new Date(`01-${this.month}-${this.year}`);
      // Calculates last day
      const endingDay = new Date(
        `${curMonth.daysCount}-${this.month}-${this.year}`
      );

      // Number of empty days to create on start
      const emptyDays = startingDay.getDay() === 0 ? 7 : startingDay.getDay();
      // Creates empty days on start
      for (let i = 0; i < emptyDays - 1; i++) {
        createEmptyDay();
      }
      for (let i = 0; i < curMonth.daysCount; i++) {
        // Gets current day
        const day = new Date(`${i + 1}-${this.month}-${this.year}`);
        createDay(day);
      }
      // Creates empty days on end
      for (let i = endingDay.getDay(); i < 7; i++) {
        createEmptyDay();
      }
      function createDay(day) {
        // Creates day with 'day-special' class if day is Sunday
        const dayHTML = `
          <button class='btn day-box ${
            day.getDay() === 0 ? "day-special" : ""
          } ${new Date().toDateString() === day.toDateString() ? "today" : ""}'>
            <p class='day-number'>${day.getDate()}</p>
          </button>`;
        contentBox.insertAdjacentHTML("beforeend", dayHTML);
      }
      // Creates empty day
      function createEmptyDay() {
        const emptyDayHTML = `
          <div class='day-box empty'>
          </div>`;
        contentBox.insertAdjacentHTML("beforeend", emptyDayHTML);
      }
    }
    // Returns month index in months array
    findMonthIndex(curMonth) {
      const monthIndex = this.months.findIndex(
        (month) => month.name === curMonth
      );
      return monthIndex;
    }
  }

  // Creates calendar for current year
  createYearCalendar(new Date().getFullYear());
  // Creates calendar for full year
  function createYearCalendar(year) {
    // Deletes every month box
    document.querySelectorAll(".month-box")?.forEach(function (monthBox) {
      monthBox.parentElement.removeChild(monthBox);
    });
    // Creates new month box with set year
    months.forEach(function (month) {
      const monthInstance = new Month(year, month.name);
      const monthBox = monthInstance.createMonthBox();
      // Creates days for certain month box
      monthInstance.createDays(monthBox);
    });
    // Creates new modal window
    modalWindow();

    // Changes to set year of an calendar title
    document.head.querySelector("title").textContent = `Calendar+ - ${year}`;
  }

  // Changes year when enter is pressed, value is changed or element lost focus
  calendarYearInput?.addEventListener("keydown", function (e) {
    if (e.key === "Enter") changeYear();
  });
  calendarYearInput?.addEventListener("focusout", changeYear);
  calendarYearInput?.addEventListener("change", changeYear);
  // Changes year to current year if logo is clicked
  document
    .querySelector(".logo-box")
    ?.addEventListener("click", () => changeYear(false));
  // Changes year based on calendarYearInput value or if inputValue === false then it creates calendar for current year
  function changeYear(inputValue = true) {
    createYearCalendar(
      inputValue ? +calendarYearInput.value : new Date().getFullYear()
    );
    if (!inputValue) {
      calendarYearInput.value = new Date().getFullYear();
    }
  }
}

///////////////////////////
// Calendar modal window
///////////////////////////

function modalWindow() {
  const calendarBox = document.querySelector(".calendar-month-box");
  let info = {};
  let calendarModalWindowBlurOn = false;
  let clickedDayBox;

  createCalendarModalWindow();
  const calendarModalWindow = document.querySelector(".calendar-modal-window");

  // Hides modal window if back button or escape is pressed
  calendarModalWindow
    .querySelector(".back-btn")
    .addEventListener("click", hideCalendarModalWindow);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideCalendarModalWindow();
    }
  });

  // Shows modal window if day button or enter is pressed
  document.querySelectorAll(".month-box").forEach(function (monthBox) {
    monthBox.addEventListener("click", function (e) {
      displayCalendarModalWindowEvent(e);
    });
    monthBox.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        displayCalendarModalWindowEvent(e, monthBox);
      }
    });
  });
  function displayCalendarModalWindowEvent(e, monthBox) {
    // Checks if target contains day-box class and does not contain empty class
    if (
      e.target.closest(".day-box") &&
      !e.target.closest(".day-box").classList.contains("empty")
    ) {
      // If monthBox is empty then it'll choose e.target (dayBox). Otherwise it'll search in parents for closes day-box class
      const dayBox = !monthBox ? e.target.closest(".day-box") : e.target;
      const day = +dayBox.textContent;
      const month = dayBox
        .closest(".month-box")
        .querySelector(".month-title").textContent;
      const year = +dayBox.closest(".month-box").querySelector(".year-title")
        .textContent;
      // Gets task from localStorage and splits it by ';'. If it doesn't find anything it returns empty array
      const tasks =
        localStorage.getItem(`${day}-${month}-${year}`)?.split(";") || [];

      clickedDayBox = dayBox;
      displayCalendarModalWindow(day, month, year, tasks);
    }
  }

  // Displays modal window and sets its values
  function displayCalendarModalWindow(day, month, year, tasks) {
    // Sets day and month
    calendarModalWindow.querySelector(
      ".calendar-mw-day"
    ).textContent = `${day}${getSufix(day)} ${month}`;
    // Sets year
    calendarModalWindow.querySelector(
      ".calendar-mw-year"
    ).textContent = `${year}`;

    // Returns sufix of a day
    function getSufix(day) {
      switch (day) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    }

    if (tasks) {
      const hourBoxes = [...calendarModalWindow.querySelectorAll(".hour-box")];
      hourBoxes.forEach(function (hourBox) {
        const taskText = hourBox.querySelector(".task");

        // Searches for a task based on taskText data and current index (hour) in tasks array
        const foundTask = tasks.find(function (_, i) {
          return +taskText.dataset.hour === i;
        });
        hourBox.querySelector(".task-input").value = foundTask ? foundTask : "";
      });
    }
    // Turns on blur
    switchCalendarBoxBlur(true);
    // Shows modal window
    calendarModalWindow.classList.remove("hidden");

    // Sets info of current day
    info = {
      day,
      month,
      year,
    };

    // Focuses on modal window
    calendarModalWindow.querySelector(".task-input").focus();
  }
  // Hides modal window
  function hideCalendarModalWindow() {
    // Focuses on clicked day box
    clickedDayBox.focus();
    // Hides modal window
    calendarModalWindow.classList.add("hidden");
    // Turns of blur
    switchCalendarBoxBlur(false);

    // Saves values into info.tasks
    info.tasks = [...calendarModalWindow.querySelectorAll(".hour-box")].map(
      // Returns values of a tasks in certain hours. If value is empty then returns empty string
      function (hourBox) {
        return hourBox.querySelector(".task-input").value || "";
      }
    );
    saveTasks();
  }
  // Creates modal window hour boxes
  function createCalendarModalWindow() {
    const calendarModalWindowContent = document.querySelector(
      ".calendar-mw-content"
    );

    // Deletes every hr element
    calendarModalWindowContent.querySelectorAll("hr").forEach(function (hr) {
      calendarModalWindowContent.removeChild(hr);
    });
    // Deletes every br element
    calendarModalWindowContent.querySelectorAll("br").forEach(function (br) {
      calendarModalWindowContent.removeChild(br);
    });

    // Creates all hours (00:00 - 23:00)
    const HTML = `${createHours()}`;

    // Inserts hours into modal window's content
    calendarModalWindowContent.insertAdjacentHTML("beforeend", HTML);
    return document.querySelector(".calendar-modal-window");

    function createHours() {
      // Deletes every element with hour-box class
      document
        .querySelectorAll(".hour-box")
        .forEach((hourBox) => hourBox.parentElement.removeChild(hourBox));
      const hoursHTML = [];
      // Creates new hour element
      for (let i = 0; i < 24; i++) {
        const hourHTML = `
      <div class='hour-box'>
      <p class='hour'>
      ${i.toString().padStart(2, "0")}:00
      </p>
      <div class='task' data-hour='${i}'>
      <input type='text' class='task-input' />
      </div>
      </div>
      <hr>
      `;
        hoursHTML.push(hourHTML);
      }
      return hoursHTML.join("<br>");
    }
  }
  // Switches background blur
  function switchCalendarBoxBlur(blurSwitch) {
    const on = calendarBox.classList.contains("background-blur");
    if (!blurSwitch) {
      // Removes background blur
      calendarBox.classList.remove("background-blur");
      // Enables scroll
      document.body.style.overflow = "auto";
    } else {
      // Makes background blur
      calendarBox.classList.add("background-blur");
      // DIsables scroll
      document.body.style.overflow = "hidden";
    }
    calendarModalWindowBlurOn = on;
  }
  // Saves tasks to localStorage
  function saveTasks() {
    // Sets item in localStorage based on day, month and year in info object
    localStorage.setItem(
      `${info.day}-${info.month}-${info.year}`,
      `${info.tasks.join(";")}`
    );
  }
}

///////////////////////////
// Copyright
///////////////////////////

document.querySelector(".footer-text").querySelector("span").textContent =
  new Date().getFullYear();
