import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { History } from "history";
import { RootState } from "app/store/types";

import login from "./login/reducer";
import addExistingCluster from "./dashboard-add-cluster/reducer";
import clusterStorage from "./cluster/reducer";
import dashboard from "./dashboard/reducer";
import username from "./username/reducer";
import notifications from "./notifications/reducer";

const rootReducer = (history: History) =>
  combineReducers<RootState>({
    username,
    router: connectRouter(history),
    dashboard,
    addExistingCluster,
    clusterStorage,
    login,
    notifications,
  });

export { rootReducer };