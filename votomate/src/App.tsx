/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import logo from "./logo.svg";
import { useApi, useExtension, useCall } from "useink";
import { useLinkContract } from "./contexts/LinkContract";
import { getReturnTypeName } from "./helpers";
import { EstimationProvider } from "./contexts/Estimation";
import { getDecodedOutput } from "./helpers";
import type {
  DispatchError,
  ContractExecResult,
} from "@polkadot/types/interfaces";
import "./App.css";
import { useCallback } from "react";
import { useDryRun } from "./hooks/useDryRun";
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
import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { toast } from "react-hot-toast";

function App() {
  // const { api } = useApi();
  // const { contract } = useLinkContract();
  // const { account } = useExtension();
  const { api, activeAccount, activeSigner } = useInkathon();
  const { contract } = useRegisteredContract("Voting");
  const [voteObject, setVoteObject] = useState<Array<VotingProposal>>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);

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
    setVoteObject(proposal);
  };

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

  console.log(voteObject, "votes");

  return (
    <div className="App">
      <header className="">
        <ConnectButton />
        <Button onClick={onClickSth} colorScheme={"teal"}>
          Get
        </Button>
        {/* <Proposals /> */}
        <h3>List of Proposals</h3>
        {voteObject?.map((vote: VotingProposal, i) => (
          <Card align="flex-start" className="mb-2" key={i}>
            <CardBody>
              {/* <Text> */}
              <p>Name: {vote.name}</p>
              <p>Description: {vote.description}</p>
              <p>Accepted: {vote.accepted ? "true" : "false"}</p>

              <Button colorScheme={"teal"} onClick={(e) => setModal(true)}>
                Vote
              </Button>
              {/* </Text> */}
            </CardBody>
          </Card>
          // <div key={i}>

          // </div>
        ))}

        <h3>Create a proposal</h3>
        <Card>
          <div className="display-block">
            <div className="flex">
              <p className="mr-2">Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="input"
                placeholder="add propsal"
                value={name}
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
              />
            </div>
            <Button
              onClick={() => {
                createProposal();
                setName("");
                setDescription("");
              }}
              colorScheme={"teal"}
            >
              Create
            </Button>
          </div>
        </Card>
      </header>
    </div>
  );
}

export default App;
