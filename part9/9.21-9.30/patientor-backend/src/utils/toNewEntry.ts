import { NewEntry } from "../types/entry";
import {
  assertNever,
  parseDate,
  parseDiagnosisCodes,
  parseHealthCheckRating,
  parseString,
} from "./parsers";

const isEntryType = (t: string): t is NewEntry["type"] =>
  t === "HealthCheck" || t === "Hospital" || t === "OccupationalHealthcare";

export const toNewEntry = (obj: unknown): NewEntry => {
  if (!obj || typeof obj !== "object") throw new Error("Invalid entry payload");
  const o = obj as Record<string, unknown>;

  const base = {
    description: parseString("description", o.description),
    date: parseDate("date", o.date),
    specialist: parseString("specialist", o.specialist),
    diagnosisCodes: parseDiagnosisCodes(o),
  };

  const typeStr = parseString("type", o.type);
  if (!isEntryType(typeStr)) throw new Error(`Unknown entry type: ${typeStr}`);
  const type = typeStr;

  switch (type) {
    case "HealthCheck":
      return {
        ...base,
        type: "HealthCheck",
        healthCheckRating: parseHealthCheckRating(o.healthCheckRating),
      };

    case "Hospital": {
      const discharge = o.discharge;
      if (!discharge || typeof discharge !== "object") throw new Error("Missing discharge");
      const d = discharge as Record<string, unknown>;
      return {
        ...base,
        type: "Hospital",
        discharge: {
          date: parseDate("discharge.date", d.date),
          criteria: parseString("discharge.criteria", d.criteria),
        },
      };
    }

    case "OccupationalHealthcare": {
      const employerName = parseString("employerName", o.employerName);

      let sickLeave: { startDate: string; endDate: string } | undefined;
      if (o.sickLeave && typeof o.sickLeave === "object") {
        const sl = o.sickLeave as Record<string, unknown>;
        sickLeave = {
          startDate: parseDate("sickLeave.startDate", sl.startDate),
          endDate: parseDate("sickLeave.endDate", sl.endDate),
        };
      }

      return {
        ...base,
        type: "OccupationalHealthcare",
        employerName,
        ...(sickLeave ? { sickLeave } : {}),
      };
    }

    default:
      return assertNever(type);
  }
};
