pragma solidity ^0.5.0;

contract Decentragram {
  string public name = "Decentragram";


  //Store images  
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated(    
      uint id,  
      string hash,
      string description,
      uint tipAmount,
      address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount, 
    address payable author
  );

  //Create images
  function uploadImage(string memory _imgHash, string memory _description) public {
    //Make sure there is an image hash
    require(bytes(_imgHash).length > 0);

    //Make sure there is an image description
    require(bytes(_description).length > 0);

    //Make sure its a real address
    require(msg.sender != address(0x0));

    imageCount++;
    //Adds an image to the mapping
    images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);

    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
  }


  //Tip images
  function tipImageOwner(uint _id) public payable{
    //Make sure the id is valid
    require(_id > 0 && _id <= imageCount);

    //Fetch the image
    Image memory _image = images[_id];

    //Feth the author
    address payable _author = _image.author;

    //Pay the author by sending them ETH
    address(_author).transfer(msg.value);

    //Increment the tip amount
    _image.tipAmount += msg.value;

    //Update the image
    images[_id] = _image;

    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
  }
  
}