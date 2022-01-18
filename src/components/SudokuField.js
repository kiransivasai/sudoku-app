import React from "react";

function SudokuField({ field, handleChange }) {
  const handleInput = (e) => {
    const value = parseInt(e.target.value % 10, 10);
    handleChange({ ...field, value: value });
  };
  return (
    <input
      className="field"
      value={field.value || ""}
      onChange={handleInput}
      readOnly={field.readOnly}
    />
  );
}

export default SudokuField;
