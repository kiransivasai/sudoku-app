import React from "react";
import SudokuField from "./SudokuField";

function SudokuBoard({ sudoku, handleChange }) {
  return (
    <div className="sudoku__board">
      {sudoku.rows &&
        sudoku.rows.map((row) => (
          <div className="row" key={row.index}>
            {row.cols.map((col) => (
              <SudokuField
                key={col.row + col.col}
                field={col}
                handleChange={handleChange}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

export default SudokuBoard;
