import {
  CategoryScale,
  Chart as BaseChart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect } from "react";

import { COLORS, METADATA } from "../../meta";
import { renderDateTime, renderTime } from "../../render";

BaseChart.register(
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
);

export default function Chart({ column, data }) {
  useEffect(() => {
    const chartOptions = {
      data: {
        datasets: [
          {
            backgroundColor: COLORS.PRIMARY_TRANSLUCENT,
            borderColor: COLORS.PRIMARY,
            data: data.values.map((row) => row[column + 1]),
            fill: true,
            label: METADATA[data.fields[column]].description,
          },
        ],
        labels: data.values.map((row) => row[0]),
      },
      options: {
        animation: false,
        elements: {
          line: { borderWidth: 1 },
          point: { pointStyle: false },
        },
        interaction: {
          intersect: false,
        },
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: METADATA[data.fields[column]].description,
          },
          tooltip: {
            callbacks: {
              title: (context) =>
                renderDateTime(data.values[context[0].parsed.x][0]),
              label: (context) =>
                METADATA[data.fields[column]].render(context.raw),
            },
          },
        },
        responsive: true,
        scales: {
          x: {
            ticks: {
              callback: (value) => renderTime(data.values[value][0]),
            },
          },
          y: {
            ticks: {
              callback: (value) => METADATA[data.fields[column]].render(value),
              precision: 0,
            },
          },
        },
      },
      type: "line",
    };

    const chart = new BaseChart(
      document.getElementById("canvas" + column),
      chartOptions,
    );

    return () => {
      if (chart) chart.destroy();
    };
  }, [data]);

  return (
    <div>
      <canvas height="256px" id={"canvas" + column}></canvas>
    </div>
  );
}
