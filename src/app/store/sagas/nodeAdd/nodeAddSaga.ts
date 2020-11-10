import { Action, NodeActions } from "app/store/actions";

import { api, lib, processError, put, race, take } from "../common";

export function* nodeAddSaga({
  payload: {
    clusterUrlName,
    nodeName,
    nodeAddresses,
    sbdWatchdog,
    sbdNoWatchdogValidation,
    sbdDevices,
  },
}: NodeActions["NodeAdd"]) {
  const { result }: { result: api.ResultOf<typeof api.lib.call> } = yield race({
    result: api.authSafe(api.lib.callCluster, {
      clusterUrlName,
      command: "cluster-add-nodes",
      payload: {
        nodes: [
          {
            name: nodeName,
            ...(nodeAddresses.length > 0 ? { addrs: nodeAddresses } : {}),
            ...(sbdDevices.length > 0 ? { devices: sbdDevices } : {}),
            ...(sbdWatchdog.length > 0 ? { watchdog: sbdWatchdog } : {}),
          },
        ],
        no_watchdog_validation: sbdNoWatchdogValidation,
      },
    }),
    cancel: take("NODE.ADD.CLOSE"),
  });
  
  if (!result) {
    // cancelled; we no longer care about the fate of the call
    return;
  }

  const taskLabel = `add node ${nodeName}`;
  const errorAction: Action = {
    type: "NODE.ADD.ERROR",
    payload: { clusterUrlName },
  };
  if (result.type !== "OK") {
    yield processError(result, taskLabel, {
      action: () => put(errorAction),
      useNotification: false,
    });
    return;
  }

  yield lib.clusterResponseSwitch(clusterUrlName, taskLabel, result.payload, {
    successAction: {
      type: "NODE.ADD.SUCCESS",
      payload: { clusterUrlName, reports: result.payload.report_list },
    },
    errorAction: {
      type: "NODE.ADD.FAILED",
      payload: { clusterUrlName, reports: result.payload.report_list },
    },
    communicationErrorAction: errorAction,
  });
}