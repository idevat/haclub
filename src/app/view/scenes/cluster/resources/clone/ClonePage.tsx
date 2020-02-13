import React from "react";
import { useRouteMatch } from "react-router";

import { types } from "app/store";
import { tabRoutes, join } from "app/view/utils";
import {
  UrlTabs,
  DetailLayout,
  ResourceDetailCaption,
} from "app/view/common";

import { ConstraintListResource } from "../constraints";
import { CloneDetail } from "./CloneDetail";

export const ClonePage = ({ clone, urlPrefix, onClose }: {
  clone: types.cluster.Clone;
  urlPrefix: string;
  onClose: React.ComponentProps<typeof DetailLayout>["onClose"],
}) => {
  const urlMap = {
    Detail: join(urlPrefix),
    Constraints: join(urlPrefix, "constraints"),
  };
  const { tab } = tabRoutes.selectCurrent<keyof typeof urlMap>("Detail", {
    Detail: useRouteMatch({ path: urlMap.Detail, exact: true }),
    Constraints: useRouteMatch(urlMap.Constraints),
  });
  return (
    <DetailLayout
      onClose={onClose}
      caption={<ResourceDetailCaption resourceId={clone.id} type="clone" />}
      tabs={<UrlTabs tabSettingsMap={urlMap} currentTab={tab} />}
    >
      {tab === "Detail" && (
        <CloneDetail clone={clone} />
      )}
      {tab === "Constraints" && (
        <ConstraintListResource resource={clone} />
      )}
    </DetailLayout>
  );
};