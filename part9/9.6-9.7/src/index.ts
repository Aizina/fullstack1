import express, { Request } from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
import { isNotNumber } from "./utils";

const app = express();
app.use(express.json());

type BmiQuery = {
  height?: string;
  weight?: string;
};

type ExercisesBody = {
  daily_exercises?: unknown;
  target?: unknown;
};

const parseNumber = (value: unknown): number => {
  if (value === undefined) {
    throw new Error("parameters missing");
  }
  if (isNotNumber(value)) {
    throw new Error("malformatted parameters");
  }
  return Number(value);
};

const parseNumberArray = (value: unknown): number[] => {
  if (value === undefined) {
    throw new Error("parameters missing");
  }
  if (!Array.isArray(value)) {
    throw new Error("malformatted parameters");
  }
  if (value.some((v) => isNotNumber(v))) {
    throw new Error("malformatted parameters");
  }
  return value.map(Number);
};

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get(
  "/bmi",
  (req: Request<unknown, unknown, unknown, BmiQuery>, res) => {
    const { height, weight } = req.query;

    if (height === undefined || weight === undefined) {
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
  }
);

app.post("/exercises", (req: Request<unknown, unknown, ExercisesBody>, res) => {
  try {
    const dailyExercises = parseNumberArray(req.body.daily_exercises);
    const target = parseNumber(req.body.target);

    return res.json(calculateExercises(dailyExercises, target));
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "parameters missing") {
        return res.status(400).json({ error: "parameters missing" });
      }
      if (error.message === "malformatted parameters") {
        return res.status(400).json({ error: "malformatted parameters" });
      }
      return res.status(400).json({ error: error.message });
    }
    return res.status(400).json({ error: "malformatted parameters" });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
