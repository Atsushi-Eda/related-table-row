import React from 'react';
import {Table, Dropdown} from '@kintone/kintone-ui-component';
import FieldWithSubtableCell from "./FieldWithSubtableCell";
import selectItemManager from './selectItemManager';

const SortsCell = props => {
  const operators = ['asc', 'desc'];
  const value = props.value || [{}];
  const columns = [{
    header: 'field',
    cell: ({rowIndex, onCellChange}) =>
      <FieldWithSubtableCell
        fields={props.fields}
        fieldsInSubTable={props.fieldsInSubTable}
        value={value[rowIndex].field}
        onChange={newValue => onCellChange(newValue, value, rowIndex, 'field')}
      />
  }, {
    header: 'operator',
    cell: ({rowIndex, onCellChange}) =>
      <Dropdown
        items={selectItemManager.createItems(operators)}
        value={selectItemManager.getValue(operators, value[rowIndex].operator)}
        onChange={newValue => onCellChange(newValue, value, rowIndex, 'operator')}
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
export default SortsCell;
