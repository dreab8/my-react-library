import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {

//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()} >
//         {this.props.value}
//       </button>
//     );
//   }
// }

// class Board extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       squares: Array(9).fill(null),
//       xIsNext: true,
//     };
//   }

//   handleClick(i) {
//     const squares = this.state.squares.slice();
//     if (calculateWinner(squares) || squares[i]) {
//       return;
//     }
//     squares[i] = this.state.xIsNext ? 'X' : 'O';

//     this.setState({
//       squares: squares, 
//       xIsNext: !this.state.xIsNext,
//     });
//   }

//   renderSquare(i) {
//     return <Square 
//     value={this.state.squares[i]} 
//     onClick={() => this.handleClick(i)}
//     />;
//   }

//   render() {
//     const winner = calculateWinner(this.state.squares);
//     let status;
//     if (winner) {
//       status = 'Winner: ' + winner;
//     } else {
//       status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//     }

//     return (
//       <div>
//         <div className="status">{status}</div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }

// class Game extends React.Component {
//   render() {
//     return (
//       <div className="game">
//         <div className="game-board">
//           <Board />
//         </div>
//         <div className="game-info">
//           <div>{/* status */}</div>
//           <ol>{/* TODO */}</ol>
//         </div>
//       </div>
//     );
//   }
// }

// // ========================================

// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );

// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }
/*
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Andrea',
  lastName: 'Boriero'
};

// JSX, and it is a syntax extension to JavaScript. JSX produces React “elements”
// we declare a variable called name and then use it inside JSX by wrapping it in curly braces
// You can put any valid JavaScript expression inside the curly braces in JSX (JSX Prevents Injection Attacks)
// Babel compiles JSX down to React.createElement() calls.
const element = (
  <div>
  <h1>
    Hello, {formatName(user)}!
  </h1>
  <h2>Good to see you here.</h2>
  </div>
);
// JSX is an Expression Too, This means that you can use JSX inside of if statements and for loops
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}

ReactDOM.render(
  element,
  document.getElementById('root')
);

// The simplest way to define a component is to write a JavaScript function:
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);

// the following are equivalent  for defining a component
function Welcome1(props) {
  return <h1>Hello, {props.name}</h1>;
}

//  ES6 class is equivalent to the previous function but have some additional features 
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// Rendering components, the following component represent a DOM
const element1 = <div />;

// However, elements can also represent user-defined components, 
// it passes JSX attributes to this component as a single object. We call this object “props”.
const element2 = <Welcome name="Sara" />;
*/

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      books: []
    };
  }

  componentDidMount() {

    fetch("https://my-home-bookshelf.herokuapp.com/books")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            books: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, books } = this.state;
    if (error) {
      return <div>Error: {error.message} {books}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (

        <BookList books={this.state.books} />

      )

    }
  }
}

class BookList extends React.Component {
  render() {
    const books = this.props.books.map(book =>
      <Book key={book.id} book={book} authors={book.authors} />
    );
    return (
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Titolo</th>
            <th>Autori</th>
            <th>Genere</th>
          </tr>
          {books}
        </tbody>
      </table>
    )
  }
}

class Author extends React.Component {
  render() {
    return (
      <div id={this.props.authorName}>
        {this.props.authorName}
      </div>
    )
  }
}

class Book extends React.Component {
  render() {
    var authorName = "";
    var firsName = true;
    this.props.authors.map(author => {
      if (firsName) {
        authorName = author.name
        firsName = false;
      } else {
        authorName += " - " + author.name
      }
      return authorName;
    }
    );
    const authors = <Author key={authorName} authorName={authorName} />
    return (
      <tr>
        <td>{this.props.book.id}</td>
        <td>{this.props.book.title}</td>
        <td>{authors}</td>
        <td>{this.props.book.genre}</td>
      </tr >
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

