import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { isNotNumber } from "./utils";

const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (height === undefined || weight === undefined) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  if (typeof height !== "string" || typeof weight !== "string") {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  if (isNotNumber(height) || isNotNumber(weight)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  return res.json({
    weight: weightNum,
    height: heightNum,
    bmi: calculateBmi(heightNum, weightNum),
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
