// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ContractExecResult } from "@polkadot/types/interfaces";
import type { Registry, TypeDef } from "@polkadot/types/types";
import type { AbiMessage } from "@polkadot/api-contract/types";
// import { Proposals, ShorteningResult } from "../types";

export function getReturnTypeName(type: TypeDef | null | undefined) {
  return type?.lookupName || type?.type || "";
}

export function getDecodedOutput(
  result: ContractExecResult["result"],
  returnType: AbiMessage["returnType"],
  registry: Registry
): unknown[] | undefined {
  if (result.isOk) {
    const returnTypeName = getReturnTypeName(returnType);
    const r = (
      returnType
        ? registry
            .createTypeUnsafe(returnTypeName, [result.asOk.data])
            .toHuman()
        : "()"
    ) as unknown[];

    return r;
  }
  return undefined;
}

export const truncateHash = (
  hash: string | undefined,
  paddingLength = 6
): string | undefined => {
  if (!hash?.length) return undefined;
  if (hash?.length <= paddingLength * 2 + 1) return hash;
  return hash.replace(
    hash.substring(paddingLength, hash.length - paddingLength),
    "..."
  );
};
  