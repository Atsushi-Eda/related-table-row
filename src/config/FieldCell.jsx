import React from 'react';
import {Dropdown} from '@kintone/kintone-ui-component';
import selectItemManager from "./selectItemManager";

const FieldCell = props => {
  return (
    <Dropdown
      items={selectItemManager.createItemsForFields(props.fields)}
      value={selectItemManager.getValueForFields(props.fields, props.value)}
      onChange={props.onChange}
    />
  );
};
export default FieldCell;