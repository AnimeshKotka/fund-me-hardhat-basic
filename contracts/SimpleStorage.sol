// SPDX-License-Identifier: MIT
// 0xA32eEBf4553b67407892C3da3543b030Bdc9a2D8
pragma solidity ^0.8.7;

contract SimpleStorage {
    uint256 favNumber;

    struct People {
        uint256 number;
        string name;
    }

    People[] public people;

    mapping(string => uint256) public personMapping;

    // Stack, memory, storage, call data, logs, code -> need this to store the values
    // calldata -> it is temp var which can not be modified
    // memory -> it is temp var which can be modified
    // storage -> it will stay to scope after it ended like global var (parmanent, can't be modified)
    // Here memory we need because sol can't add memory to array, struct and maps
    function addPeople(string memory _name, uint256 _number) public {
        people.push(People(_number, _name));
        personMapping[_name] = _number;
    }

    function store(uint256 _favNumber) public virtual {
        favNumber = _favNumber;
    }

    function retrive() public view returns (uint256) {
        return favNumber;
    }
}
