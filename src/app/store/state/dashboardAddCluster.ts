import { Reducer, combineReducers } from "app/store/redux";

export type AUTH_STATE =
  | "INITIAL"
  | "CHECKING"
  | "ALREADY_AUTHENTICATED"
  | "NOT_AUTHENTICATED"
  | "ERROR"
  | "AUTHENTICATION_IN_PROGRESS"
  | "AUTHENTICATION_FAILED";

export type ADD_STATE = "STARTED" | "SUCCESS" | "ERROR" | "DASHBOARD_RELOADING";

export type NodeName = string;
export type StateError = string;

export interface DashboardAddClusterPageState {
  nodeName: NodeName;
  stepAuthState: AUTH_STATE;
  stepAddState: ADD_STATE;
  stateError: StateError;
}

const nodeName: Reducer<NodeName> = (state = "", action) => {
  switch (action.type) {
    case "ADD_CLUSTER.NODE_NAME.UPDATE":
      return action.payload.nodeName;
    default:
      return state;
  }
};

const stepAuthState: Reducer<AUTH_STATE> = (state = "INITIAL", action) => {
  switch (action.type) {
    case "ADD_CLUSTER.NODE_NAME.UPDATE":
      return "INITIAL";
    case "ADD_CLUSTER.CHECK_AUTH":
      return "CHECKING";
    case "ADD_CLUSTER.CHECK_AUTH.OK":
      return "ALREADY_AUTHENTICATED";
    case "ADD_CLUSTER.CHECK_AUTH.NO_AUTH":
      return "NOT_AUTHENTICATED";
    case "ADD_CLUSTER.CHECK_AUTH.ERROR":
      return "ERROR";
    case "ADD_CLUSTER.AUTHENTICATE_NODE":
      return "AUTHENTICATION_IN_PROGRESS";
    case "ADD_CLUSTER.AUTHENTICATE_NODE.SUCCESS":
      return "ALREADY_AUTHENTICATED";
    case "ADD_CLUSTER.AUTHENTICATE_NODE.FAILED":
      return "AUTHENTICATION_FAILED";
    default:
      return state;
  }
};

const stepAddState: Reducer<ADD_STATE> = (state = "STARTED", action) => {
  switch (action.type) {
    case "ADD_CLUSTER.ADD_CLUSTER":
      return "STARTED";
    case "ADD_CLUSTER.RELOAD_DASHBOARD":
      return "DASHBOARD_RELOADING";
    case "ADD_CLUSTER.ADD_CLUSTER.SUCCESS":
      return "SUCCESS";
    case "ADD_CLUSTER.ADD_CLUSTER.ERROR":
      return "ERROR";
    default:
      return state;
  }
};

const stateError: Reducer<StateError> = (state = "", action) => {
  switch (action.type) {
    case "ADD_CLUSTER.NODE_NAME.UPDATE":
    case "ADD_CLUSTER.CHECK_AUTH":
    case "ADD_CLUSTER.CHECK_AUTH.OK":
    case "ADD_CLUSTER.CHECK_AUTH.NO_AUTH":
    case "ADD_CLUSTER.ADD_CLUSTER":
    case "ADD_CLUSTER.RELOAD_DASHBOARD":
    case "ADD_CLUSTER.ADD_CLUSTER.SUCCESS":
    case "ADD_CLUSTER.AUTHENTICATE_NODE":
      return "";
    case "ADD_CLUSTER.CHECK_AUTH.ERROR":
    case "ADD_CLUSTER.ADD_CLUSTER.ERROR":
    case "ADD_CLUSTER.AUTHENTICATE_NODE.FAILED":
      return action.payload.message;

    default:
      return state;
  }
};

export default combineReducers<DashboardAddClusterPageState>({
  nodeName,
  stepAuthState,
  stepAddState,
  stateError,
});