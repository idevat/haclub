import { api, http, t } from "app/backend/tools";

const shape = t.union([
  t.type({ success: t.literal("true") }),
  t.type({
    error: t.literal("true"),
    stdout: t.string,
    stderror: t.string,
  }),
]);

export const resourceRefresh = async (
  clusterName: string,
  resourceId: string,
): api.CallResult<typeof shape> =>
  http.post(`/managec/${clusterName}/resource_refresh`, {
    params: [
      ["resource", resourceId],
      ["strict", "1"],
    ],
    shape,
  });

export const resourceCleanup = async (
  clusterName: string,
  resourceId: string,
): api.CallResult<typeof shape> =>
  http.post(`/managec/${clusterName}/resource_cleanup`, {
    params: [
      ["resource", resourceId],
      ["strict", "1"],
    ],
    shape,
  });
