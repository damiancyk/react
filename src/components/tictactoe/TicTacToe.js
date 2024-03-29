import React from "react";
import Button from "@material-ui/core/Button";
import "./TicTacToe.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(i) {
    const startNumber = i * 3;
    let cells = [];
    for (let i = 0; i < 3; i++) {
      cells.push(this.renderSquare(startNumber + i));
    }

    return (
      <div key={startNumber} className="board-row">
        {cells}
      </div>
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push(this.renderRow(i));
    }

    return <div>{rows}</div>;
  }
}

export default class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          pos: null
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  getPositionX(i) {
    return i % 3;
  }

  getPositionY(i) {
    return Math.floor(i / 3);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          pos: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Done move #" +
          move +
          " (" +
          this.getPositionX(step.pos) +
          "," +
          this.getPositionY(step.pos) +
          ")"
        : "Game started";
      return (
        <li key={move} className={this.state.stepNumber === move ? "bold" : ""}>
          <Button
            onClick={() => this.jumpTo(move)}
            variant="contained"
            color="primary"
          >
            {desc}
          </Button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
