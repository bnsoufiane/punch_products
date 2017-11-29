import {Injectable} from 'angular2/core';

@Injectable()
class StorageService {

    private _storage: any;

    constructor(private _storageService: any) {
        this._storage = _storageService;
    }

    /**
     * Gets an item from HTML5 session storage system.
     */
    get(key: string): Object {
        let item = this._storage.getItem(key);
        if (item) {
            return (JSON.parse(item).value);
        }
        return null;
    }

    /**
     * Gets the timestamp of a session storage stored item.
     * Used by caller to determine whether the item stored is older than the
     * newest version of the item on the server.
     */
    getTimestamp(key: string): Date {
        let item = this._storage.getItem(key);
        if (item) {
            return (new Date((JSON.parse(item).timestamp)));
        }
        return null;
    }

    /**
     * Sets an item to HTML5 session storage system.
     */
    set(key: string, item: any): void {
        let itemObj = { value: item, timestamp: new Date() };
        let storageItem = JSON.stringify(itemObj);
        this._storage.setItem(key, storageItem);
    }

    /**
     * Clear HTML5 session storage for a key.
     */
    clear(key: string): void {
      this._storage.removeItem(key);
    }

    /**
     * Clears HTML5 session storage system.
     */
    clearAll(): void {
      this._storage.clear();
    }

    /**
     * Checks if HTML5 session storage system is available and is enabled.
     */
    isAvailable(): boolean {
      try {
        let x = '__storage_test__';
        this.set(x, x);
        this.clear(x);
        return true;
      }catch (e) {
        return false;
      }
    }

    /**
     * Checks if session storage is still valid for a given time period.
     * Used by caller to determine whether the item stored is older than the
     * allowed time period of the item to ignore session storage and call API.
     */
    isValid(key: string, duration: number): boolean | number {
      let item = this._storage.get(key);

      if (item) {
        let storedTimestamp = (new Date((JSON.parse(item).timestamp)));
        let currentTimestamp = (new Date());
        let timeInMinutes = (
            currentTimestamp.getTime() - storedTimestamp.getTime()) / 60000;
        return (Math.abs(timeInMinutes) - duration) < 0;
      }
      return false;
    }
}

@Injectable()
export class SessionStorageService extends StorageService {
    constructor() { super(sessionStorage); }
}

@Injectable()
export class LocalStorageService extends StorageService {
    constructor() { super(localStorage); }
}
