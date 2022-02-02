import {StorageAdapter} from '~/storage/StorageAdapter';
import {PermissionSchema, PermissionStatement, RoleSchema} from '~/schema';
import {
	compiledRoleContext,
	compiledStatement,
	compiledStatementAction,
	compiledStatementResource
} from '~/schema/compiledRoleContext';
import {resolveStatementWildcardPath} from '~/utils';
import {GenericPermissionManagerError} from '~/error/GenericPermissionManagerError';
import RoleContext from '~/RoleContext';

export interface PermissionManagerOptions {
	storageAdapter?: StorageAdapter;
	defaultCrud?: number;
}

export class PermissionManager {
	readonly __storageAdapter: StorageAdapter;

	constructor(options?: PermissionManagerOptions) {
		this.__storageAdapter = (options && options.storageAdapter) ? options.storageAdapter : new StorageAdapter();
	}

	private resolveStatementsByPermission(permissionName: string): PermissionStatement[] {
		let statements: PermissionStatement[] = [];
		// Check if permission schema exists
		if (!this.doesPermissionSchemaExist(permissionName)) throw new GenericPermissionManagerError(`The permission schema '${permissionName}' does not exists`);
		const permissionSchema = this.getPermissionSchema(permissionName);
		if (permissionSchema.statements) statements = (Array.isArray(permissionSchema.statements)) ? [...statements, ...permissionSchema.statements] : [...statements, permissionSchema.statements];

		const resolvedSchemaNames: string[] = [];

		function resolveRecursiveSchema (ctx: PermissionManager, schemaName: string) {
			if(resolvedSchemaNames.includes(schemaName)) return; // cancel if is already resolved in stack
			if (!ctx.doesPermissionSchemaExist(schemaName)) throw new GenericPermissionManagerError(`The permission schema '${schemaName}' does not exists`);
			resolvedSchemaNames.push(schemaName);
			const schema = ctx.getPermissionSchema(schemaName);
			if (schema.statements) statements = (Array.isArray(schema.statements)) ? [...statements, ...schema.statements] : [...statements, schema.statements];
			if (schema.$extend) {
				if (Array.isArray(schema.$extend)) {
					for(const extendName of schema.$extend){
						resolveRecursiveSchema(ctx, extendName);
					}
				} else {
					resolveRecursiveSchema(ctx, schema.$extend);
				}
			}
		}

		if(permissionSchema.$extend){
			if (Array.isArray(permissionSchema.$extend)) {
				for(const extendName of permissionSchema.$extend){
					resolveRecursiveSchema(this, extendName);
				}
			} else {
				resolveRecursiveSchema(this, permissionSchema.$extend);
			}
		}

		return statements;
	}

	private resolveStatementsByRole(roleName: string): PermissionStatement[] {
		let statements: PermissionStatement[] = [];
		if (!this.doesRoleSchemaExist(roleName)) throw new GenericPermissionManagerError(`The role schema '${roleName}' does not exists`);
		const roleSchema = this.getRoleSchema(roleName);
		if (roleSchema.statements) statements = (Array.isArray(roleSchema.statements)) ? [...statements, ...roleSchema.statements] : [...statements, roleSchema.statements];

		if(roleSchema.permission) {
			if(Array.isArray(roleSchema.permission)){
				for(const permission of roleSchema.permission) {
					statements = [...statements, ...this.resolveStatementsByPermission(permission)];
				}
			}else{
				statements = [...statements, ...this.resolveStatementsByPermission(roleSchema.permission)];
			}
		}

		const resolvedSchemaNames: string[] = [];

		function resolveRecursiveSchema(ctx: PermissionManager, schemaName: string) {
			if(resolvedSchemaNames.includes(schemaName)) return;
			if (!ctx.doesRoleSchemaExist(schemaName)) throw new GenericPermissionManagerError(`The role schema '${schemaName}' does not exists`);
			resolvedSchemaNames.push(schemaName);
			const schema = ctx.getRoleSchema(schemaName);
			if(schema.permission) {
				if(Array.isArray(schema.permission)){
					for(const permission of schema.permission) {
						statements = [...statements, ...ctx.resolveStatementsByPermission(permission)];
					}
				}else{
					statements = [...statements, ...ctx.resolveStatementsByPermission(schema.permission)];
				}
			}
			if (schema.statements) statements = (Array.isArray(schema.statements)) ? [...statements, ...schema.statements] : [...statements, schema.statements];
			if (schema.$extend) {
				if (Array.isArray(schema.$extend)) {
					for(const extendName of schema.$extend){
						resolveRecursiveSchema(ctx, extendName);
					}
				} else {
					resolveRecursiveSchema(ctx, schema.$extend);
				}
			}
		}

		if(roleSchema.$extend){
			if (Array.isArray(roleSchema.$extend)) {
				for(const extendName of roleSchema.$extend){
					resolveRecursiveSchema(this, extendName);
				}
			} else {
				resolveRecursiveSchema(this, roleSchema.$extend);
			}
		}

		return statements;
	}

	// Permission Compiler logic
	private compileRoleContext(roles: Array<string> | string): compiledRoleContext {
		if (!roles) roles = [];
		if (typeof roles === 'string') roles = [roles];
		let statements: PermissionStatement[] = [];

		if(Array.isArray(roles)){
			for(const role of roles){
				statements = [...statements, ...this.resolveStatementsByRole(role)];
			}
		}else {
			statements = [...statements, ...this.resolveStatementsByRole(roles)];
		}

		const resolvedStatement: compiledStatement[] = [];

		for (const statement of statements) {
			// Resolve Actions
			const resolvedStatementActions: compiledStatementAction[] = [];
			for (const action of statement.action) {
				const actionParts = action.split(':');
				const resolvedPath = resolveStatementWildcardPath(actionParts[0]);
				let anyScoped = false;

				if (actionParts.length >= 2) {
					anyScoped = actionParts[1] === 'any';
				}

				resolvedStatementActions.push([
					resolvedPath[0],
					resolvedPath[1],
					resolvedPath[2],
					anyScoped
				]);
			}

			const resolvedStatementResources: compiledStatementResource[] = [];
			for (const resource of statement.resource) {
				resolvedStatementResources.push(resolveStatementWildcardPath(resource));
			}

			resolvedStatement.push([
				resolvedStatementActions,
				resolvedStatementResources
			]);
		}

		return {
			_affectedRoles: roles,
			_statements: resolvedStatement
		};
	}

	public createRoleContext(roles: string[] | string): RoleContext {
		const ctx = this.compileRoleContext(roles);
		return new RoleContext(ctx);
	}

	// Storage Connectors
	public doesPermissionSchemaExist(permissionSchemaName: string): boolean {
		return this.__storageAdapter.doesRoleSchemaExist(permissionSchemaName);
	}

	public addPermissionSchema(permissionSchemaName: string, permissionSchema: PermissionSchema) {
		this.__storageAdapter.addPermissionSchema(permissionSchemaName, permissionSchema);
	}

	public getPermissionSchema(permissionSchemaName: string): PermissionSchema {
		return this.__storageAdapter.getPermissionSchema(permissionSchemaName);
	}

	public updatePermissionSchema(permissionSchemaName: string, permissionSchema: PermissionSchema) {
		this.__storageAdapter.updatePermissionSchema(permissionSchemaName, permissionSchema);
	}

	public deletePermissionSchema(permissionSchemaName: string) {
		this.__storageAdapter.deletePermissionSchema(permissionSchemaName);
	}

	public doesRoleSchemaExist(roleSchemaName: string): boolean {
		return this.__storageAdapter.doesRoleSchemaExist(roleSchemaName);
	}

	public addRoleSchema(roleSchemaName: string, roleSchema: RoleSchema) {
		this.__storageAdapter.addRoleSchema(roleSchemaName, roleSchema);
	}

	public getRoleSchema(roleSchemaName: string): RoleSchema {
		return this.__storageAdapter.getRoleSchema(roleSchemaName);
	}

	public updateRoleSchema(roleSchemaName: string, roleSchema: RoleSchema) {
		this.__storageAdapter.updateRoleSchema(roleSchemaName, roleSchema);
	}

	public deleteRoleSchema(roleSchemaName: string) {
		this.__storageAdapter.deleteRoleSchema(roleSchemaName);
	}
}