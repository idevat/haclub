import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DataList,
  DataListContent,
  DataListItem,
  DataListItemRow,
  DataListToggle,
} from "@patternfly/react-core";

import { Action, selectors, types } from "app/store";

import { useSelectedClusterName } from "app/view";

import { ResourceTreeItemCells } from "./ResourceTreeItemCells";

export const ResourceTreeItemCompound = ({
  resourceId,
  nestingDepth,
  status,
  type,
  children,
}: React.PropsWithChildren<{
  resourceId: string;
  nestingDepth: number;
  status: types.cluster.ResourceStatus;
  type: string;
}>) => {
  const clusterName = useSelectedClusterName();
  const dispatch = useDispatch();
  const expanded = useSelector(
    selectors.resourceTreeGetOpenedItems(clusterName),
  ).includes(resourceId);
  const label = `Members of resource item ${resourceId}`;
  return (
    <DataListItem
      aria-labelledby={`resource-tree-item-${resourceId}`}
      isExpanded={expanded}
    >
      <DataListItemRow data-test={`resource-tree-item ${resourceId}`}>
        <DataListToggle
          data-test="resource-tree-item-toggle"
          id={`resource-tree-toggle-${resourceId}`}
          isExpanded={expanded}
          onClick={() =>
            dispatch<Action>({
              type: "RESOURCE_TREE.ITEM.TOGGLE",
              payload: { itemId: resourceId, clusterUrlName: clusterName },
            })
          }
        />
        <ResourceTreeItemCells
          resourceId={resourceId}
          status={status}
          type={type}
        />
      </DataListItemRow>
      {expanded && (
        <DataListContent aria-label={label} hasNoPadding>
          <DataList aria-label={label} data-level={nestingDepth}>
            {children}
          </DataList>
        </DataListContent>
      )}
    </DataListItem>
  );
};
