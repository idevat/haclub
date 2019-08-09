import { appPlugger } from "app/core/plug-tools";

import reducer, { selectors as localSelectors } from "./reducer";
import sagas from "./sagas";

const { selectors, plug } = appPlugger(reducer, sagas, localSelectors);

export { selectors };
export default plug;