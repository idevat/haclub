import React from "react";
import {
  Checkbox,
  Flex,
  FlexItem,
  FormGroup,
  Radio,
  SelectOption,
  SelectVariant,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import { FormText, Select } from "app/view";

import { useWizard } from "../useWizard";

export const ResourceCreateSettingsGroup: React.FC = () => {
  const {
    state: { useGroup, group, clone, showValidationErrors },
    updateState,
    groupList,
  } = useWizard();
  const newGroupValidated =
    showValidationErrors && useGroup === "new" && group.length === 0
      ? "error"
      : "default";
  return (
    <Flex>
      <FlexItem>
        <Checkbox
          label="Use group"
          aria-label="Use group"
          id="settings-use-group"
          isChecked={useGroup !== "no"}
          isDisabled={clone}
          onChange={(checked: boolean) => {
            let value: typeof useGroup = "no";
            if (checked) {
              value =
                group.length === 0 || groupList.includes(group)
                  ? "existing"
                  : "new";
            }
            updateState({
              useGroup: value,
              group: value === "existing" ? groupList[0] : "",
            });
          }}
        />
      </FlexItem>
      {useGroup !== "no" && (
        <FlexItem>
          <FormGroup fieldId="settings-group-existing">
            <Stack hasGutter>
              <StackItem>
                <Radio
                  isChecked={useGroup === "existing"}
                  name="use-group-existing"
                  onChange={checked =>
                    updateState({
                      useGroup: checked ? "existing" : "new",
                      ...(checked ? { group: groupList[0] } : {}),
                    })
                  }
                  label="Select existing group"
                  id="settings-group-existing"
                />
                {useGroup === "existing" && (
                  <Select
                    variant={SelectVariant.single}
                    placeholderText=""
                    aria-label="Existing"
                    onSelect={(value: string) =>
                      updateState({ group: value.toString() })
                    }
                    selections={groupList.includes(group) ? group : ""}
                    isDisabled={!useGroup}
                  >
                    {groupList.map(g => (
                      <SelectOption key={g} value={g} />
                    ))}
                  </Select>
                )}
              </StackItem>
              <StackItem>
                <Radio
                  isChecked={useGroup === "new"}
                  name="use-group-new"
                  onChange={checked =>
                    updateState({
                      useGroup: checked ? "new" : "existing",
                      ...(checked ? { group: "" } : {}),
                    })
                  }
                  label="Create new group"
                  id="settings-group-new"
                />
                {useGroup === "new" && (
                  <FormText
                    id="new-group-name"
                    value={group}
                    isRequired
                    onChange={(value: string) => updateState({ group: value })}
                    helperTextInvalid="Please provide a name for the new group"
                    validated={newGroupValidated}
                  />
                )}
              </StackItem>
            </Stack>
          </FormGroup>
        </FlexItem>
      )}
    </Flex>
  );
};
