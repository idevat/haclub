import { Reducer } from "app/store/redux";

type NodeMap = Record<
  string,
  {
    password: string;
    address: string;
    port: string;
  }
>;

export type NodeAuth = {
  nodeMap: NodeMap;
  errorMessage: string;
  useAddresses: boolean;
  nodesResults: {
    success: string[];
    fail: string[];
  };
};

const initialNodesResults = {
  success: [],
  fail: [],
};

const initialState: NodeAuth = {
  nodeMap: {},
  errorMessage: "",
  useAddresses: false,
  nodesResults: initialNodesResults,
};

const selectNodes = (
  nodeAuthError: Record<string, 0 | 1>,
  { success }: { success: boolean },
) =>
  Object.entries(nodeAuthError)
    .filter(([_n, r]) => r === (success ? 0 : 1))
    .map(([n]) => n);

const nodeAuth: Reducer<NodeAuth> = (state = initialState, action) => {
  switch (action.type) {
    case "NODE.AUTH.START":
      return {
        ...state,
        nodeMap: action.payload.initialNodeList.reduce<NodeMap>(
          (map, node): NodeMap => ({
            ...map,
            [node]: { password: "", address: "", port: "" },
          }),
          {},
        ),
      };
    case "NODE.AUTH.UPDATE.NODE": {
      const node = action.payload.nodeName;
      const stateNode = state.nodeMap[node];
      const { password, address, port } = action.payload.state;
      return {
        ...state,
        nodeMap: {
          ...state.nodeMap,
          [node]: {
            ...stateNode,
            password: password ?? stateNode.password,
            address: address ?? stateNode.address,
            port: port ?? stateNode.port,
          },
        },
      };
    }
    case "NODE.AUTH.ADDR.ENABLE": {
      if (action.payload.enable) {
        return { ...state, useAddresses: true };
      }
      return {
        ...state,
        useAddresses: false,
      };
    }
    case "NODE.AUTH.OK": {
      const { response } = action.payload;
      if ("node_auth_error" in response && response.node_auth_error) {
        const resultMap = response.node_auth_error;
        const failedNodes = selectNodes(resultMap, { success: false });
        return {
          ...state,
          errorMessage: "",
          nodeMap: failedNodes.reduce<NodeMap>(
            (map, node): NodeMap => ({
              ...map,
              [node]: {
                ...state.nodeMap[node],
                password: "",
              },
            }),
            {},
          ),
          nodesResults: {
            success: selectNodes(resultMap, { success: true }),
            fail: failedNodes,
          },
        };
      }
      return {
        ...state,
        errorMessage: response.plaintext_error,
        nodesResults: initialNodesResults,
      };
    }
    case "NODE.AUTH.FAIL":
      return {
        ...state,
        errorMessage: action.payload.message,
      };
    default:
      return state;
  }
};

export default nodeAuth;
