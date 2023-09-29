import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function Production() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const startDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
    const allDates = [...Array(14).keys()].map((i) =>
      startDate.subtract(i, "days").unix(),
    );

    setData(allDates);
  }, []);

  return JSON.stringify(data, null, 1);
}
