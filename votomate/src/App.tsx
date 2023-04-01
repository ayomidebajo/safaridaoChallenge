/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Modal from "react-modal";
import "./App.css";
import { useCallback, useEffect } from "react";
import {
  useInkathon,
  useRegisteredContract,
  contractQuery,
  unwrapResultOrDefault,
  contractTx,
} from "@scio-labs/use-inkathon";
import { Vote, VotingProposal } from "./types";
import ConnectButton from "./components/ConnectButton";
import { Button } from "@chakra-ui/react";
import Proposals from "./components/Proposals";
import {
  Card,
  CardBody,
  Text,
  Grid,
  GridItem,
  CircularProgress,
  CircularProgressLabel,
  Box,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import SubmitVote from "./components/SubmitVote";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "30%",
    width: "50%",
  },
};

const customStylesVote = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    // height: "20%",
    // width: "50%",
  },
};

interface Props {
  account: string | undefined;
  id: Number;
}

function App() {
  function openModal() {
    setModal(true);
  }

  function closeModal() {
    setModal(false);
  }

  function closeModalProposal() {
    setCreateProposalModal(false);
  }
  const { api, activeAccount, activeSigner } = useInkathon();
  const { contract } = useRegisteredContract("Voting");
  const [voteObject, setVoteObject] = useState<Array<VotingProposal>>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [props, setProps] = useState<Props>({ account: "", id: 0 });
  const [voters, setVoters] = useState<Array<string>>([]);
  const [createProposalModal, setCreateProposalModal] =
    useState<boolean>(false);

  const onClickSth = async () => {
    if (!api || !activeAccount || !activeSigner || !contract) return;
    const result = await contractQuery(
      api,
      activeAccount?.address,
      contract,
      "get",
      {}
    );

    const proposal = unwrapResultOrDefault(result, [] as VotingProposal[]);

    // console.log(voterss, "voterss");

    setVoteObject(proposal);

    let voteBars = {};
    // setVoters(voterss);
  };

  const getVotes = async () => {
    if (!api || !activeAccount || !activeSigner || !contract) return;

    const resultVoters = await contractQuery(
      api,
      activeAccount?.address,
      contract,
      "getRegisteredVoters",
      {}
    );
    const voterss = unwrapResultOrDefault(resultVoters, [] as string[]);

    setVoters(voterss);
  };

  console.log(voteObject, "voters");
  console.log(voters, "voterss");

  const createProposal = async () => {
    if (!name && !description) return;
    if (!api || !activeAccount || !activeSigner || !contract) return;
    let vote: Vote = {
      voter: activeAccount.address,
      vote: true,
      proposalId: Number(voteObject?.length),
      tokenId: 0,
    };
    let votingProposal: VotingProposal = {
      name: name,
      description: description,
      accepted: false,
      baseUri: "some txt",
      votes: [],
      proposer: activeAccount.address,
    };
    votingProposal.votes.push(vote);

    try {
      api.setSigner(activeSigner);
      await contractTx(
        api,
        activeAccount?.address,
        contract,
        "addProposal",
        {},
        [votingProposal],
        ({ status }) => {
          if (status.isInBlock) {
            toast.success("Proposal created successfully");
          }
        }
      );
    } catch (error) {
      console.log(error, "errors");
    }
  };

  // let props: Props = {};

  console.log(voteObject, "votes");

  return (
    <div className="App">
      <header className="">
        <ConnectButton />
        <Button
          onClick={() => {
            onClickSth();
            getVotes();
          }}
          colorScheme={"teal"}
          className="mb-2 mr-2"
        >
          Get
        </Button>
        <Button
          onClick={() => {
            onClickSth();
            getVotes();
            setCreateProposalModal(true);
          }}
          colorScheme={"teal"}
          className="mb-2 "
        >
          Create
        </Button>
        <h3>List of Proposals</h3>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {voteObject?.map((vote: VotingProposal, i) => {
            let num = 0;
            let callc = vote.votes.forEach((vote) => {
              if (vote.vote) {
                num++;
              }
              // return num;
            });
            let voteWins = {
              [i]: num,
            };
            console.log(voteWins, "voteWins");

            return (
              <>
                <GridItem>
                  <Card
                    variant="elevated"
                    size="lg"
                    align="flex-start"
                    className="mb-2"
                    key={i}
                  >
                    <CardBody>
                      <Grid templateColumns="repeat(2, 1fr)" gap={10}>
                        <div className="">
                          <Text align="start">Name: {vote.name}</Text>
                          <Text align="start">
                            Description: {vote.description}
                          </Text>
                          <Text align="start">
                            Accepted: {vote.accepted ? "true" : "false"}
                          </Text>

                          <Text align="start">
                            <Button
                              alignSelf="flex-start"
                              colorScheme={"teal"}
                              onClick={() => {
                                setModal(true);
                                setProps({
                                  account: activeAccount?.address,
                                  id: i,
                                });
                              }}
                            >
                              Vote
                            </Button>
                          </Text>
                        </div>
                        <Box
                          alignSelf="flex-end"
                          w="100%"
                          justifySelf="flex-end"
                          className=""
                        >
                          <CircularProgress
                            // alignItems="center"
                            alignSelf="flex-start"
                            value={num * 10}
                            max={30}
                            color="green.400"
                            size="100px"
                          >
                            <CircularProgressLabel>
                              {Math.floor((num / 3) * 100)}%
                            </CircularProgressLabel>
                          </CircularProgress>
                        </Box>
                      </Grid>
                    </CardBody>
                  </Card>
                </GridItem>
              </>
            );
          })}
        </Grid>

        <Modal
          isOpen={createProposalModal}
          onRequestClose={closeModalProposal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h3 className="mb-2">Create a proposal</h3>
          {/* <Card> */}
          <div className="display-block">
            <div className="flex">
              <p className="mr-2">Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="input"
                placeholder="add propsal"
                value={name}
                required
                title="Create a proposal"
              />
            </div>
            <div className="flex">
              <p className="mr-2">Description</p>
              <input
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                className="input"
                placeholder="Description"
                value={description}
                required
              />
            </div>
            <Button
              onClick={() => {
                createProposal();
                setName("");
                setDescription("");
                setCreateProposalModal(false);
              }}
              isDisabled={name.length < 1 && description.length < 1}
              // disabled={true}
              colorScheme={"teal"}
            >
              Create
            </Button>
          </div>
          {/* </Card> */}
        </Modal>

        <Modal
          isOpen={modal}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStylesVote}
          contentLabel="Example Modal"
        >
          <SubmitVote {...props} />
        </Modal>

        {/* {modal && } */}
      </header>
    </div>
  );
}

export default App;
