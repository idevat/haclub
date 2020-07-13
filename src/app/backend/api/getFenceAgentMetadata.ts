import * as t from "io-ts";

import { getJson } from "../calls";

import {
  ApiCall,
  createResult,
  dealWithInvalidJson,
  validateShape,
} from "../tools";

/*
TODO obsoletes
*/
const ApiAgentParameter = t.type({
  name: t.string,
  shortdesc: t.string,
  longdesc: t.string,
  default: t.union([t.null, t.string, t.number]),
  required: t.boolean,
  advanced: t.boolean,
  deprecated: t.boolean,
  deprecated_by: t.array(t.string),
  obsoletes: t.union([t.string, t.null]),
  pcs_deprecated_warning: t.string,
});

const ApiAgentMetadata = t.type({
  name: t.string,
  shortdesc: t.string,
  longdesc: t.string,
  parameters: t.array(ApiAgentParameter),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
const validate = (requestedAgentName: string, response: any) => {
  const errors = validateShape(response, ApiAgentMetadata);
  if (errors.length > 0) {
    return errors;
  }
  const agentMetadata: Result = response;
  if (agentMetadata.name !== requestedAgentName) {
    return [
      `Expected agent ${requestedAgentName} but got ${agentMetadata.name}`,
    ];
  }
  return [];
};

type Result = t.TypeOf<typeof ApiAgentMetadata>;

export const getFenceAgentMetadata: ApiCall<Result> = async (
  clusterUrlName: string,
  agentName: string,
) => {
  try {
    const raw = await getJson(
      `/managec/${clusterUrlName}/get_fence_agent_metadata`,
      [["agent", agentName]],
    );
    return createResult<Result>(raw, validate(agentName, raw));
  } catch (e) {
    return dealWithInvalidJson(e);
  }
};