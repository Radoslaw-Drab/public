import {
  refreshFrequency as refreshFreq,
  days,
  language,
  dateSeparator,
} from "./src/config";

export const refreshFrequency = refreshFreq || 10000;

import style from "./src/style.js";
export const className = style;

export const command = () => new Date();

export const render = ({ output: date }) => {
  const regionLanguage = navigator.languages[0].split("-")[0];
  const outputLanguage = language || regionLanguage;

  const dayName = days.find((day) => day.index === date.getDay()).translations[
    outputLanguage
  ];
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}${dateSeparator}${month}${dateSeparator}${year}`;

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;
  return (
    <div className="container">
      <div className="container__time">{formattedTime}</div>
      <div className="container__date">{formattedDate}</div>
      <div className="container__day">{dayName}</div>
    </div>
  );
};
