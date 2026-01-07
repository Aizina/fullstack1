import { Patient, Gender } from "../types/patient";
import { HealthCheckRating } from "../types/entry";

export const patients: Patient[] = [
  {
    id: "d2773336-f723-11e9-8f0b-362b9e155667",
    name: "John McClane",
    dateOfBirth: "1986-07-09",
    ssn: "090786-122X",
    gender: Gender.Male,
    occupation: "New york city cop",
    entries: [
      {
        id: "e1",
        type: "HealthCheck",
        date: "2020-01-02",
        specialist: "MD House",
        description: "Yearly control visit. Everything looks good.",
        healthCheckRating: HealthCheckRating.Healthy,
        diagnosisCodes: ["Z57.1"]
      },
      {
        id: "e2",
        type: "Hospital",
        date: "2020-02-10",
        specialist: "MD Strange",
        description: "Admitted for observation after a fall.",
        discharge: {
          date: "2020-02-12",
          criteria: "Stable vitals, pain controlled."
        },
        diagnosisCodes: ["S62.5"]
      }
    ],
  },
  {
    id: "d2773598-f723-11e9-8f0b-362b9e155667",
    name: "Martin Riggs",
    dateOfBirth: "1979-01-30",
    ssn: "300179-77A",
    gender: Gender.Male,
    occupation: "Cop",
    entries: [
      {
        id: "e3",
        type: "OccupationalHealthcare",
        date: "2020-03-01",
        specialist: "Occupational Doctor",
        description: "Work-related stress symptoms.",
        employerName: "LAPD",
        sickLeave: {
          startDate: "2020-03-02",
          endDate: "2020-03-16"
        },
        diagnosisCodes: ["F43.2"]
      }
    ],
  },
  {
    id: "d27736ec-f723-11e9-8f0b-362b9e155667",
    name: "Hans Gruber",
    dateOfBirth: "1970-04-25",
    ssn: "250470-555L",
    gender: Gender.Other,
    occupation: "Technician",
    entries: [],
  },
  {
    id: "d2773822-f723-11e9-8f0b-362b9e155667",
    name: "Dana Scully",
    dateOfBirth: "1974-01-05",
    ssn: "050174-432N",
    gender: Gender.Female,
    occupation: "Forensic Pathologist",
    entries: [],
  },
  {
    id: "d2773c6e-f723-11e9-8f0b-362b9e155667",
    name: "Matti Luukkainen",
    dateOfBirth: "1971-04-09",
    ssn: "090471-8890",
    gender: Gender.Male,
    occupation: "Digital evangelist",
    entries: [],
  },
];
