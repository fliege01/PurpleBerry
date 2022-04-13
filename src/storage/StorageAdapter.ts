import {BaseSchemaCollection, PermissionSchema, RoleSchema} from '~/schema';
import {GenericPermissionManagerError} from '~/error/GenericPermissionManagerError';
import {compiledRoleContext} from '~/schema/compiledRoleContext';

/**
 * Initialize options for [[PermissionManager]]
 */
export interface StorageManagerOptions {
	/** Set the storage adapter. Needs to be an instance of [[StorageAdapter]]. */
	cacheTTL?: number;
}

/**
 * Generic StorageAdapter
 */
export class StorageAdapter {
	private __roleSchemaTable: BaseSchemaCollection = {};
	private __permissionSchemaTable: BaseSchemaCollection = {};
	private __cachedContexts: Map<string, { createdAt: number, ctx: compiledRoleContext }> = new Map();
	readonly cacheTTL: number = 5000;

	constructor(options?: StorageManagerOptions) {
		if (options?.cacheTTL) this.cacheTTL = options.cacheTTL;
	}

	private static generateErrorMessage(name: string, exists: boolean): string {
		return `${name} ${exists ? 'already exists' : 'does not exist'}`;
	}

	/**
	 * Generates the cache key for the given strings. Is used as the function to create unique cache keys
	 * @param arr The strings to use for the cache key
	 * @category Cache
	 */
	public static createCacheKeyFromStringArray(arr: Array<string> | string): string {
		if (Array.isArray(arr)) {
			arr.map(a => a.toLowerCase().normalize());
			arr.sort();
			return arr.join('::');
		}
		return arr.toLowerCase().normalize();
	}

	/**
	 * Search for cached contexts
	 * @param key The caching key
	 * @category Cache
	 */
	public getCompiledRoleContext(key: string): compiledRoleContext | undefined {
		const val = this.__cachedContexts.get(key);
		if (!val) return undefined;
		if (val.createdAt <= Date.now() - this.cacheTTL) {
			this.__cachedContexts.delete(key);
			return undefined;
		}
		return val.ctx;
	}

	/**
	 * Check if cache for this key exists
	 * @param key The caching key
	 * @param ctx The context to cache
	 * @category Cache
	 */
	public addCompiledRoleContext(key: string, ctx: compiledRoleContext) {
		if (this.__cachedContexts.has(key)) throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(`The cached context ${key}`, true));
		this.__cachedContexts.set(key, {createdAt: Date.now(), ctx});
	}


	/**
	 * Check if a permission schema with the given name exists
	 * @param {string} permissionSchemaName
	 * @returns boolean
	 * @category Storage
	 */
	public doesPermissionSchemaExist(permissionSchemaName: string): boolean {
		return this.__permissionSchemaTable[permissionSchemaName] !== undefined;
	}

	/**
	 * Add a permission schema
	 * @param {string} permissionSchemaName
	 * @param {PermissionSchema} permissionSchema
	 * @category Storage
	 */
	public addPermissionSchema(permissionSchemaName: string, permissionSchema: PermissionSchema) {
		if (this.__permissionSchemaTable[permissionSchemaName] !== undefined) {
			throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(permissionSchemaName, true));
		}
		this.__permissionSchemaTable[permissionSchemaName] = permissionSchema;
	}

	/**
	 * Get a permission schema by unique name
	 * @param {string} permissionSchemaName
	 * @category Storage
	 */
	public getPermissionSchema(permissionSchemaName: string): PermissionSchema {
		if (this.__permissionSchemaTable[permissionSchemaName] === undefined) {
			throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(permissionSchemaName, false));
		}
		return this.__permissionSchemaTable[permissionSchemaName];
	}

	/**
	 * Update a permission schema by name
	 * @param {string} permissionSchemaName
	 * @param {PermissionSchema} permissionSchema
	 * @category Storage
	 */
	public updatePermissionSchema(permissionSchemaName: string, permissionSchema: PermissionSchema): void {
		if (this.__permissionSchemaTable[permissionSchemaName] === undefined) {
			throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(permissionSchemaName, false));
		}
		this.__permissionSchemaTable[permissionSchemaName] = permissionSchema;
	}

	/**
	 * Delete a permission schema by unique name
	 * @param permissionSchemaName
	 * @category Storage
	 */
	public deletePermissionSchema(permissionSchemaName: string): void {
		if (this.__permissionSchemaTable[permissionSchemaName] === undefined) {
			throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(permissionSchemaName, false));
		}
		delete this.__permissionSchemaTable[permissionSchemaName];
	}

	/**
	 * Check if a role schema with the given name exists
	 * @param {string} roleSchemaName
	 * @category Storage
	 */
	public doesRoleSchemaExist(roleSchemaName: string): boolean {
		return this.__roleSchemaTable[roleSchemaName] !== undefined;
	}

	/**
	 * Add a role schema
	 * @param {string} roleSchemaName
	 * @param {PermissionSchema} roleSchema
	 * @category Storage
	 */
	public addRoleSchema(roleSchemaName: string, roleSchema: RoleSchema): void {
		if (this.__roleSchemaTable[roleSchemaName] !== undefined) {
			throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(roleSchemaName, true));
		}
		this.__roleSchemaTable[roleSchemaName] = roleSchema;
	}

	/**
	 * Get a role schema by unique name
	 * @param {string} roleSchemaName
	 * @category Storage
	 */
	public getRoleSchema(roleSchemaName: string): RoleSchema {
		if (this.__roleSchemaTable[roleSchemaName] === undefined) {
			throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(roleSchemaName, false));
		}
		return this.__roleSchemaTable[roleSchemaName];
	}

	/**
	 * Update a role schema by name
	 * @param {string} roleSchemaName
	 * @param {RoleSchema} roleSchema
	 * @category Storage
	 */
	public updateRoleSchema(roleSchemaName: string, roleSchema: RoleSchema): void {
		if (this.__roleSchemaTable[roleSchemaName] === undefined) {
			throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(roleSchemaName, false));
		}
		this.__roleSchemaTable[roleSchemaName] = roleSchema;
	}

	/**
	 * Delete a role schema by unique name
	 * @param roleSchemaName
	 * @category Storage
	 */
	public deleteRoleSchema(roleSchemaName: string): void {
		if (this.__roleSchemaTable[roleSchemaName] === undefined) {
			throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(roleSchemaName, false));
		}
		delete this.__roleSchemaTable[roleSchemaName];
	}

}