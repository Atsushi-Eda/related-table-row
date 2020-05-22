import recordsGetter from "./recordsGetter";
import rowsManager from "./rowsManager";

export default class rowsGetter {
  static getFromAllReferenceTables (referenceTables, selfRecord) {
    return Promise.all(referenceTables.map(referenceTable => this.getFromSingleReferenceTable(referenceTable, selfRecord)));
  }
  static getFromSingleReferenceTable (referenceTable, selfRecord) {
    return recordsGetter.getFromSingleReferenceTable(referenceTable, selfRecord).then(({records}) =>
      new rowsManager(referenceTable, records, selfRecord).get()
    )
  }
}