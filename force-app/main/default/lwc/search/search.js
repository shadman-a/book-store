import { LightningElement, track } from 'lwc';
import searchBooks from '@salesforce/apex/LibraryBook.getBooks';
import borrowBooks from '@salesforce/apex/LibraryBook.borrowBooks';
import Id from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SearchBooks extends LightningElement {
    @track listOfBooks;
    searchValue;
    searchType = 'Title__c';    
    selectedBooks = [];
    error;


    handleSearchBook(){
        console.log('Search Type ' + this.searchType);
        console.log('Search Value ' + this.searchValue);
        //Call Apex method imperatively
        searchBooks({ searchType: this.searchType, searchValue: this.searchValue })
            .then((result) => {
                console.log(result);
                this.listOfBooks = result;
                this.error = undefined; 
            })

            .catch((error) => {
                this.error = error;
                this.listOfBooks = undefined;
            }); 
    }


    //on change in the search text, capturing the latest search value
     searchKeyword(event){
        this.searchValue = event.target.value;
    } // end of searchKey onChange

    //Radio Button Display options
    get options() {
        return [
            { label: 'Id', value: 'Id' },
            { label: 'Title', value: 'Title__c' },
            { label: 'Author', value: 'Author__c' },
            { label: 'Category', value: 'Category__c' }
        ];
    }

    handleRadioChange(event) {
        this.searchType = event.detail.value;
    }
    //On click of Borrow Button function to act
    handleBorrowBook(){
        console.log('current user extracted is ' + Id);
        borrowBooks({ books: this.selectedBooks, currentUser: Id})
            .then((result) => {
                this.error = undefined;
                const evt = new ShowToastEvent({
                    title: result,
                    message: 'Book Borrowed Successfully',
                    variant: 'Success',
                });
                this.dispatchEvent(evt);
                //calling handle search book to refresh the grid.
                this.handleSearchBook();
            })
            .catch((error) => {
                //dispatch error toaster
                this.error = error;  
            });
    }


    getSelectedName(event) {
        console.log(this.selectedBooks)
        if (event.target.dataset.status === "BORROWED" || event.target.dataset.status === "OVERDUE") {
            alert("This Book is Unavailble");
        } else if (event.target.dataset.status === "AVAILABLE" ) {
            const json = `{"Author__c":"${event.target.dataset.author}", "Id":"${event.target.dataset.id}", "Status__c":"${event.target.dataset.status}", "Title__c":"${event.target.dataset.title}"}`
            const obj = JSON.parse(json)
            if (this.selectedBooks.includes(obj)){
                (this.selectedBooks.pop())  
                console.log("hello",obj)
            } else (this.selectedBooks.push(obj));
        }
        
        
        this.template.querySelector('.elementHoldingHTMLContent').innerHTML = `<p>You selected ${this.selectedBooks.length} Books</p>`
        
    }
    
} // end of class
