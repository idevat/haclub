import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";

import { useDispatch } from "app/store";
import { Link } from "app/view";

export const ClusterDetailBreadcrumb: React.FC<{ clusterName: string }> = ({
  clusterName,
}) => {
  const dispatch = useDispatch();
  return (
    <Breadcrumb>
      <BreadcrumbItem component="span">
        <Link to="/">Clusters</Link>
      </BreadcrumbItem>
      <BreadcrumbItem
        isActive
        onClick={() =>
          dispatch({
            type: "CLUSTER.STATUS.REFRESH",
            key: { clusterName },
          })
        }
      >
        {clusterName}
      </BreadcrumbItem>
    </Breadcrumb>
  );
};
