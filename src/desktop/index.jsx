import React from 'react';
import ReactDOM from 'react-dom';
import {Label, Table} from '@kintone/kintone-ui-component';
import IdCell from './IdCell';
import Cell from './Cell';
import rowsGetter from "./rowsGetter";
import appGetter from "./appGetter";
import formFieldsGetter from "./formFieldsGetter";
import './index.css';

(PLUGIN_ID => {
  const referenceTables = JSON.parse(kintone.plugin.app.getConfig(PLUGIN_ID).referenceTables);
  window.relatedTableRowPlugin = {
    getRowsFromSingleReferenceTable: (index, selfRecord) => rowsGetter.getFromSingleReferenceTable(referenceTables[index], selfRecord),
    getRowsFromAllReferenceTables: selfRecord => rowsGetter.getFromAllReferenceTables(referenceTables, selfRecord)
  };
  kintone.events.on([
    'app.record.detail.show'
  ], event => {
    Promise.all([
      rowsGetter.getFromAllReferenceTables(referenceTables, event.record),
      appGetter.getFromAllReferenceTables(referenceTables),
      formFieldsGetter.getFromAllReferenceTables(referenceTables)
    ]).then(([rowsResponses, appResponses, formFieldsResponses]) => {
      referenceTables.forEach((referenceTable, index) => {
        const rows = rowsResponses[index];
        const app = appResponses[index];
        const properties = {
          ...formFieldsResponses[index].properties,
          ...formFieldsResponses[index].properties[referenceTable.subTable].fields
        };
        const space = kintone.app.record.getSpaceElement(referenceTable.space);
        if(!space) return;
        const domRoot = document.createElement('div');
        domRoot.id = 'related-table-row-plugin-' + index;
        space.appendChild(domRoot);
        ReactDOM.render(
          <div>
            <Label text={app.name} />
            <Table
              columns={[
                {
                  header: 'id',
                  cell: ({rowIndex}) =>
                    <IdCell
                      app={referenceTable.app}
                      $id={rows[rowIndex].$id.value}
                      rowIndex={rows[rowIndex].$rowIndex.value}
                    />
                },
                ...referenceTable.shows.map(({field}) => ({
                  header: properties[field.code].label,
                  cell: ({rowIndex}) =>
                    <Cell
                      type={rows[rowIndex][field.code].type}
                      value={rows[rowIndex][field.code].value}
                      property={properties[field.code]}
                    />
                }))
              ]}
              data={rows}
              actionButtonsShown={false}
            />
          </div>,
          domRoot
        );
      });
    });
  });
})(kintone.$PLUGIN_ID);
