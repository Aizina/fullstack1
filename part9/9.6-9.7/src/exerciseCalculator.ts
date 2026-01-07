import { isNotNumber } from "./utils";

export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((h) => h > 0).length;

  const total = dailyHours.reduce((sum, h) => sum + h, 0);
  const average = total / periodLength;

  const success = average >= target;

  let rating: 1 | 2 | 3;
  let ratingDescription: string;

  if (average < target * 0.75) {
    rating = 1;
    ratingDescription = "you need to exercise more";
  } else if (average < target) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "great job, target achieved";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const parseExerciseArguments = (
  args: string[]
): { target: number; dailyHours: number[] } => {
  if (args.length < 4) {
    throw new Error(
      "Not enough arguments. Usage: npm run calculateExercises -- <target> <day1> <day2> ..."
    );
  }

  const targetArg = args[2];
  const hoursArgs = args.slice(3);

  if (isNotNumber(targetArg)) {
    throw new Error("Target must be a number!");
  }
  if (hoursArgs.some((a) => isNotNumber(a))) {
    throw new Error("Daily exercise hours must be numbers!");
  }

  return {
    target: Number(targetArg),
    dailyHours: hoursArgs.map(Number),
  };
};

if (require.main === module) {
  try {
    const { target, dailyHours } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let message = "Something went wrong.";
    if (error instanceof Error) {
      message += ` Error: ${error.message}`;
    }
    console.log(message);
  }
}
