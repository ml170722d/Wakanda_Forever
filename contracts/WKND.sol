// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16 <0.9.0;

import "./ERC20Token.sol";

contract WKND is ERC20Token {
    string public constant name = "WakandaElectionToken";
    string public constant symbol = "WKND";
    uint8 public constant decimals = 0;

    uint256 public constant INITIAL_SUPPLY = 6 * (10**uint256(6));

    //----------------------------------------------------------------
    struct Candidate {
        uint256 votes;
        bool running;
    }
    mapping(address => Candidate) private candidats;
    address[] private candidatsAddresses;

    mapping(address => address) voteLog;

    event NewChallenger(address candidate);
    event CandidateAdded(address candidate);
    event VoteFor(address voter, address candidate);

    uint256 private constant TOP_LIST_SIZE = 3;
    address[] public topList;

    //----------------------------------------------------------------
    //----------------------------------------------------------------
    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function addCandidate(address _cand) external {
        require(
            candidats[_cand].running == false,
            "Candidate already in election"
        );
        Candidate memory c = Candidate(0, true);
        candidats[_cand] = c;
        candidatsAddresses.push(_cand);

        emit CandidateAdded(_cand);
    }

    function vote(address _cand, uint256 amount) external returns (address) {
        // check conditions
        require(voteLog[msg.sender] == address(0), "Alredy voted");
        require(this.balanceOf(msg.sender) >= 1, "Insufficient funds to vote");

        require(
            candidats[_cand].running == true,
            "Candidate is not in election"
        );
        require(_cand != msg.sender, "Candidates can't vote for themselves");

        // log voter choice
        voteLog[msg.sender] = _cand;
        candidats[_cand].votes += amount;

        this.transferFrom(msg.sender, _cand, amount);
        updateTopList(_cand);

        emit VoteFor(msg.sender, _cand);
    }

    function updateTopList(address _cand) internal {
        bool _emit = false;
        if (topList.length < 3) {
            topList.push(_cand);
            _emit = true;
        } else {
            bool isOnList = false;
            for (uint256 i = 0; i < topList.length; i++) {
                if (topList[i] == _cand) {
                    isOnList = true;
                    break;
                }
            }
            if (!isOnList) {
                if (
                    candidats[topList[TOP_LIST_SIZE - 1]].votes <
                    candidats[_cand].votes
                ) {
                    topList[TOP_LIST_SIZE - 1] = _cand;
                }
            }
        }
        if (_emit || sortList()) {
            emit NewChallenger(_cand);
        }
    }

    function sortList() internal returns (bool) {
        bool change = false;
        for (uint256 i = 0; i < topList.length - 1; i++) {
            for (uint256 j = i + 1; j < topList.length; j++) {
                if (candidats[topList[i]].votes < candidats[topList[j]].votes) {
                    address tmp = topList[i];
                    topList[i] = topList[j];
                    topList[j] = tmp;
                    change = true;
                }
            }
        }
        return change;
    }

    function winningCandidates()
        external
        view
        returns (address[] memory _list)
    {
        _list = topList;
    }

    function getCandidates() external view returns (address[] memory) {
        return candidatsAddresses;
    }

    function getAddress() external view returns (address) {
        return address(this);
    }
}
