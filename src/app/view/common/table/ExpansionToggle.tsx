import React from "react";

export function ExpansionToggle(
  {
    expanded,
    setExpanded,
    expandKey,
    children,
    ...rest
  }: React.PropsWithChildren<{
    expanded: string,
    setExpanded: (key: string) => void,
    expandKey: string,
  }>,
) {
  const tdClassNames = [
    "pf-c-table__compound-expansion-toggle",
  ];
  if (expanded === expandKey) {
    tdClassNames.push("pf-m-expanded");
  }

  return (
    <td className={tdClassNames.join(" ")} {...rest}>
      <button
        type="button"
        className="pf-c-button pf-m-link"
        onClick={() => setExpanded(expanded !== expandKey ? expandKey : "")}
      >
        {children}
      </button>
    </td>
  );
}
