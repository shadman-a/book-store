import { LightningElement, track } from 'lwc';
import getBorrowedBooks from '@salesforce/apex/LibraryBook.getBorrowedBooks';
import returnBooks from '@salesforce/apex/LibraryBook.returnBooks';
import Id from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BorrowedBooks extends LightningElement {
  @track listOfBooks;

  columns = [
    { label: 'Title', fieldName: 'Title__c', type: 'text'},
    { label: 'Author', fieldName: 'Author__c', type: 'text'},
    { label: 'Status', fieldName: 'Status__c', type: 'text'},
];
connectedCallback() {
  getBorrowedBooks()
  .then((result) => {
    this.listOfBooks = result;
    //   if (result) {
    //     let preparedBooks = [];
    //     result.forEach(book => {
    //       console.log(book)
    //         let preparedBook = {};
    //         preparedBook.Book_Id = book.Book__r.Id;
    //         preparedBook.Book_Title = book.Book__r.Title__c;
    //         preparedBook.Book_Status = book.Book__r.Status__c;
    //         preparedBooks.push(preparedBook);
    //         console.log("thisisit",preparedBooks[0].Book_Title)
    //     });
    //     console.log("book", this.listOfBooks)
    // }
    // if (result.error) {
    //     this.error = result.error;
    // }
  })
}


handleReturnBook(){
  console.log('current user extracted is ' + Id);
  console.log('hello',this.selectedBooks)
  returnBooks({ books: this.selectedBooks, currentUser: Id})
      .then((result) => {
          this.error = undefined;
          const evt = new ShowToastEvent({
              title: result,
              message: 'Book Returned Successfully',
              variant: 'Success',
          });
          this.dispatchEvent(evt);
          //calling handle search book to refresh the grid.
          this.connectedCallback();
      })
      .catch((error) => {
          //dispatch error toaster
          this.error = error;
          
      });
}

getSelectedName(event) {
  this.selectedBooks = event.detail.selectedRows;
  // Display that fieldName of the selected rows
  //for (let i = 0; i < selectedRows.length; i++){
    //  alert("You selected: " + selectedRows[i].Name);
  //}
}


}