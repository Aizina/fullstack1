import { diagnoses } from "../data/diagnoses";
import { Diagnosis } from "../types/diagnosis";

const getAll = (): Diagnosis[] => {
  return diagnoses;
};

export default { getAll };
