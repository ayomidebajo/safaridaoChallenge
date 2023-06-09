import React from "react";
import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Vote } from "../types";
import {
  useInkathon,
  useRegisteredContract,
  contractTx,
} from "@scio-labs/use-inkathon";
import { toast } from "react-hot-toast";
import { Radio, RadioGroup, Select} from "@chakra-ui/react";

export default function SubmitVote({ ...props }) {
  const { api, activeAccount, activeSigner } = useInkathon();
  const { contract } = useRegisteredContract("Voting");
  const [chooseVote, setChooseVote] = useState<string>("1");
  const [vote, setVote] = useState<boolean>(true);

  const getVoters = async () => {
    if (!api || !activeAccount || !activeSigner || !contract) return;
  };

  useEffect(() => {
    getVoters();
  }, []);

  // console.log(voters, "props");

  const createProposal = async () => {
    // if (!name && !description) return;
    if (!api || !activeAccount || !activeSigner || !contract) return;
    let voteSubmit: Vote = {
      voter: props.account,
      vote: vote,
      proposalId: props.id,
      tokenId: 0,
    };

    // todo: add token id using dropdown

    try {
      api.setSigner(activeSigner);
      await contractTx(
        api,
        activeAccount?.address,
        contract,
        "vote",
        {},
        [voteSubmit],
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

  return (
    <>
      <h4>Vote for Proposal</h4>
      <div className="display-block">
        <div className="flex">
          <RadioGroup
            onChange={(e) => {
              setChooseVote(e);
              console.log(e, "chui");

              setVote(e === "1" ? true : false);
            }}
            value={chooseVote}
          >
            <Radio value="1">Aye</Radio>
            <Radio value="2">Nay</Radio>
          </RadioGroup>

          <Select placeholder="Select Symbol">
            <option value="BON">BON</option>
            <option value="NOB">NOB</option>
            <option value="OBN">OBN</option>
          </Select>
        </div>
        <Button
          onClick={() => {
            createProposal();
            setChooseVote("1");
            // setDescription("");
          }}
          colorScheme={"teal"}
        >
          Submite vote
        </Button>
      </div>
    </>
  );
}
