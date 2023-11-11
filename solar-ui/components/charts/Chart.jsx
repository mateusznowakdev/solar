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

import { COLORS, PARAMETER_METADATA } from "../../meta";
import { renderDateTime, renderTime } from "../../utils";

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

export default function Chart({ data }) {
  useEffect(() => {
    const chartOptions = {
      data: {
        datasets: [
          {
            backgroundColor: COLORS.PRIMARY_TRANSLUCENT,
            borderColor: COLORS.PRIMARY,
            data: data.y,
            fill: true,
            label: PARAMETER_METADATA[data.field].description,
          },
        ],
        labels: data.x,
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
            text: PARAMETER_METADATA[data.field].description,
          },
          tooltip: {
            callbacks: {
              title: (context) => renderDateTime(data.x[context[0].parsed.x]),
              label: (context) => PARAMETER_METADATA[data.field].render(context.raw),
            },
          },
        },
        responsive: true,
        scales: {
          x: {
            ticks: {
              callback: (value) => renderTime(data.x[value]),
            },
          },
          y: {
            ticks: {
              callback: (value) => PARAMETER_METADATA[data.field].render(value),
              precision: 0,
            },
          },
        },
      },
      type: "line",
    };

    const chart = new BaseChart(
      document.getElementById("canvas-" + data.field),
      chartOptions,
    );

    return () => {
      if (chart) chart.destroy();
    };
  }, [data]);

  return (
    <div>
      <canvas height="256px" id={"canvas-" + data.field}></canvas>
    </div>
  );
}
