import dayjs from "dayjs";

export default function Production() {
  const startDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
  const allDates = [...Array(14).keys()].map((i) =>
    startDate.subtract(i, "days"),
  );

  return JSON.stringify(allDates, null, 1);
}
