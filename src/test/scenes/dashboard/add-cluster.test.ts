import * as responses from "dev/responses";

import { dt } from "test/tools/selectors";
import {
  intercept,
  location,
  response as res,
  route,
  url,
  workflow,
} from "test/tools";

const WIZARD = dt("wizard-add-cluster");
const WIZARD_BUTTON_NEXT = dt(WIZARD, "footer [type='submit']");
const FORM_CHECK_AUTH = dt(WIZARD, "form-auth-check");

const isButtonNextDisabled = async () => {
  const isDisabled = await page.$eval(WIZARD_BUTTON_NEXT, (buttonNext) => {
    const attrs = buttonNext.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const a = attrs.item(i);
      if (a?.name === "disabled" && a?.value !== undefined) {
        return true;
      }
    }
    return false;
  });
  return isDisabled;
};

const enterNodeName = async (name: string) => {
  await page.goto(location.dashboardAddCluster);
  await page.waitForSelector(FORM_CHECK_AUTH);

  await page.type(dt(FORM_CHECK_AUTH, "node-name"), name);
  await page.click(dt(FORM_CHECK_AUTH, "auth-check"));
};

const goThroughAddStepSuccessfully = async () => {
  await page.waitForSelector(dt(FORM_CHECK_AUTH, "auth-check-success"));
  await page.click(WIZARD_BUTTON_NEXT);
  await page.waitForSelector(dt(WIZARD, "add-success"));
};

const authFailed = async () => {
  await page.waitForSelector(dt(WIZARD, "auth-check-error"));
  expect(await isButtonNextDisabled()).toEqual(true);
};

const interceptWithDashboard = async (routeList: intercept.Route[]) => {
  await intercept.run([
    {
      url: url.importedClusterList,
      json: responses.importedClusterList.withClusters([
        responses.clusterStatus.empty.cluster_name,
      ]),
    },
    {
      url: url.clusterStatus({ clusterName: "empty" }),
      json: responses.clusterStatus.empty,
    },
    {
      url: url.getAvailResourceAgents({ clusterName: "empty" }),
      json: responses.resourceAgentList.ok,
    },
    {
      url: url.clusterProperties({ clusterName: "empty" }),
      json: responses.clusterProperties.ok,
    },
    ...routeList,
  ]);
};

describe("Add existing cluster wizard", () => {
  const nodeName = "nodeA";
  const password = "pwd";
  const addr = "192.168.0.10";
  const port = "1234";

  afterEach(intercept.stop);

  it("should succesfully add cluster", async () => {
    await interceptWithDashboard([
      {
        url: url.checkAuthAgainstNodes,
        query: { "node_list[]": nodeName },
        json: { [nodeName]: "Online" },
      },
      {
        url: url.existingCluster,
        body: { "node-name": nodeName },
        text: "",
      },
    ]);

    await enterNodeName(nodeName);
    await goThroughAddStepSuccessfully();
  });

  it("should succesfully add cluster with authentication", async () => {
    await interceptWithDashboard([
      {
        url: url.checkAuthAgainstNodes,
        query: { "node_list[]": nodeName },
        json: { [nodeName]: "Unable to authenticate" },
      },
      route.auth_gui_against_nodes({
        nodeA: {
          password: "pwd",
          dest_list: [{ addr: "192.168.0.10", port: "1234" }],
        },
      }),
      {
        url: url.existingCluster,
        body: { "node-name": nodeName },
        text: "",
      },
    ]);

    await enterNodeName(nodeName);
    await workflow.fillAuthForm(nodeName, WIZARD, password, addr, port);
    await page.click(dt(WIZARD, "auth-check"));
    await goThroughAddStepSuccessfully();
  });

  it("should display error when auth check crash on backend", async () => {
    await interceptWithDashboard([
      {
        url: url.checkAuthAgainstNodes,
        handler: res.response(500, "WRONG"),
        query: { "node_list[]": nodeName },
      },
    ]);

    await enterNodeName(nodeName);
    await authFailed();
  });

  it("should display error when auth check response is nonesense", async () => {
    await interceptWithDashboard([
      {
        url: url.checkAuthAgainstNodes,
        query: { "node_list[]": nodeName },
        json: "nonsense",
      },
    ]);

    await enterNodeName(nodeName);
    await authFailed();
  });

  it("should display error when auth check response is offline", async () => {
    await interceptWithDashboard([
      {
        url: url.checkAuthAgainstNodes,
        query: { "node_list[]": nodeName },
        json: { [nodeName]: "Offline" },
      },
    ]);

    await enterNodeName(nodeName);
    await authFailed();
  });

  it("should display error when authentication fails", async () => {
    await interceptWithDashboard([
      {
        url: url.checkAuthAgainstNodes,
        query: { "node_list[]": nodeName },
        json: { [nodeName]: "Unable to authenticate" },
      },
      route.auth_gui_against_nodes(
        {
          nodeA: {
            password: "pwd",
            dest_list: [{ addr: "192.168.0.10", port: "1234" }],
          },
        },
        {
          json: {
            plaintext_error: "",
            node_auth_error: { [nodeName]: 1 },
          },
        },
      ),
    ]);

    await enterNodeName(nodeName);
    await workflow.fillAuthForm(nodeName, WIZARD, password, addr, port);
    await page.click(dt(WIZARD, "auth-check"));
    await page.waitForSelector(dt(WIZARD, "alert-nodes-not-auth"));
  });

  it("should display error when cluster add fails", async () => {
    await interceptWithDashboard([
      {
        url: url.checkAuthAgainstNodes,
        query: { "node_list[]": nodeName },
        json: { [nodeName]: "Online" },
      },
      {
        url: url.existingCluster,
        body: { "node-name": nodeName },
        status: [400, "Configuration conflict detected."],
      },
    ]);

    await enterNodeName(nodeName);
    await page.waitForSelector(dt(WIZARD, "auth-check-success"));
    await page.click(WIZARD_BUTTON_NEXT);
    await page.waitForSelector(dt(WIZARD, "add-error"));
  });
});
