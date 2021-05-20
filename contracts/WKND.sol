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
        // int8 place;
        uint256 votes;
        bool running;
    }
    mapping(address => Candidate) private candidats;
    address[] private candidatsAddresses;

    mapping(address => address) voteLog;

    event NewChallenger(address candidate);
    event CandidateAdded(address candidate);
    event VoteFor(address candidate);

    uint256 private constant TOP_LIST_SIZE = 3;
    uint256[TOP_LIST_SIZE] public voteNum;

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
        require(this.balanceOf(msg.sender) >= 1, "Insufficient funds to vote");
        require(voteLog[msg.sender] == address(0), "Alredy voted");

        require(_cand != msg.sender, "Candidates can't vote");
        require(
            candidats[_cand].running == true,
            "Candidate is not in election"
        );

        // log voter choice
        voteLog[msg.sender] = _cand;
        candidats[_cand].votes += amount;

        this.transferFrom(msg.sender, _cand, amount);
        updateTopList(_cand);

        emit VoteFor(_cand);
    }

    function updateTopList(address _cand) internal {
        for (uint256 i = 0; i < voteNum.length; i++) {
            if (voteNum[i] < candidats[_cand].votes) {
                uint256 tmp = voteNum[i];
                voteNum[i] = candidats[_cand].votes;
                for (uint256 j = i + 1; j < voteNum.length; j++) {
                    uint256 tmp2 = voteNum[j];
                    voteNum[j] = tmp;
                    tmp = tmp2;
                }

                emit NewChallenger(_cand);
                break;
            }
        }
    }

    function winningCandidates()
        external
        view
        returns (address[TOP_LIST_SIZE] memory _list)
    {
        uint256 index = 0;
        for (uint256 i = 0; i < voteNum.length; i++) {
            for (uint256 j = 0; j < candidatsAddresses.length; j++) {
                if (voteNum[i] == candidats[candidatsAddresses[j]].votes) {
                    _list[index++] = candidatsAddresses[j];
                    break;
                }
            }
        }
    }
}
