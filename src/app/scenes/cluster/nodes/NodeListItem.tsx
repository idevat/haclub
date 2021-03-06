import React from "react";
import { Link } from "react-router-dom";
import {
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from "@patternfly/react-core";

import { types } from "app/store";
import {
  SelectionIndicatorInGroup,
  StatusSign,
  toLabel,
  useGroupDetailViewContext,
} from "app/view";

export const NodeListItem = ({ node }: { node: types.cluster.Node }) => {
  const { urlPrefix, selectedItemUrlName } = useGroupDetailViewContext();
  return (
    <DataListItem aria-labelledby={node.name}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={
            <>
              <DataListCell>
                <Link
                  to={`${urlPrefix}/${node.name}`}
                  id={`node-list-item-${node.name}`}
                >
                  <strong>{node.name}</strong>
                </Link>
              </DataListCell>
              <DataListCell>
                <StatusSign
                  status={
                    node.status === "DATA_NOT_PROVIDED"
                      ? "WARNING"
                      : node.statusSeverity
                  }
                  label={<strong>{toLabel(node.status)}</strong>}
                  showOkIco
                />
              </DataListCell>
              <DataListCell>
                <StatusSign
                  status={
                    node.status === "DATA_NOT_PROVIDED"
                      ? "WARNING"
                      : node.quorumSeverity
                  }
                  label={
                    <strong>
                      {node.status === "DATA_NOT_PROVIDED"
                        && "Unknown quorum status"}
                      {node.status !== "DATA_NOT_PROVIDED"
                        && (node.quorum ? "Has quorum" : "Does not have quorum")}
                    </strong>
                  }
                  showOkIco
                />
              </DataListCell>
            </>
          }
        />
        {selectedItemUrlName !== "" && (
          <SelectionIndicatorInGroup
            isSelected={node.name === selectedItemUrlName}
          />
        )}
      </DataListItemRow>
    </DataListItem>
  );
};
