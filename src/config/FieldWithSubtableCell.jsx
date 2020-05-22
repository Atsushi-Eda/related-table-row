import React from 'react';
import {Dropdown} from '@kintone/kintone-ui-component';
import selectItemManager from "./selectItemManager";

const FieldWithSubtableCell = props => {
  const value = props.value || {};
  const fields = [...props.fields, ...props.fieldsInSubTable];
  return (
    <Dropdown
      items={selectItemManager.createItemsForFields(fields)}
      value={selectItemManager.getValueForFields(fields, value.code)}
      onChange={newValue => props.onChange({
        code: newValue,
        isInSubTable: props.fieldsInSubTable.map(property => property.code).includes(newValue)
      })}
    />
  );
};
export default FieldWithSubtableCell;