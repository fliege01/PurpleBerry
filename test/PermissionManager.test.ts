import {PermissionManager} from '~/PermissionManager';
import {PermissionSchema, RoleSchema} from '../src/schema';
import {StorageAdapter} from '~/storage/StorageAdapter';
import {importAllSchemesToPermissionManager} from './utils';
import RoleContext from '~/RoleContext';

let permissionManager: PermissionManager;

describe('PermissionManager implementation', () => {
	beforeAll(() => {
		permissionManager = new PermissionManager();
	});
	test('Check if PermissionManager is available', () => {
		expect(permissionManager).toBeInstanceOf(PermissionManager);
	});

	describe('PermissionManager constructor', () => {
		test('Create instance without options', () => {
			expect(() => new PermissionManager()).not.toThrow();
		});

		test('Create instance with options', () => {
			expect(() => new PermissionManager({
				storageAdapter: new StorageAdapter()
			})).not.toThrow();
		});
	});
});


describe('PermissionManager logic test', () => {

	beforeAll(() => {
		permissionManager = new PermissionManager();
		importAllSchemesToPermissionManager(permissionManager);
	});

	test('Check if PermissionManager is available', () => {
		expect(permissionManager).toBeInstanceOf(PermissionManager);
	});

	describe('PermissionManager storage connector test', () => {
		const permissionSchema: PermissionSchema = {
			$version: 1,
			statements: [
				{
					action: ['path.to.action'],
					resource: ['*']
				}
			]
		};

		const updatedPermissionSchema: PermissionSchema = {
			$version: 1,
			statements: [
				{
					action: ['path.to.other.action'],
					resource: ['*']
				}
			]
		};

		const roleSchema: RoleSchema = {
			$version: 1,
			permission: ['permission.schema.name'],
			statements: [
				{
					action: ['path.to.action'],
					resource: ['*']
				}
			]
		};

		const updatedRoleSchema: RoleSchema = {
			$version: 1,
			permission: ['another.permission.schema.name'],
			statements: [
				{
					action: ['path.to.other.action'],
					resource: ['*']
				}
			]
		};

		describe('Testing permission schema storage', () => {
			test('Check if permission schema does not exists', () => {
				expect(permissionManager.doesPermissionSchemaExist('unknownSchema')).toBe(false);
			});

			describe('Add permission schema', () => {
				test('Add a new permission schema', () => {
					expect(() => permissionManager.addPermissionSchema('knownSchema', permissionSchema)).not.toThrow();
				});

				test('Check if permission schema exists', () => {
					expect(permissionManager.doesPermissionSchemaExist('knownSchema')).toBe(true);
				});

				test('Try to add permission schema to existing one', () => {
					expect(() => permissionManager.addPermissionSchema('knownSchema', permissionSchema)).toThrow();
				});
			});

			describe('Get permission schema', () => {
				test('Get existing permission schema', () => {
					expect(permissionManager.getPermissionSchema('knownSchema')).toEqual(permissionSchema);
				});

				test('Get unknown permission schema', () => {
					expect(() => permissionManager.getPermissionSchema('unknownSchema')).toThrow();
				});
			});

			describe('Update permission schema', () => {
				test('Update existing permission schema', () => {
					expect(() => permissionManager.updatePermissionSchema('knownSchema', updatedPermissionSchema)).not.toThrow();
				});

				test('Check if permission schema is uptaded', () => {
					expect(permissionManager.getPermissionSchema('knownSchema')).toEqual(updatedPermissionSchema);
				});

				test('Check if permission schema is not outdated one', () => {
					expect(permissionManager.getPermissionSchema('knownSchema')).not.toEqual(permissionSchema);
				});

				test('Update unknown permission schema', () => {
					expect(() => permissionManager.updatePermissionSchema('unknownSchema', updatedPermissionSchema)).toThrow();
				});
			});

			describe('Delete permission schema', () => {
				test('Delete existing permission schema', () => {
					expect(() => permissionManager.deletePermissionSchema('knownSchema')).not.toThrow();
				});

				test('Update unknown permission schema', () => {
					expect(() => permissionManager.deletePermissionSchema('unknownSchema')).toThrow();
				});

				test('Check if permission schema is deleted', () => {
					expect(permissionManager.doesPermissionSchemaExist('knownSchema')).toBe(false);
				});
			});
		});

		describe('Testing role schema storage', () => {
			test('Check if role schema does not exists', () => {
				expect(permissionManager.doesRoleSchemaExist('unknownRoleSchema')).toBe(false);
			});

			describe('Add role schema', () => {
				test('Add a new role schema', () => {
					expect(() => permissionManager.addRoleSchema('knownRoleSchema', roleSchema)).not.toThrow();
				});

				test('Check if role schema exists', () => {
					expect(permissionManager.doesRoleSchemaExist('knownRoleSchema')).toBe(true);
				});

				test('Try to add role schema to existing one', () => {
					expect(() => permissionManager.addRoleSchema('knownRoleSchema', roleSchema)).toThrow();
				});
			});

			describe('Get permission schema', () => {
				test('Get existing permission schema', () => {
					expect(permissionManager.getRoleSchema('knownRoleSchema')).toEqual(roleSchema);
				});

				test('Get unknown permission schema', () => {
					expect(() => permissionManager.getRoleSchema('unknownRoleSchema')).toThrow();
				});
			});

			describe('Update role schema', () => {
				test('Update existing role schema', () => {
					expect(() => permissionManager.updateRoleSchema('knownRoleSchema', updatedRoleSchema)).not.toThrow();
				});

				test('Check if role schema is uptaded', () => {
					expect(permissionManager.getRoleSchema('knownRoleSchema')).toEqual(updatedRoleSchema);
				});

				test('Check if role schema is not outdated one', () => {
					expect(permissionManager.getRoleSchema('knownRoleSchema')).not.toEqual(roleSchema);
				});

				test('Update unknown role schema', () => {
					expect(() => permissionManager.updateRoleSchema('unknownRoleSchema', updatedRoleSchema)).toThrow();
				});
			});

			describe('Delete role schema', () => {
				test('Delete existing role schema', () => {
					expect(() => permissionManager.deleteRoleSchema('knownRoleSchema')).not.toThrow();
				});

				test('Update unknown permission schema', () => {
					expect(() => permissionManager.deleteRoleSchema('unknownRoleSchema')).toThrow();
				});

				test('Check if permission schema is deleted', () => {
					expect(permissionManager.doesRoleSchemaExist('knownRoleSchema')).toBe(false);
				});
			});
		});

	});

	describe('logic stuff', () => {
		let ctx: RoleContext;
		beforeAll(() => {
			ctx = permissionManager.createRoleContext('rolefour');
		});
		test('Check if roles are imported', () => {
			expect(permissionManager.doesRoleSchemaExist('rolefour')).toBe(true);
		});

		test('Create RoleContext by role with string ref', () => {
			expect(permissionManager.createRoleContext('rolefour')).toBeInstanceOf(RoleContext);
		});

		test('Create RoleContext by role with array ref', () => {
			expect(permissionManager.createRoleContext('rolethree')).toBeInstanceOf(RoleContext);
		});

		test('Should allow wildcard action for wildcard ressource on any', () => {
			const wildcardCtx = permissionManager.createRoleContext('wildcardRole');
			expect(wildcardCtx.can('some.action', 'some.ressource', false)).toBe(true);
		});

		test('Should allow specific action on specific resource on any', () => {
			expect(ctx.can('actiontype.two.writeAction', 'some.path', false)).toBe(true);
		});

		test('Should deny unknown action on known resource', () => {
			expect(ctx.can('unknown.action', 'some.path')).toBe(false);
		});

		test('Should deny known action on unknown resource', () => {
			expect(ctx.can('actiontype.two.writeAction', 'unknown.path')).toBe(false);
		});
	});
});
