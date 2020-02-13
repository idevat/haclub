import {
  failMessage,
  isUnauthorizedError,
} from "./errors";
import {
  getForText,
  postForText,
} from "./calls";

import { authGuiAgainstNodes } from "./authGuiAgainstNodes";
import { checkAuthAgainstNodes } from "./checkAuthAgainstNodes";
import { existingCluster } from "./existingCluster";
import { clusterStatus } from "./clusterStatus";
import { clustersOverview } from "./clustersOverview";
import { getResourceAgentMetadata } from "./getResourceAgentMetadata";
import { updateResource } from "./updateResource";
import {
  ApiResponse as ApiResponseType,
  ApiResult as ApiResultType,
  ApiCall as ApiCallType,
} from "./tools";

export type ApiResponse<T> = ApiResponseType<T>;
export type ApiResult<T> = ApiResultType<T>;
export type ApiCall<T> = ApiCallType<T>;


export {
  failMessage,
  isUnauthorizedError,
  getForText,
  postForText,

  authGuiAgainstNodes,
  checkAuthAgainstNodes,
  existingCluster,
  getResourceAgentMetadata,
  clusterStatus,
  clustersOverview,
  updateResource,
};