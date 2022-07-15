 const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("first", function () {
  it("Deploy", async function () {
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();
  });

  it("Get owner addresses", async function () {
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();
    await library.deployed();

    const [_owner, addr1, addr2] = await ethers.getSigners();
    const owner = await library.owner();
    await owner;
  });
  describe("Add book", function () {
    it("AddBook once and check", async function () {
      const Library = await ethers.getContractFactory("Library");
      const library = await Library.deploy();
      await library.deployed();

      const AddBook = await library.AddBook("The godfather", 2);
      await AddBook.wait();
    });

    it("Non owner try to add book", async function () {
      const [_owner, addr1, addr2] = await ethers.getSigners();
      const Library = await ethers.getContractFactory("Library");
      const library = await Library.deploy();
      await library.deployed();

      const addBook = await library.connect(_owner).AddBook("The Godfather", 2);
      await addBook.wait();
      var err = false;
      try {
        const addSecondBook = await library
          .connect(addr1)
          .AddBook("THE GODFATHER ", 2);
        await addSecondBook.wait();
      } catch (error) {
        err = true;
        expect(error.name).to.equals("Error");
      }
    });
  });
  describe("Borrow book", function () {
    it("Should borrow a book", async function () {
      const Library = await ethers.getContractFactory("Library");
      const library = await Library.deploy();
      await library.deployed();

      const AddBook = await library.AddBook("The Godfather", 2);
      await AddBook.wait();

      const borrowBook = await library.borrowBook(
        ethers.utils.solidityKeccak256(
          ["bytes"],
          [ethers.utils.solidityPack(["string"], ["The Godfather"])]
        )
      );
      await borrowBook.wait();
    });

    it("BorrowBook for second borrowing", async function () {
      const Library = await ethers.getContractFactory("Library");
      const library = await Library.deploy();
      await library.deployed();

      const addBook = await library.AddBook("The Godfather", 2);
      await addBook.wait();

      const borrowBook = await library.borrowBook(
        ethers.utils.solidityKeccak256(
          ["bytes"],
          [ethers.utils.solidityPack(["string"], ["The Godfather"])]
        )
      );
      await borrowBook.wait();
      var err = false;
      try {
        await library.borrowBook(3);
      } catch (error) {
        err = true;
        expect(error.name).to.equals("Error");
      }
      expect(err).to.equal(true);
    });

    describe("Return a book", function () {
      it("Should return a book", async function () {
        const Library = await ethers.getContractFactory("Library");
        const library = await Library.deploy();
        await library.deployed();

        const AddBook = await library.AddBook("The Godfather", 2);
        await AddBook.wait();
        const borrowBook = await library.borrowBook(
          ethers.utils.solidityKeccak256(
            ["bytes"],
            [ethers.utils.solidityPack(["string"], ["The Godfather"])]
          )
        );
        await borrowBook.wait();

        const returnCurrentBook = await library.borrowBook(
          ethers.utils.solidityKeccak256(
            ["bytes"],
            [ethers.utils.solidityPack(["string"], ["The Godfather"])]
          )
        );
        await returnCurrentBook.wait();
      });

      it(" Should NOT be able to return book if it was not taken", async function () {
        const Library = await ethers.getContractFactory("Library");
        const library = await Library.deploy();
        await library.deployed();

        const AddBook = await library.AddBook("The Godfather", 2);
        await AddBook.wait();

        await library.borrowBook(
          ethers.utils.solidityKeccak256(
            ["bytes"],
            [ethers.utils.solidityPack(["string"], ["The Godfather"])]
          )
        );
        await expect(
          library.returnCurrentBook(
            ethers.utils.solidityKeccak256(
              ["bytes"],
              [ethers.utils.solidityPack(["string"], ["The Godfather"])]
            )
          )
        );
      });
    });
  });
});
