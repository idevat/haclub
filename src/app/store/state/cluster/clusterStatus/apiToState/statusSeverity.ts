import * as types from "app/store/state/types";

type StatusSeverity = types.cluster.StatusSeverity;

export const max = (a: StatusSeverity, b: StatusSeverity): StatusSeverity => {
  const statuses = [a, b];
  if (statuses.includes("ERROR")) {
    return "ERROR";
  }
  if (statuses.includes("WARNING")) {
    return "WARNING";
  }
  return "OK";
};

const severity = (status: StatusSeverity): number => {
  switch (status) {
    case "ERROR":
      return 3;
    case "WARNING":
      return 2;
    case "OK":
      return 0;
    default:
      return 1;
  }
};

export const compareStatusSeverity = (
  a: StatusSeverity,
  b: StatusSeverity,
): number => severity(a) - severity(b);
