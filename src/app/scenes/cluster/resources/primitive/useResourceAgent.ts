import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Action, selectors } from "app/store";

export const useResourceAgent = (clusterUrlName: string, agentName: string) => {
  const resourceAgent = useSelector(
    selectors.getPcmkAgent(clusterUrlName, agentName),
  );
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (!resourceAgent) {
      dispatch<Action>({
        type: "RESOURCE_AGENT.LOAD",
        payload: { agentName, clusterUrlName },
      });
    }
  }, [agentName, clusterUrlName, dispatch, resourceAgent]);
  return {
    resourceAgent,
  };
};
