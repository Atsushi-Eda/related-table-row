import React from 'react';
import {Table} from '@kintone/kintone-ui-component';
import FieldWithSubtableCell from "./FieldWithSubtableCell";

const ShowsCell = props => {
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
export default ShowsCell;
