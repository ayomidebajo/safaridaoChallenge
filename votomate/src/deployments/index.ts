// import { ContractID } from "@/types/Contracts";
import { SubstrateDeployment, alephzeroTestnet} from "@scio-labs/use-inkathon";
import { contractAddress } from "../const";

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  return [
    {
      contractId: "Voting",
      networkId: alephzeroTestnet.network,
      abi: await import("../metadata/voting.json"),
      address: contractAddress,
    },
    // {
    //   contractId: ContractID.StakeholderRegistry,
    //   networkId: alephzeroTestnet.network,
    //   abi: await import("./metadatas/stakeholder_registry.json"),
    //   address: "5ChNmSJBnqTLk53m58UPBSWnZsNfuxUuK9iVL7jYzEui1E1T",
    // },
    // {
    //   contractId: ContractID.Transactions,
    //   networkId: alephzeroTestnet.network,
    //   abi: await import("./metadatas/transactions.json"),
    //   address: "5Eq5QV565YesEPGSRxC8VoXGzXCjgRF3pmYhrjaFnc7PHXSA",
    // },
  ];
};
