import { v4 as uuid } from "uuid";
import { patients } from "../data/patients";
import { NewPatient, NonSensitivePatient, Patient } from "../types/patient";
import { Entry, NewEntry } from "../types/entry";

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
    entries: [],
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = getById(patientId);
  if (!patient) throw new Error("Patient not found");

  const id = uuid();

  let newEntry: Entry;
  switch (entry.type) {
    case "HealthCheck":
      newEntry = { id, ...entry };
      break;
    case "Hospital":
      newEntry = { id, ...entry };
      break;
    case "OccupationalHealthcare":
      newEntry = { id, ...entry };
      break;
    default:
      throw new Error("Unknown entry type");
  }

  patient.entries.push(newEntry);
  return newEntry;
};

export default { getNonSensitivePatients, getById, addPatient, addEntry };
