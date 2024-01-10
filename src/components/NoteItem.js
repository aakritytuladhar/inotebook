import React, { useContext } from "react";
import noteContext from "../context/noteContext";

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;

  const { note, updateNote } = props;

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title"> {note.title}</h5>
          <p className="card-text">{note.description}</p>
          <div className="container align-item-flex">
            <i
              className=" fa-regular fa-trash-can mx-2 "
              onClick={() => {
                deleteNote(note._id);
                props.showAlert("Deleted Succesfully", "Success");
              }}></i>
            <i
              className=" fa-solid fa-eraser mx-2"
              onClick={() => {
                updateNote(note);
              }}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
