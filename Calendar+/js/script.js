"use strict";

const mainBox = document.querySelector(".main");
mainBox.style.height = `${
  parseFloat(getComputedStyle(document.body).height) -
  parseFloat(getComputedStyle(document.querySelector(".header")).height)
}`;
// console.log(
//   mainBox,
//   parseFloat(getComputedStyle(document.body).height),
//   parseFloat(getComputedStyle(document.querySelector(".header")).height)
// );
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
      if (!entry.isIntersecting) {
        calendarOptions.classList.remove("line-hidden");
      } else {
        calendarOptions.classList.add("line-hidden");
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
      // this.weakNumber = weakNumber + 1;

      const This = this;
      // Calculates February's days and returns full months array for current year
      const modifiedMonths = months.map(function (month) {
        if (month.name === "February") {
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
      const content =
        monthBox[monthBox.length - 1].querySelector(".content-box");

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
    createDays(monthBox) {
      if (!monthBox?.classList.contains("month-box")) return;

      const contentBox = monthBox.querySelector(".content-box");
      const curMonth = this.months[this.findMonthIndex(this.month)];

      const startingDay = new Date(`01-${this.month}-${this.year}`);
      const endingDay = new Date(
        `${curMonth.daysCount}-${this.month}-${this.year}`
      );

      const emptyDays = startingDay.getDay() === 0 ? 7 : startingDay.getDay();
      for (let i = 0; i < emptyDays - 1; i++) {
        createEmptyDay();
      }
      for (let i = 0; i < curMonth.daysCount; i++) {
        // Gets current day
        const day = new Date(`${i + 1}-${this.month}-${this.year}`);
        createDay(day);
      }
      for (let i = endingDay.getDay(); i < 7; i++) {
        createEmptyDay();
      }
      function createDay(day) {
        // Creates day with 'day-special' class if day is Sunday
        const dayHTML = `
      <button class='btn day-box ${day.getDay() === 0 ? "day-special" : ""} ${
          new Date().toDateString() === day.toDateString() ? "today" : ""
        }'>
        <p class='day-number'>${day.getDate()}</p>
      </button>`;
        contentBox.insertAdjacentHTML("beforeend", dayHTML);
      }
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
    // Returns next month
    findNextMonth(month) {
      const nextMonthIndex = this.findMonthIndex(month) + 1;
      return this.months[nextMonthIndex >= 12 ? 1 : nextMonthIndex];
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
  }

  calendarYearInput?.addEventListener("keydown", function (e) {
    if (e.key === "Enter") changeYear();
  });
  calendarYearInput?.addEventListener("focusout", changeYear);
  calendarYearInput?.addEventListener("change", changeYear);
  document
    .querySelector(".logo-box")
    ?.addEventListener("click", () => changeYear(false));
  // Changes year based on calendarYearInput value
  function changeYear(value = true) {
    createYearCalendar(
      value ? +calendarYearInput.value : new Date().getFullYear()
    );
    if (!value) {
      calendarYearInput.value = new Date().getFullYear();
    }
  }
}

///////////////////////////
// Calendar modal window
///////////////////////////

function modalWindow() {
  const calendarBox = document.querySelector(".calendar-month-box");
  let calendarModalWindowBlurOn = false;
  let info = {};
  let clickedDayBox;

  createCalendarModalWindow();
  const calendarModalWindow = document.querySelector(".calendar-modal-window");

  // Hides modal window if back button is pressed
  calendarModalWindow
    .querySelector(".back-btn")
    .addEventListener("click", hideCalendarModalWindow);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideCalendarModalWindow();
    }
  });

  // Shows modal window if day button is pressed
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
    calendarModalWindow.querySelector(
      ".calendar-mw-day"
    ).textContent = `${day} ${month}`;
    calendarModalWindow.querySelector(
      ".calendar-mw-year"
    ).textContent = `${year}`;

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
    // Shows calendar modal window
    calendarModalWindow.classList.remove("hidden");

    info = {
      day,
      month,
      year,
    };

    calendarModalWindow.querySelector(".task-input").focus();
  }
  // Hides modal window
  function hideCalendarModalWindow() {
    clickedDayBox.focus();
    calendarModalWindow.classList.add("hidden");
    switchCalendarBoxBlur(false);

    info.tasks = [...calendarModalWindow.querySelectorAll(".hour-box")].map(
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

    calendarModalWindowContent.querySelectorAll("hr").forEach(function (hr) {
      calendarModalWindowContent.removeChild(hr);
    });
    calendarModalWindowContent.querySelectorAll("br").forEach(function (br) {
      calendarModalWindowContent.removeChild(br);
    });
    const HTML = `${createHours()}`;

    calendarModalWindowContent.insertAdjacentHTML("beforeend", HTML);
    return document.querySelector(".calendar-modal-window");

    function createHours() {
      document
        .querySelectorAll(".hour-box")
        .forEach((hourBox) => hourBox.parentElement.removeChild(hourBox));
      const hoursHTML = [];
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
      // document
      // .querySelector(".background-blur")
      // .removeEventListener("click", hideCalendarModalWindow);
      calendarBox.classList.remove("background-blur");
      document.body.style.overflow = "auto";
    } else {
      calendarBox.classList.add("background-blur");
      // document
      // .querySelector(".background-blur")
      // ?.addEventListener("click", hideCalendarModalWindow);
      document.body.style.overflow = "hidden";
    }
    calendarModalWindowBlurOn = on;
  }

  function saveTasks() {
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
