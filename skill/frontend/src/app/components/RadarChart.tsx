import { Radar } from "react-chartjs-2";
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ features }: any) {
  const data = {
    labels: ["Accuracy", "Conceptual", "Logical", "Speed"],
    datasets: [
      {
        label: "Skill Profile",
        data: [
          features.accuracy,
          features.conceptual_score,
          features.logical_score,
          features.speed_score
        ]
      }
    ]
  };

  return <Radar data={data} />;
}