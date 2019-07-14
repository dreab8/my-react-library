import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';

import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      title: '',
      author: '',
      books: []
    };
    this.handlerSearchByTitle = this.handlerSearchByTitle.bind(this);
    this.handlerSearchByAuthor = this.handlerSearchByAuthor.bind(this);
    this.handlerSearchAllBooks = this.handlerSearchAllBooks.bind(this);
  }

  handlerSearchAllBooks() {
    this.setState({ title: '', author: '' })
    this.getData("https://my-home-bookshelf.herokuapp.com/books")
  }

  handlerSearchByTitle(searchtitle) {
    if (searchtitle) {
      this.setState({ title: searchtitle, author: '' })
      this.getData("https://my-home-bookshelf.herokuapp.com/book/title/" + searchtitle)
    }
  }

  handlerSearchByAuthor(searchAuthor) {
    if (searchAuthor) {
      this.setState({ author: searchAuthor, title: '' })
      this.getData("https://my-home-bookshelf.herokuapp.com/books/author/" + searchAuthor)
    }
  }

  getData(fetchUrl) {
    fetch(fetchUrl)
      .then(res => res.json())
      .then(
        (result) => {
          if (result == null) {
            this.setState({
              isLoaded: true,
              books: []
            });
          } else {
            this.setState({
              isLoaded: true,
              books: result
            });
          }
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

  componentDidMount() {
    this.getData("https://my-home-bookshelf.herokuapp.com/books")
  }

  render() {
    const { error, isLoaded, books } = this.state;
    if (error) {
      return <div>Error: {error.message} {books}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <Helmet>
            <title>La mia Liberia</title>
          </Helmet>
          <SearchBooksByTitle action={this.handlerSearchByTitle} />
          <SearchBooksByAuthor action={this.handlerSearchByAuthor} />
          <SearchAllBooks action={this.handlerSearchAllBooks} />
          <BookList books={this.state.books} title={this.state.title} author={this.state.author} />
        </div>
      )
    }
  }
}

class SearchBooksByTitle extends React.Component {

  constructor(props) {
    super(props);

    this.state = { title: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.action(this.state.title)
    this.setState({ title: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Title:
          <input type="text" value={this.state.title} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Cerca" />
      </form>
    );
  }
}

class SearchAllBooks extends React.Component {
  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress(event) {
    event.preventDefault();
    this.props.action()
  }

  render() {
    return(
          <button onClick={this.handlePress}>Mostra tutti i libri</button>       
    )
  }
}

class SearchBooksByAuthor extends React.Component {

  constructor(props) {
    super(props);

    this.state = { author: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ author: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.action(this.state.author)
    this.setState({ author: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Nome Autore:
          <input type="text" value={this.state.author} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Cerca" />
      </form>
    );
  }
}

class BookList extends React.Component {
  render() {
    const books = this.props.books.map(book =>
      <Book key={book.id} book={book} authors={book.authors} />
    );
    var search = '';
    if (this.props.title) {
      search = "Libri il cui titolo contiene " + this.props.title
    } else if (this.props.author) {
      search = "Libri scritto dall'autore " + this.props.author
    }

    if (books.length > 0) {
      return (
        <div>
          <h2>{search}</h2>
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
        </div>
      )
    }
    else {
      return (
        <div>
          <h1>{search}</h1>
          <h1>Non e' stato trovato alcun libro</h1>
        </div>
      )
    }
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

