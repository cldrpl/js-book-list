class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
    //create table tow (tr) element
    //taking tr and appending html elements to it
    const row = document.createElement('tr');
    //Insert columns, template literal req's back ticks, adding delete button later
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className) {
        //Create div
        const div = document.createElement('div');
        //Add Classes, ${className} comes from function above
        div.className = `alert ${className}`;
        //Add text -> adds into, req doc.text, message from function
        div.appendChild(document.createTextNode(message));
        //get parent
        const container = document.querySelector('.container');
        //get form
        const form = document.querySelector('#book-form');
    
        //Insert Alert/ what we are inserting
        container.insertBefore(div, form);
    
        //Timeout after 3 seconds / removing the alert at 3 sec
        setTimeout(function(){
            document.querySelector('.alert').remove(); 
        }, 3000)
    }

    deleteBook(target) {
        if(target.className === 'delete') {
            //targeting a href for x which is inside a td 
            //-> to the parent of that tr for delete /DOM traversal
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

//Local Storage Class
class Store {
    //fetch from local storage, one method to avoid repititon
    static getBooks() {
        //local variable
        let books;
        if(localStorage.getItem('books') === null) {
            //books equals empty array
            books = [];
        } else {
            //need JS object so JSON.parse
            books = JSON.parse(localStorage.getItem('books'));
        }

        //simple return from local storage
        return books;
    }
    static displayBooks() {
        //copied from addBook
        const books = Store.getBooks();

        //loop through w/foreach
        books.forEach(function(book){
            //add into UI
            const ui = new UI;

            //add book to UI
            ui.addBookToList(book);
        })
    }

    //add book to local storage, had to add book
    //and put here so that it worked. w/out book it would
    //flash that it worked & not save to storage
    static addBook(book) {
        //using class Store since its static
        const books = Store.getBooks();

        books.push(book);

        //JSON stringify to save in local storage
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        //w/out this everytime you reload the page it brings back
        //older books even if deleted
        //from ui delete book, delete & remove parent
        //delete icon - to parent <a> tag & parent ISBN #
        
        const books = Store.getBooks();

        books.forEach(function(book, index){

            //if book isbn  = value being passed in, removing one
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

    localStorage.setItem('books', JSON.stringify(books));
    }
}

//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);


// Event listeners for adding book- listening for mouse click on the submit button
document.getElementById('book-form').addEventListener('submit', 
    function(e) {
        //get form values, if you have more than one const it errors out
        const title = document.getElementById('title').value,
              author = document.getElementById('author').value,
              isbn = document.getElementById('isbn').value

        //Instatiate book /using book constructors
        const book = new Book(title, author, isbn);

        //Instatiate UI
        const ui = new UI();

        console.log(ui);

        //validate -> if title equals blank etc
        if(title === '' || author === '' || isbn === '') {
            //error alert
            ui.showAlert('Please fill in all fields', 'error');
            
        } else {

        //show success
        ui.showAlert('Book Added!', 'success');

        //Add Book to list
        ui.addBookToList(book); 

        //Add to Local Storage LS
        Store.addBook(book);
      
        //clear feilds
        ui.clearFields();
        }

        e.preventDefault();
});

//Event Listener for delete, using the parent book-list/ e is bringing in the event
document.getElementById('book-list').addEventListener('click', function(e){

        //need to target the delete, that's done up above under the protype UI
        //Instatiate UI - I'm not sure why you have to call it a second time??
        const ui = new UI();

        //delete book
        ui.deleteBook(e.target);

        //remove from Local Storage, getting <a> tag's parent td
        //w/E6 we can go up a level and select it's sibling to get
        //the value that we need
        Store.removeBook(e.target.parentElement.previousElementSibling.
            textContent);

        //show message alert
        ui.showAlert('Book Removed!', 'success')

        e.preventDefault();
});