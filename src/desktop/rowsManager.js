export default class rowsManager {
  constructor(referenceTable, targetRecords, selfRecord) {
    this.referenceTable = referenceTable;
    this.targetRecords = targetRecords;
    this.selfRecord = selfRecord;
    this.rows = [];
  }
  get () {
    return this.create().filter().sort().rows;
  }
  create () {
    this.rows = this.targetRecords.map(record => (
      record[this.referenceTable.subTable].value.map((row, index) => {
        row.value.$id = {
          type: record.$id.type,
          value: record.$id.value
        };
        row.value.$rowIndex = {
          type: '__ROW_INDEX__',
          value: index
        };
        [...this.referenceTable.shows, ...this.referenceTable.sorts].filter(({field}) => !field.isInSubTable).forEach(({field}) => {
          row.value[field.code] = {
            type: record[field.code].type,
            value: record[field.code].value
          };
        })
        return row.value;
      })
    )).flat();
    return this;
  }
  filter () {
    this.rows = this.rows.filter(
      row => this.referenceTable.conditions.filter(
        condition => condition.targetField.isInSubTable
      ).every(
        condition => this.filterUnit(condition, row)
      )
    );
    return this;
  }
  sort () {
    this.rows = this.rows.sort(
      (a, b) => {
        for(const {field, operator} of this.referenceTable.sorts){
          if(!a[field.code]) continue;
          if(a[field.code].value < b[field.code].value) return operator === 'asc' ? -1 : 1;
          if(a[field.code].value > b[field.code].value) return operator === 'asc' ? 1 : -1;
        }
        return 0;
      }
    )
    return this;
  }
  filterUnit ({targetField, operator, selfField}, row) {
    const targetFieldValue = this.formatValueForFilter(row[targetField.code].type, row[targetField.code].value);
    const selfFieldValue = this.formatValueForFilter(this.selfRecord[selfField].type, this.selfRecord[selfField].value);
    switch(operator){
      case '=': {
        return targetFieldValue == selfFieldValue;
      }
      case '!=': {
        return targetFieldValue != selfFieldValue;
      }
      case '>': {
        return targetFieldValue > selfFieldValue;
      }
      case '<': {
        return targetFieldValue < selfFieldValue;
      }
      case '>=': {
        return targetFieldValue >= selfFieldValue;
      }
      case '<=': {
        return targetFieldValue <= selfFieldValue;
      }
      case 'in': {
        return Array.from(selfFieldValue).includes(targetFieldValue);
      }
      case 'not in': {
        return !Array.from(selfFieldValue).includes(targetFieldValue);
      }
      case 'like': {
        return String(selfFieldValue).includes(targetFieldValue);
      }
      case 'not like': {
        return !String(selfFieldValue).includes(targetFieldValue);
      }
      default: {
        return true;
      }
    }
  }
  formatValueForFilter (type, value) {
    if(['RECORD_NUMBER', 'NUMBER', 'CALC'].includes(type) && !isNaN(value)){
      return Number(value);
    }else if(['CREATOR', 'MODIFIER'].includes(type)){
      return value.code;
    }else if(['FILE'].includes(type)){
      return value.map(({name}) => name);
    }else if(['USER_SELECT', 'STATUS_ASSIGNEE', 'ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(type)){
      return value.map(({code}) => code);
    }else{
      return value;
    }
  }
}