// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidv1 = require('uuid/v1');
const fs = require("fs");
const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

// Create
app.post("/exercises", (req, res) => {
  const exercisesList = readJSONFile();
  const newExercise = req.body;
  newExercise.id = uuidv1();
  exercisesList.push(newExercise);
  writeJSONFile(exercisesList);
  res.json(newExercise);
});

// Read One
app.get("/exercises/:id", (req, res) => {
  const exercisesList = readJSONFile();
  const id = req.params.id;
  let idFound = false;
  let foundDog;

  exercisesList.forEach(exercise => {
    if (id === exercise.id) {
      idFound = true;
      foundExercise = exercise;
    }
  });
  if (idFound) {
    res.json(foundExercise);
  } else {
    res.status(404).send(`Exercise ${id} was not found`);
  }
});

// Read All
app.get("/exercises", (req, res) => {
  const exercisesList = readJSONFile();
  res.json(exercisesList);
});

// Update
app.put("/exercises/:id", (req, res) => {
  const exercisesList = readJSONFile();
  const id = req.params.id;
  const newExercise = req.body;
  newExercise.id = id;
  let idFound = false;
  const newExerciseList = exercisesList.map((exercise) => {
     if (exercise.id === id) {
       idFound = true;
       return newExercise
     }
    return exercise
  })
  writeJSONFile(newExerciseList);
  if (idFound) {
    res.json(newExercise);
  } else {
    res.status(404).send(`Exercise ${id} was not found`);
  }
});

// Delete
app.delete("/exercises/:id", (req, res) => {
  const exercisesList = readJSONFile();
  const id = req.params.id;
  const newExerciseList = exercisesList.filter((exercise) => exercise.id !== id)
  if (exercisesList.length !== newExerciseList.length) {
    res.status(200).send(`Exercise ${id} was removed`);
    writeJSONFile(newExerciseList);
  } else {
    res.status(404).send(`Exercise ${id} was not found`);
  }
});

// Functia de citire din fisierul db.json
function readJSONFile() {
  return JSON.parse(fs.readFileSync("db.json"))["exercises"];
}

// Functia de scriere in fisierul db.json
function writeJSONFile(content) {
  fs.writeFileSync(
    "db.json",
    JSON.stringify({ exercises: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

// Pornim server-ul
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);