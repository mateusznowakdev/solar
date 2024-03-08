import {
  Chart as BaseChart,
  CategoryScale,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-luxon";
import { useEffect } from "react";

import { COLORS, PARAMETER_METADATA } from "../../meta";

BaseChart.register(
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
);
BaseChart.defaults.font.family = '"Inter", system-ui, sans-serif';

const Y_AXIS_WIDTH = 48;

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
          tooltip: {
            callbacks: {
              label: (context) =>
                PARAMETER_METADATA[data.field].render(context.raw),
            },
          },
        },
        responsive: true,
        scales: {
          x: {
            type: "time",
          },
          y: {
            afterFit(scale) {
              scale.width = Y_AXIS_WIDTH;
            },
            ticks: {
              callback: (value) => PARAMETER_METADATA[data.field].render(value),
              crossAlign: (context) => {
                if (context.scale._labelSizes.widest.width >= Y_AXIS_WIDTH) {
                  return "far";
                } else {
                  return "near";
                }
              },
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
    <>
      <p className="mb-0 mt-3 text-center text-muted">
        {PARAMETER_METADATA[data.field].description} (
        {PARAMETER_METADATA[data.field].unit})
      </p>
      <div>
        <canvas height="256px" id={"canvas-" + data.field}></canvas>
      </div>
    </>
  );
}
