// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ComplaintSystem {

    address public admin;

    enum Status   { Pending, InProgress, Resolved }
    enum Category { Hostel, Mess, Academics, Infrastructure, Other }

    struct Complaint {
        uint     id;
        address  student;
        string   title;
        string   description;
        Category category;
        bool     isAnonymous;
        Status   status;
        uint     timestamp;
    }

    Complaint[] public complaints;
    mapping(address => uint[]) private studentComplaints;

    event ComplaintSubmitted(uint id, address indexed student, string title);
    event StatusUpdated(uint indexed id, Status newStatus);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function submitComplaint(
        string   memory _title,
        string   memory _description,
        Category        _category,
        bool            _isAnonymous
    ) public {
        uint id = complaints.length;
        complaints.push(Complaint({
            id:          id,
            student:     _isAnonymous ? address(0) : msg.sender,
            title:       _title,
            description: _description,
            category:    _category,
            isAnonymous: _isAnonymous,
            status:      Status.Pending,
            timestamp:   block.timestamp
        }));
        studentComplaints[msg.sender].push(id);
        emit ComplaintSubmitted(id, msg.sender, _title);
    }

    function updateComplaintStatus(uint _id, Status _status) public onlyAdmin {
        require(_id < complaints.length, "Invalid complaint ID");
        complaints[_id].status = _status;
        emit StatusUpdated(_id, _status);
    }

    function getAllComplaints() public view returns (Complaint[] memory) {
        return complaints;
    }

    function getMyComplaints() public view returns (Complaint[] memory) {
        uint[] memory ids = studentComplaints[msg.sender];
        Complaint[] memory result = new Complaint[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            result[i] = complaints[ids[i]];
        }
        return result;
    }

    function getComplaintById(uint _id) public view returns (Complaint memory) {
        require(_id < complaints.length, "Invalid complaint ID");
        return complaints[_id];
    }

    function getComplaintCount() public view returns (uint) {
        return complaints.length;
    }

    function getStats() public view returns (uint pending, uint inProgress, uint resolved) {
        for (uint i = 0; i < complaints.length; i++) {
            if      (complaints[i].status == Status.Pending)    pending++;
            else if (complaints[i].status == Status.InProgress) inProgress++;
            else if (complaints[i].status == Status.Resolved)   resolved++;
        }
    }
}
