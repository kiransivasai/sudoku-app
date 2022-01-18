import "./App.css";
import generator from "sudoku";
import { useEffect, useState } from "react";
import SudokuBoard from "./components/SudokuBoard";
import produce from "immer";
import Timer from "./components/Timer";

function App() {
  const [sudoku, setSudoku] = useState([]);
  const [solved, setSolved] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [solvedTime, setsolvedTime] = useState("");

  const generateSudoku = () => {
    const raw = generator.makepuzzle();
    setIsActive(true);
    const result = { rows: [], solution: [], startTime: new Date() };
    result.solution = generator.solvepuzzle(raw);

    for (let i = 0; i < 9; i++) {
      const row = { cols: [], index: i };
      for (let j = 0; j < 9; j++) {
        const value = raw[i * 9 + j];
        const col = {
          row: i,
          col: j,
          value: value === null ? value : value + 1,
          readOnly: value !== null,
        };
        row.cols.push(col);
      }
      result.rows.push(row);
    }
    console.log(result);
    return result;
  };

  useEffect(() => {
    const result = generateSudoku();
    produce({}, () => {
      setSudoku(result);
    });
  }, []);

  const handleChange = (e) => {
    setSudoku(
      produce((sudoku) => {
        sudoku.rows[e.row].cols[e.col].value = e.value;
        setSolved(checkSolution());
      })
    );
  };

  const solveSudoku = (e) => {
    setSudoku(
      produce((sudoku) => {
        sudoku.rows.forEach((row) =>
          row.cols.forEach((col) => {
            if (!col.readOnly) {
              col.value = sudoku.solution[col.row * 9 + col.col] + 1;
            }
          })
        );
      })
    );
  };

  function checkSolution() {
    const candidate = sudoku.rows
      .map((row) => row.cols.map((col) => col.value))
      .flat();
    for (let i = 0; i < candidate.length; i++) {
      if (candidate[i] === null || candidate[i] - 1 !== sudoku.solution[i]) {
        return false;
      }
    }
    return true;
  }

  const handleSolve = (e) => {
    const check = checkSolution();
    const solvedTime = new Date().getTime() - sudoku.startTime.getTime();
    if (check) {
      const seconds = ("0" + Math.floor((solvedTime / 1000) % 60)).slice(-2);
      setSolved(true);
      setsolvedTime(seconds);
      setIsActive(false);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Sudoku App</h1>
      </div>
      <div className="container">
        <Timer isActive={isActive} />
        {solved && <h1>Congratulations! You solved it {solvedTime} </h1>}
        <SudokuBoard sudoku={sudoku} handleChange={handleChange} />
        <div className="actions">
          <button className="btn btn__solution" onClick={solveSudoku}>
            Solution
          </button>
          <button className="btn btn__check" onClick={handleSolve}>
            Check
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
