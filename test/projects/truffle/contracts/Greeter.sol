pragma solidity >=0.6.0 <0.7.0;


contract Greeter {
    string greeting;
    event NewGreeting(string _greeting);

    constructor(string memory _greeting) public {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
        emit NewGreeting(_greeting);
    }
}
