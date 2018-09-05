//create book constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

//create UI constructor, add book, most of the work
function UI() {}

//Add Book to list
UI.prototype.addBookToList = function(book) {
    //getting the ID that we named from Index
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

//Show alert
UI.prototype.showAlert = function(message, className) {
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

//Delete Book, had to add =function and put the target there
UI.prototype.deleteBook = function(target){
    if(target.className === 'delete') {
        //targeting a href for x which is inside a td 
        //-> to the parent of that tr for delete /DOM traversal
        target.parentElement.parentElement.remove();
    }
}

//clear fields -> setting values to blank
UI.prototype.clearFields = function() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}

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

        //validate -> if title equals blank etc
        if(title === '' || author === '' || isbn === '') {
            //error alert
            ui.showAlert('Please fill in all fields', 'error');
            
        } else {

        //show success
        ui.showAlert('Book Added!', 'success');

        //Add Book to list
        ui.addBookToList(book); 
      
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

        //show message alert
        ui.showAlert('Book Removed!', 'success')

        e.preventDefault();
});