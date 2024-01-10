const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE 1::get all the notes using :get "api/notes/fetchallnotes". No login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occors");
  }
});
//ROUTE 2:Add a new notes using :post "api/notes/addnote". No login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title"),
    body("description", "Description must be 5 characters"),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors, return bad req and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // adding new notes and save
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savednote = await note.save();

      res.json(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occors");
    }
  }
);
//ROUTE 3:Update  a existing notes using :PUT "api/notes/updatenote". No login required

router.put(
  "/updatenote/:id",
  fetchuser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // create  a newNote Object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }
      //  Checking the valid user so that authorized  people can update
      let note = await Note.findById(req.params.id);
      if (!note) {
        res.status(401).send("User not found");
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("NOt allowed");
      }
      // Updating the notes
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occors");
    }
  }
  // catch(){

  // }
);
//ROUTE 4:delete  a existing notes using :DELETE "api/notes/deletenot". No login required

router.delete(
  "/deletenote/:id",
  fetchuser,
  async (req, res) => {
    try {
      //  Checking the valid user so that authorized  people can update
      let note = await Note.findById(req.params.id);
      if (!note) {
        res.status(401).send("User not found");
      }
      // allow deletetion ony if it is authorized
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("NOt allowed");
      }
      // delete the notes
      note = await Note.findByIdAndDelete(req.params.id);
      res.json({ Sucess: " Note has been deleted", note: note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occors");
    }
  }
  // catch(){

  // }
);
module.exports = router;
