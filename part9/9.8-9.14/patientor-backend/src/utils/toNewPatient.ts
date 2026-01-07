import { z } from "zod";
import { Gender, NewPatient } from "../types/patient";

const NewPatientSchema = z.object({
  name: z.string().min(1),
  ssn: z.string().min(1),
  dateOfBirth: z.string().date(),
  occupation: z.string().min(1),
  gender: z.nativeEnum(Gender),
});

export const toNewPatient = (obj: unknown): NewPatient => {
  return NewPatientSchema.parse(obj);
};
