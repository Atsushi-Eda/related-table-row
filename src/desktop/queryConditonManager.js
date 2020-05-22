export default class queryCondition {
  static create (conditions, record) {
    if(!Array.isArray(conditions)) return '';
    const validConditions = conditions.filter(condition => (condition.targetField && !condition.targetField.isInSubTable && condition.operator && condition.selfField));
    if(!validConditions.length) return '';
    return validConditions.map(condition =>
      this.createUnit(condition, record)
    ).join(' and ');
  }
  static createUnit ({targetField, operator, selfField}, record) {
    const selfFieldType = record[selfField].type;
    const selfFieldValue = record[selfField].value;
    if(['in', 'not in'].includes(operator)){
      if(['CREATOR', 'MODIFIER'].includes(selfFieldType)){
        return `${targetField.code} ${operator} ("${selfFieldValue.code}")`;
      }else if(Array.isArray(selfFieldValue)){
        if(selfFieldValue.length){
          if(['FILE'].includes(selfFieldType)){
            return `${targetField.code} ${operator} (${selfFieldValue.map(({name}) => `"${name}"`).join(', ')})`;
          }else if(['USER_SELECT', 'STATUS_ASSIGNEE', 'ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(selfFieldType)){
            return `${targetField.code} ${operator} (${selfFieldValue.map(({code}) => `"${code}"`).join(', ')})`;
          }else{
            return `${targetField.code} ${operator} (${selfFieldValue.map(v => `"${v}"`).join(', ')})`;
          }
        }else{
          return `${targetField.code} ${operator} ("")`;
        }
      }else{
        return `${targetField.code} ${operator} ("${selfFieldValue}")`;
      }
    }else{
      if(['CREATOR', 'MODIFIER'].includes(selfFieldType)){
        return `${targetField.code} ${operator} "${selfFieldValue.code}"`;
      }else if(['FILE'].includes(selfFieldType)){
        return `${targetField.code} ${operator} "${selfFieldValue.map(({name}) => name).join('')}"`;
      }else if(['USER_SELECT', 'STATUS_ASSIGNEE', 'ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(selfFieldType)){
        return `${targetField.code} ${operator} "${selfFieldValue.map(({code}) => code).join('')}"`;
      }else if(['CHECK_BOX', 'MULTI_SELECT', 'CATEGORY'].includes(selfFieldType)){
        return `${targetField.code} ${operator} "${selfFieldValue.join('')}"`;
      }else{
        return `${targetField.code} ${operator} "${selfFieldValue}"`;
      }
    }
  }
}