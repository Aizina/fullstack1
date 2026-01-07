import express from "express";
import patientService from "../services/patientService";
import { toNewPatient } from "../utils/toNewPatient";
import { toNewEntry } from "../utils/toNewEntry";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(patientService.getNonSensitivePatients());
});

router.get("/:id", (req, res) => {
  const patient = patientService.getById(req.params.id);
  if (!patient) return res.status(404).send({ error: "Patient not found" });
  res.json(patient);
});

router.post("/", (req, res) => {
  try {
    const newEntry = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newEntry);
    res.json(addedPatient);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Invalid data";
    res.status(400).send({ error: message });
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const entry = toNewEntry(req.body);
    const added = patientService.addEntry(req.params.id, entry);
    res.json(added);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Invalid entry data";
    res.status(400).send({ error: message });
  }
});

export default router;
