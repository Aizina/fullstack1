import { Gender } from "../types/patient";
import { Diagnosis } from "../types/diagnosis";
import { HealthCheckRating } from "../types/entry";

const isString = (v: unknown): v is string =>
  typeof v === "string" || v instanceof String;

export const parseString = (field: string, v: unknown): string => {
  if (!isString(v) || v.trim().length === 0) {
    throw new Error(`Invalid or missing ${field}`);
  }
  return v.trim();
};

export const parseDate = (field: string, v: unknown): string => {
  const s = parseString(field, v);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    throw new Error(`Invalid date format for ${field} (use YYYY-MM-DD)`);
  }
  return s;
};

export const parseGender = (v: unknown): Gender => {
  const s = parseString("gender", v);
  if (!Object.values(Gender).includes(s as Gender)) {
    throw new Error("Invalid gender");
  }
  return s as Gender;
};

export const parseHealthCheckRating = (v: unknown): HealthCheckRating => {
  if (typeof v !== "number" || !Number.isInteger(v)) {
    throw new Error("Invalid healthCheckRating");
  }
  if (v < 0 || v > 3) {
    throw new Error("healthCheckRating must be 0..3");
  }
  return v as HealthCheckRating;
};

export const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<Diagnosis["code"]>;
  }
  return (object as { diagnosisCodes: Array<Diagnosis["code"]> }).diagnosisCodes;
};

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
