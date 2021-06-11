public with sharing class LibraryBook {
    @AuraEnabled
    public static List<Book__c> getBooks(String searchType, String searchValue){
        try{
            String query = 'SELECT Id, Title__c, Author__c, Category__c, Status__c FROM Book__c WHERE ' + searchType + ' ' + 'Like ' + '\'' +'%'+searchValue+'%' + '\'';
            System.debug('Dynamic Search Query ' + query);
            List<Book__c> listOfBooks = Database.query(query);
            return listOfBooks;           
        }
        catch(Exception e){
            throw e;
        }
    }

    @AuraEnabled
    public static List<Book__c> getBorrowedBooks(){
        try{
            String query = 'SELECT Id, Title__c, Author__c, Category__c, Status__c FROM Book__c WHERE Status__c ' + 'Like ' + '\'' +'%BORROWED%' + '\'';
            List<Book__c> listOfBooks = Database.query(query);
            System.debug('Dynamic Search Query ' + listOfBooks);
            return listOfBooks;           
        }
        catch(Exception e){
            throw e;
        }
    }

    @AuraEnabled
    public static List<Book_Borrow_Info__c> getBorrowedBooksUser(){
        try{
            List<Book_Borrow_Info__c> listOfBorrowedBooks =  [SELECT Id,Book__r.Id,Book__r.Name,Book__r.Status__c, User__c, Issued_Date__c, Return_Date__c, Is_Borrow_Active__c FROM Book_Borrow_Info__c];
            return listOfBorrowedBooks;           
        }
        catch(Exception e){
            throw e;
        }
    }

    @AuraEnabled
    public static String returnBooks(List<Book__c> books, Id currentUser){
      System.debug('Current User : '+books);
        try{
            System.debug('Current User : '+currentUser);
            System.debug('Current User : '+books);
        List<Book__c> updateBooks = new List<Book__c>();
        List<Book_Borrow_Info__c> borrowBookInfos = new List<Book_Borrow_Info__c>();
        for(Book__c b : books){
            Book__c updateBook = new Book__c();
            Book_Borrow_Info__c borrowBookInfo = new Book_Borrow_Info__c();
            updateBook.Id = b.Id;
            updateBook.Status__c = 'AVAILABLE';
            updateBooks.add(updateBook);
            System.debug('Book to be updated ' + updateBook.Id);
            borrowBookInfo.Return_Date__c = Date.today();
            borrowBookInfo.Is_Borrow_Active__c = false;
            borrowBookInfos.add(borrowBookInfo);
        }
        update updateBooks;
        insert borrowBookInfos; 
        }
        catch(Exception e){
            throw e;
        }
        return 'Success';
    }
    


   
    @AuraEnabled
    public static String borrowBooks(List<Book__c> books, Id currentUser){
        try{
            System.debug('Current User : '+currentUser);
        List<Book__c> updateBooks = new List<Book__c>();
        List<Book_Borrow_Info__c> borrowBookInfos = new List<Book_Borrow_Info__c>();
        for(Book__c b : books){
            Book__c updateBook = new Book__c();
            Book_Borrow_Info__c borrowBookInfo = new Book_Borrow_Info__c();
            updateBook.Id = b.Id;
            updateBook.Status__c = 'Borrowed';
            updateBooks.add(updateBook);
            System.debug('Book to be updated ' + updateBook.Id);
            System.debug('Book to be updated ' + borrowBookInfo.Book__c);
            borrowBookInfo.Book__c = b.Id;
            borrowBookInfo.User__c = currentUser;
            borrowBookInfo.Is_Borrow_Active__c = true;
            borrowBookInfo.Issued_Date__c = Date.today();
            borrowBookInfo.Return_Date__c = Date.today() + 14;
            borrowBookInfos.add(borrowBookInfo);
        }
        update updateBooks;
        insert borrowBookInfos;   
        }
        catch(Exception e){
            throw e;
        }
        return 'Success';
    }
}
