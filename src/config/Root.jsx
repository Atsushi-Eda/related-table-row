import React from 'react';
import {Table, Dropdown, Button} from '@kintone/kintone-ui-component';
import AppCell from './AppCell';
import ConditionsCell from './ConditionsCell';
import ShowsCell from './ShowsCell';
import SortsCell from './SortsCell';
import selectItemManager from './selectItemManager';
import fieldsFilter from './fieldsFilter';
import {Connection, App} from '@kintone/kintone-js-sdk';
const kintoneApp = new App(new Connection);

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.savedValue.length ? props.savedValue : [{}],
    }
    this.state.targetApps = this.state.value.map(() => this.emptyTargetApp);
    this.state.value.forEach(({app}, rowIndex) => {
      if(app) this.searchApp(app, rowIndex);
    });
  }
  emptyTargetApp = {
    id: '',
    name: '',
    fields: [],
    fieldsInSubTable: [],
    subTables: []
  }
  addTargetApp = (targetApp, rowIndex) => {
    const targetApps = [...this.state.targetApps];
    targetApps.splice(rowIndex, 0, targetApp);
    this.setState({targetApps});
  }
  addEmptyTargetApp = rowIndex => {
    this.addTargetApp(this.emptyTargetApp, rowIndex);
  }
  removeTargetApp = rowIndex => {
    const targetApps = [...this.state.targetApps];
    targetApps.splice(rowIndex, 1);
    this.setState({targetApps});
  }
  editTargetApp = (targetApp, rowIndex) => {
    const targetApps = [...this.state.targetApps];
    targetApps[rowIndex] = {
      ...targetApps[rowIndex],
      ...targetApp
    };
    this.setState({targetApps});
  }
  searchApp = (appId, rowIndex) => {
    Promise.all([
      kintoneApp.getApp({id: appId}),
      kintoneApp.getFormFields({app: appId})
    ]).then(([{name}, {properties}]) => {
      this.editTargetApp({
        id: appId,
        name: name,
        fields: Object.values(properties),
        subTables: Object.values(properties).filter(property => property.type === 'SUBTABLE').map(property => property.code),
      }, rowIndex);
      this.setFieldsInSubTable(this.state.value[rowIndex].subTable, rowIndex);
    }).catch(e => {
      alert(e);
    });
  }
  setFieldsInSubTable = (subTable, rowIndex) => {
    if(!this.state.targetApps[rowIndex].fields.find(field => field.code === subTable)) return;
    this.editTargetApp({
      fieldsInSubTable: Object.values(this.state.targetApps[rowIndex].fields.find(field => field.code === subTable).fields),
    }, rowIndex);
  }
  handleRowAdd = ({data, rowIndex}) => {
    this.addEmptyTargetApp(rowIndex);
    this.setState({value: data});
  }
  handleRowRemove = ({data, rowIndex}) => {
    this.removeTargetApp(rowIndex);
    this.setState({value: data});
  }
  handleCellChange = ({data}) => {
    this.setState({value: data});
  }
  save = () => {
    kintone.plugin.app.setConfig({
      referenceTables: JSON.stringify(this.state.value)
    });
  }
  render() {
    const columns = [{
      header: 'space',
      cell: ({rowIndex, onCellChange}) =>
        <Dropdown
          items={selectItemManager.createItems(this.props.spaceIds)}
          value={selectItemManager.getValue(this.props.spaceIds, this.state.value[rowIndex].space)}
          onChange={newValue => onCellChange(newValue, this.state.value, rowIndex, 'space')}
        />
    }, {
      header: 'app',
      cell: ({rowIndex, onCellChange}) =>
        <AppCell
          value={this.state.value[rowIndex].app}
          appName={this.state.targetApps[rowIndex].name}
          onSearch={appId => () => this.searchApp(appId, rowIndex)}
          onChange={newValue => onCellChange(newValue, this.state.value, rowIndex, 'app')}
        />
    }, {
      header: 'subTable',
      cell: ({rowIndex, onCellChange}) =>
        <Dropdown
          items={selectItemManager.createItems(this.state.targetApps[rowIndex].subTables)}
          value={selectItemManager.getValue(this.state.targetApps[rowIndex].subTables, this.state.value[rowIndex].subTable)}
          onChange={newValue => {
            onCellChange(newValue, this.state.value, rowIndex, 'subTable');
            this.setFieldsInSubTable(newValue, rowIndex);
          }}
        />
    }, {
      header: 'conditions',
      cell: ({rowIndex, onCellChange}) =>
        <ConditionsCell
          value={this.state.value[rowIndex].conditions}
          targetFields={fieldsFilter.conditionTarget(this.state.targetApps[rowIndex].fields)}
          targetFieldsInSubTable={fieldsFilter.conditionTarget(this.state.targetApps[rowIndex].fieldsInSubTable)}
          selfFields={fieldsFilter.conditionSelf(this.props.selfFields)}
          onChange={newValue => onCellChange(newValue, this.state.value, rowIndex, 'conditions')}
        />
    }, {
      header: 'shows',
      cell: ({rowIndex, onCellChange}) =>
        <ShowsCell
          value={this.state.value[rowIndex].shows}
          fields={fieldsFilter.show(this.state.targetApps[rowIndex].fields)}
          fieldsInSubTable={fieldsFilter.show(this.state.targetApps[rowIndex].fieldsInSubTable)}
          onChange={newValue => onCellChange(newValue, this.state.value, rowIndex, 'shows')}
        />
    }, {
      header: 'sorts',
      cell: ({rowIndex, onCellChange}) =>
        <SortsCell
          value={this.state.value[rowIndex].sorts}
          fields={fieldsFilter.sort(this.state.targetApps[rowIndex].fields)}
          fieldsInSubTable={fieldsFilter.sort(this.state.targetApps[rowIndex].fieldsInSubTable)}
          onChange={newValue => onCellChange(newValue, this.state.value, rowIndex, 'sorts')}
        />
    }];
    return (
      <div>
        <Table
          columns={columns}
          data={this.state.value}
          defaultRowData={{}}
          onRowAdd={this.handleRowAdd}
          onRowRemove={this.handleRowRemove}
          onCellChange={this.handleCellChange}
        />
        <Button text='save' type='submit' onClick={this.save} />
      </div>
    );
  }
}
