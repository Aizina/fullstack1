import express from "express";
import patientService from "../services/patientService";
import { toNewPatient } from "../utils/toNewPatient";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(patientService.getNonSensitivePatients());
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

export default router;
