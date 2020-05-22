import React from 'react';
import {Table, Dropdown} from '@kintone/kintone-ui-component';
import FieldCell from "./FieldCell";
import FieldWithSubtableCell from "./FieldWithSubtableCell";
import selectItemManager from './selectItemManager';
import conditionOperatorsManager from './conditionOperatorsManager';

const ConditionsCell = props => {
  const value = props.value || [{}];
  const targetFields = [...props.targetFields, ...props.targetFieldsInSubTable];
  const columns = [{
    header: 'target field',
    cell: ({rowIndex, onCellChange}) =>
      <FieldWithSubtableCell
        fields={props.targetFields}
        fieldsInSubTable={props.targetFieldsInSubTable}
        value={value[rowIndex].targetField}
        onChange={newValue => onCellChange(newValue, value, rowIndex, 'targetField')}
      />
  }, {
    header: 'operator',
    cell: ({rowIndex, onCellChange}) =>
      <Dropdown
        items={selectItemManager.createItems(conditionOperatorsManager.get(targetFields, value, rowIndex))}
        value={selectItemManager.getValue(conditionOperatorsManager.get(targetFields, value, rowIndex), value[rowIndex].operator)}
        onChange={newValue => onCellChange(newValue, value, rowIndex, 'operator')}
      />
  }, {
    header: 'self field',
    cell: ({rowIndex, onCellChange}) =>
      <FieldCell
        fields={props.selfFields}
        value={value[rowIndex].selfField}
        onChange={newValue => onCellChange(newValue, value, rowIndex, 'selfField')}
      />
  }];
  return (
    <Table
      columns={columns}
      data={value}
      defaultRowData={{}}
      onRowAdd={({data}) => props.onChange(data)}
      onRowRemove={({data}) => props.onChange(data)}
      onCellChange={({data}) => props.onChange(data)}
    />
  );
};
export default ConditionsCell;
