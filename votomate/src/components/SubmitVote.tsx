import React from "react";
import { Card, Button } from "@chakra-ui/react";
import { useState } from "react";
import { Vote } from "../types";
import {
  useInkathon,
  useRegisteredContract,
  contractTx,
} from "@scio-labs/use-inkathon";
import { toast } from "react-hot-toast";
import { Radio, RadioGroup } from "@chakra-ui/react";

export default function SubmitVote({ ...props }) {
  // const [name, setName] = useState("");
  // const [description, setDescription] = useState("");
  const { api, activeAccount, activeSigner } = useInkathon();
  const { contract } = useRegisteredContract("Voting");
  const [chooseVote, setChooseVote] = useState<string>("1");
  const [vote, setVote] = useState<boolean>(true);

  // console.log(props, "props");

  const createProposal = async () => {
    // if (!name && !description) return;
    if (!api || !activeAccount || !activeSigner || !contract) return;
    let voteSubmit: Vote = {
      voter: props.account,
      vote: vote,
      proposalId: props.id,
      tokenId: 0,
    };

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
    <Card>
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
            {/* <Stack direction="row"> */}
            <Radio value="1">Aye</Radio>
            <Radio value="2">Nay</Radio>
            {/* </Stack> */}
          </RadioGroup>
        </div>
        <Button
          onClick={() => {
            createProposal();
            setChooseVote("1");
            // setDescription("");
          }}
          colorScheme={"teal"}
        >
          Create
        </Button>
      </div>
    </Card>
  );
}
