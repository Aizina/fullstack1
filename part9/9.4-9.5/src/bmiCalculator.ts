import { isNotNumber } from "./utils";

export const calculateBmi = (heightCm: number, weightKg: number): string => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal range";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

const parseBmiArguments = (args: string[]): { height: number; weight: number } => {
  if (args.length < 4) {
    throw new Error("Not enough arguments. Usage: npm run calculateBmi -- <heightCm> <weightKg>");
  }
  if (args.length > 4) {
    throw new Error("Too many arguments. Usage: npm run calculateBmi -- <heightCm> <weightKg>");
  }

  const height = args[2];
  const weight = args[3];

  if (isNotNumber(height) || isNotNumber(weight)) {
    throw new Error("Provided values were not numbers!");
  }

  return { height: Number(height), weight: Number(weight) };
};

if (require.main === module) {
  try {
    const { height, weight } = parseBmiArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let message = "Something went wrong.";
    if (error instanceof Error) {
      message += ` Error: ${error.message}`;
    }
    console.log(message);
  }
}
