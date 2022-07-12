// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./Ownable.sol" as ownable;



contract Library is ownable.Ownable {
    event AddedBook(string name, uint8 copies);
    event AddedCopies(string name, uint8 copies); 
    event BorrowBook(address user,string  name);
    event ReturnBook(address user, string name);

    struct Book{
        string name;
        uint8 copies;
    }
 
    mapping(address=> uint8) public currentlyBorrowing;
    mapping(uint8 => Book) public books;
    mapping(uint => mapping(address=>bool)) borrowedBooks;


    function AddBook(string calldata  _name,uint8 _id) external onlyOwner {
         Book storage book = books[_id];
         if(book.copies == 0)
        {
            book.name = _name;
            book.copies = 1;
        }   
        else
        {
            book.copies += 1;
        }
            emit AddedCopies(book.name, book.copies);
    }


    function borrowBook(uint8 _id) external{
        Book storage book = books[_id];
        require(book.copies > 0, "Book is not currently not available");
        if(!borrowedBooks[_id][msg.sender]){
            borrowedBooks[_id][msg.sender] = true;
        }
        --book.copies;
         emit BorrowBook(msg.sender,book.name);
    }
        

     function returnCurrentBook (uint8 _id)external{
       require(borrowedBooks[_id][msg.sender], "Not taken"); 
        borrowedBooks [_id][msg.sender] = false;
        Book storage book = books[_id];
        book.copies++;
        emit ReturnBook(msg.sender, book.name);
    
    }
}
