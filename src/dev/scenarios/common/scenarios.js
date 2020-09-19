import * as responses from "dev/api/responses/all";

import {
  clusterProperties,
  clusterStatus,
  getAvailResourceAgents,
  getFenceAgentMetadata,
  getResourceAgentMetadata,
  importedClusterList,
} from "./handlers";

export const dashboardScenario = clusterStatusResponsesMap => [
  importedClusterList(
    responses.importedClusterList.withClusters(
      Object.keys(clusterStatusResponsesMap).map(
        k => clusterStatusResponsesMap[k].cluster_name,
      ),
    ),
  ),
  clusterStatus(clusterStatusResponsesMap),
];

export const clusterRelatedScenario = [
  getAvailResourceAgents(responses.resourceAgentList.ok),
  getResourceAgentMetadata({
    "ocf:heartbeat:apache": responses.resourceAgentMetadata.ocfHeartbeatApache,
    "ocf:heartbeat:Dummy": responses.resourceAgentMetadata.ocfHeartbeatDummy,
  }),
  getFenceAgentMetadata(responses.fenceAgentMetadata.ok),
  clusterProperties(responses.clusterProperties.ok),
];
export const clusterScenario = clusterStatusResponsesMap => [
  ...dashboardScenario(clusterStatusResponsesMap),
  ...clusterRelatedScenario,
];
