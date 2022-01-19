import {BaseSchemaCollection, PermissionSchema, RoleSchema} from '~/schema';
import {GenericPermissionManagerError} from '~/error/GenericPermissionManagerError';

/**
 * Generic StorageAdapter
 */
export class StorageAdapter {
	private __roleSchemaTable: BaseSchemaCollection = {};
	private __permissionSchemaTable: BaseSchemaCollection = {};

	private static generateErrorMessage(name: string, exists: boolean): string {
		return `${name} ${exists ? 'already exists' : 'does not exist'}`;
	}

	/**
	 * Check if a permission schema with the given name exists
	 * @param {string} permissionSchemaName
	 * @returns boolean
	 */
	public doesPermissionSchemaExist(permissionSchemaName: string): boolean {
		return this.__permissionSchemaTable[permissionSchemaName] !== undefined;
	}

	/**
	 * Add a permission schema
	 * @param {string} permissionSchemaName
	 * @param {PermissionSchema} permissionSchema
	 * @return void
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
	 * @return PermissionSchema
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
	 * @return void
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
	 * @return void
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
	 * @returns boolean
	 */
	public doesRoleSchemaExist(roleSchemaName: string): boolean {
		return this.__roleSchemaTable[roleSchemaName] !== undefined;
	}

	/**
	 * Add a role schema
	 * @param {string} roleSchemaName
	 * @param {PermissionSchema} roleSchema
	 * @return void
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
	 * @return PermissionSchema
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
	 * @return void
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
	 * @return void
	 */
	public deleteRoleSchema(roleSchemaName: string): void {
		if (this.__roleSchemaTable[roleSchemaName] === undefined) {
			throw new GenericPermissionManagerError(StorageAdapter.generateErrorMessage(roleSchemaName, false));
		}
		delete this.__roleSchemaTable[roleSchemaName];
	}

}