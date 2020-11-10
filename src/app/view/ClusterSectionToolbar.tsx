import React from "react";
import { PageSection, Stack, StackItem } from "@patternfly/react-core";

export const ClusterSectionToolbar: React.FC = ({ children }) => {
  return (
    <PageSection variant="light" style={{ paddingTop: "0" }}>
      <Stack>
        <StackItem data-test="cluster-section-toolbar">{children}</StackItem>
      </Stack>
    </PageSection>
  );
};
