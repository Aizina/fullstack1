import { diagnoses } from "../data/diagnoses";
import { Diagnosis } from "../types/diagnosis";

const getAll = (): Diagnosis[] => diagnoses;

export default { getAll };
