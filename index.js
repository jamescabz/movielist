////////////////////////////////////////////////////////////////////Initialization
//initialize global variable movieList to empty array 
let movieList = []; 

////////////////////////////////////////////////////////////////////creation of classes
//creating movie class
class Movies {
  constructor(title, year, review) {
    this.title = title;
    this.year = year;
    this.review = review;
  }
}

//creating user interface class
class UI {
  //input Movies
  static newInputMovie() {
    const title = document.querySelector('#title').value;
    const year = document.querySelector('#year').value;

    //if validation is true run other functions
    if (UI.inputValid(title, year) ) {
      UI.updateMovieList(title, year);
      UI.renderedList();
    }
    
    //clearing data of input fields
    UI.clearField();
  }

  //updating the value of movieList Array
  static updateMovieList(title, year) {
    const newMovie = new Movies(title, year, 'review'); //instantiate Movies
    movieList.push(newMovie);  
  }

  //rendering table to DOM and setting value of local storage
  static renderedList(){
    try {
      document.getElementById('table-body').remove();
    } catch (error) {
      console.log(error);
    }
    const body = document.createElement("TBODY")
    body.id = 'table-body';
    document.getElementById('table').appendChild(body);

    //writing to DOM
    movieList.forEach(movie => {
      const newRow = document.createElement('TR');
      newRow.innerHTML = `   
                <td>${movie.title}</td>
                <td>${movie.year}</td>
                <td class="lead text-center text-danger fw-bold" style="cursor: pointer" >x</td>`;
      document.getElementById('table-body').appendChild(newRow); 
    });
    
    //setting local storage
    Storage.setMovies(movieList);
  }

  static deleteMovie(e) {
    //traversing the DOM
    const title = e.target.previousElementSibling.previousElementSibling.textContent;
    const year= e.target.previousElementSibling.textContent
    
    //removing specific value of movieList Array
    movieList.forEach((movie, index)=> {    
      if (movie.title === title && movie.year === year) {
        movieList.splice(index,1);
        UI.warningMessage(`movie ${title} has been deleted`, `danger`);
      }
    });
    //rendering the new value of movieList after removal 
    UI.renderedList();
  }

  //user defined alert methods
  static warningMessage(msg, bgColor) {
    const div = document.createElement('div');
    div.setAttribute('class', `alert alert-${bgColor}`);
    div.innerHTML = msg;

    const container = document.querySelector('#container');
    const titleLabel = document.getElementById('title-label');
    container.insertBefore(div, titleLabel);
    setTimeout(()=> div.remove(),3000);
  }

  //validation of inputs (return true or false)
  static inputValid(title, year) {
    let valid = false;
    let isExist = movieList.some(movie => movie.title === title);
    
    if (!(title && year)) {
      UI.warningMessage(`please input a valid "Title" or "Year"`, `warning`);
    } else if(isExist) {
      UI.warningMessage(`movie ${title} already exist`, `warning`);
    } else {
      UI.warningMessage(`Movie ${title} Added`, `success`);
      valid = true;
    }
    return valid
  }

  //clearing data of input fields
  static clearField() {
    document.querySelector('#title').value = '';
    document.querySelector('#year').value = '';
  }
}

//creating storage class
class Storage {
  static getMovies() {
    let movies;
    if(localStorage.getItem('movies')=== null) {
      movies = [];
    } else {
      movies = JSON.parse(localStorage.getItem('movies'));
    }
    return movies;
  }
  static setMovies(movies) {
    localStorage.setItem('movies',JSON.stringify(movies));
  }
}

////////////////////////////////////////////////////////////////////Event handler
//onload window --> initialize movieList to local storage
window.onload = function() {
  movieList = Storage.getMovies();
  UI.renderedList();
}

//Add Movie Button Click
document.querySelector('#addMovie').addEventListener('click',UI.newInputMovie);

//Delete Movie Click
document.querySelector('#table').addEventListener('click', UI.deleteMovie);

///////////////////////////////////////////////////////////////
