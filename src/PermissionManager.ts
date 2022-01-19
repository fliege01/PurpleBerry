import {StorageAdapter} from '~/storage/StorageAdapter';

export interface PermissionManagerOptions {
	storageAdapter?: StorageAdapter;
}

export class PermissionManager {
	readonly __storageAdapter: StorageAdapter;

	constructor(options?: PermissionManagerOptions) {
		this.__storageAdapter = (options && options.storageAdapter) ? options.storageAdapter : new StorageAdapter();
	}
}