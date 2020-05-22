export default class querySortManager {
  static create (sorts) {
    if(!Array.isArray(sorts)) return '';
    const validSorts = sorts.filter(sort => (sort.field && !sort.field.isInSubTable && sort.operator));
    if(!validSorts.length) return '';
    return ' order by ' + validSorts.map(sort => this.createUnit(sort)).join(', ');
  }
  static createUnit (sort) {
    return `${sort.field.code} ${sort.operator}`;
  }
}
