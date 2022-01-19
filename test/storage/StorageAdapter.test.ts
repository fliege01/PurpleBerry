import {StorageAdapter} from '~/storage/StorageAdapter';
import {PermissionSchema, RoleSchema} from '~/schema';

let adapter: StorageAdapter;

describe('Storage Adapter Testing', () => {
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

	beforeAll(() => {
		adapter = new StorageAdapter();
	});

	test('Check if StorageAdapter is available', () => {
		expect(adapter).toBeInstanceOf(StorageAdapter);
	});

	describe('Testing permission schema storage', () => {
		test('Check if permission schema does not exists', () => {
			expect(adapter.doesPermissionSchemaExist('unknownSchema')).toBe(false);
		});

		describe('Add permission schema', () => {
			test('Add a new permission schema', () => {
				expect(() => adapter.addPermissionSchema('knownSchema', permissionSchema)).not.toThrow();
			});

			test('Check if permission schema exists', () => {
				expect(adapter.doesPermissionSchemaExist('knownSchema')).toBe(true);
			});

			test('Try to add permission schema to existing one', () => {
				expect(() => adapter.addPermissionSchema('knownSchema', permissionSchema)).toThrow();
			});
		});

		describe('Get permission schema', () => {
			test('Get existing permission schema', () => {
				expect(adapter.getPermissionSchema('knownSchema')).toEqual(permissionSchema);
			});

			test('Get unknown permission schema', () => {
				expect(() => adapter.getPermissionSchema('unknownSchema')).toThrow();
			});
		});

		describe('Update permission schema', () => {
			test('Update existing permission schema', () => {
				expect(() => adapter.updatePermissionSchema('knownSchema', updatedPermissionSchema)).not.toThrow();
			});

			test('Check if permission schema is uptaded', () => {
				expect(adapter.getPermissionSchema('knownSchema')).toEqual(updatedPermissionSchema);
			});

			test('Check if permission schema is not outdated one', () => {
				expect(adapter.getPermissionSchema('knownSchema')).not.toEqual(permissionSchema);
			});

			test('Update unknown permission schema', () => {
				expect(() => adapter.updatePermissionSchema('unknownSchema', updatedPermissionSchema)).toThrow();
			});
		});

		describe('Delete permission schema', () => {
			test('Delete existing permission schema', () => {
				expect(() => adapter.deletePermissionSchema('knownSchema')).not.toThrow();
			});

			test('Update unknown permission schema', () => {
				expect(() => adapter.deletePermissionSchema('unknownSchema')).toThrow();
			});

			test('Check if permission schema is deleted', () => {
				expect(adapter.doesPermissionSchemaExist('knownSchema')).toBe(false);
			});
		});
	});

	describe('Testing role schema storage', () => {
		test('Check if role schema does not exists', () => {
			expect(adapter.doesRoleSchemaExist('unknownRoleSchema')).toBe(false);
		});

		describe('Add role schema', () => {
			test('Add a new role schema', () => {
				expect(() => adapter.addRoleSchema('knownRoleSchema', roleSchema)).not.toThrow();
			});

			test('Check if role schema exists', () => {
				expect(adapter.doesRoleSchemaExist('knownRoleSchema')).toBe(true);
			});

			test('Try to add role schema to existing one', () => {
				expect(() => adapter.addRoleSchema('knownRoleSchema', roleSchema)).toThrow();
			});
		});

		describe('Get permission schema', () => {
			test('Get existing permission schema', () => {
				expect(adapter.getRoleSchema('knownRoleSchema')).toEqual(roleSchema);
			});

			test('Get unknown permission schema', () => {
				expect(() => adapter.getRoleSchema('unknownRoleSchema')).toThrow();
			});
		});

		describe('Update role schema', () => {
			test('Update existing role schema', () => {
				expect(() => adapter.updateRoleSchema('knownRoleSchema', updatedRoleSchema)).not.toThrow();
			});

			test('Check if role schema is uptaded', () => {
				expect(adapter.getRoleSchema('knownRoleSchema')).toEqual(updatedRoleSchema);
			});

			test('Check if role schema is not outdated one', () => {
				expect(adapter.getRoleSchema('knownRoleSchema')).not.toEqual(roleSchema);
			});

			test('Update unknown role schema', () => {
				expect(() => adapter.updateRoleSchema('unknownRoleSchema', updatedRoleSchema)).toThrow();
			});
		});

		describe('Delete role schema', () => {
			test('Delete existing role schema', () => {
				expect(() => adapter.deleteRoleSchema('knownRoleSchema')).not.toThrow();
			});

			test('Update unknown permission schema', () => {
				expect(() => adapter.deleteRoleSchema('unknownRoleSchema')).toThrow();
			});

			test('Check if permission schema is deleted', () => {
				expect(adapter.doesRoleSchemaExist('knownRoleSchema')).toBe(false);
			});
		});
	});

});
