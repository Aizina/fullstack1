import { NewPatient } from "../types/patient";
import { parseDate, parseGender, parseString } from "./parsers";

export const toNewPatient = (obj: unknown): NewPatient => {
  if (!obj || typeof obj !== "object") throw new Error("Invalid patient payload");

  const o = obj as Record<string, unknown>;

  return {
    name: parseString("name", o.name),
    ssn: parseString("ssn", o.ssn),
    dateOfBirth: parseDate("dateOfBirth", o.dateOfBirth),
    occupation: parseString("occupation", o.occupation),
    gender: parseGender(o.gender),
  };
};
