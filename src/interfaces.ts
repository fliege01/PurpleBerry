import {StorageAdapter} from '~/storage/StorageAdapter';

export * from '~/schema';
export * from '~/schema/compiledRoleContext';
export {StorageManagerOptions} from '~/storage/StorageAdapter';

/**
 * Initialize options for [[PermissionManager]]
 */
export interface PermissionManagerOptions {
	/** Set the storage adapter. Needs to be an instance of [[StorageAdapter]]. */
	storageAdapter?: StorageAdapter;
}
