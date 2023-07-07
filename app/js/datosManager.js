export class DataStorage {
  static RECORD_ADDED_EVENT = 'recordAdded';
  static RECORD_UPDATED_EVENT = 'recordUpdated';
  static RECORD_DELETED_EVENT = 'recordDeleted';
  static RECORDS_CLEARED_EVENT = 'recordsCleared';
  constructor(storageKey) {
      this.storageKey = storageKey;
      this.records = this.loadRecordsFromLocalStorage() || [];
      this.nextId = this.calculateNextId();
    }
  
    calculateNextId() {
      let maxId = 0;
      for (const record of this.records) {
        if (record.id > maxId) {
          maxId = record.id;
        }
      }
      return maxId + 1;
    }

    loadRecordsFromLocalStorage() {
      const data = localStorage.getItem(this.storageKey);
      try {
        return JSON.parse(data);
      } catch (error) {
        return null;
      }
    }
  
    saveRecordsToLocalStorage() {
      const data = JSON.stringify(this.records);
      localStorage.setItem(this.storageKey, data);
    }
  
    getRecordById(id) {
      const index = this.findIndexById(id);
      return this.records[index];
    }

    getAllRecords() {
      return this.records;
    }
  
    addRecord(record) {
      const newItem = { ...record, id: this.nextId };
      this.records.push(newItem);
      this.nextId++;
      this.saveRecordsToLocalStorage();
    }

    updateRecord(id, updatedData) {
      const index = this.findIndexById(id);
      if (index !== -1) {
        this.records[index] = { ...this.records[index], ...updatedData };
        this.saveRecordsToLocalStorage();
      }
    }
  
    deleteRecord(id) {
      const index = this.findIndexById(id);
      if (index !== -1) {
        this.records.splice(index, 1);
        this.saveRecordsToLocalStorage();
      }
    }
  
    clearRecords() {
      this.records = [];
      localStorage.removeItem(this.storageKey);
    }

    findIndexById(id) {
      return this.records.findIndex((record) => record.id == id);
    }
  }
  