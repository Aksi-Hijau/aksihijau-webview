import React from "react";
import ReactQuill from "react-quill";


const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

// eslint-disable-next-line react/prop-types
const TextEditor = ({ value, onChange }) => {
  return (
    <ReactQuill
      modules={modules}
      formats={formats}
      theme="snow"
      value={value}
      onChange={onChange}
    />
  );
};

export default TextEditor;
