import {PermissionManager} from '~/PermissionManager';
import {StorageAdapter} from '~/storage/StorageAdapter';

let permissionManager: PermissionManager;

describe('PermissionManager implementationm', () => {
	beforeAll(()=> {
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
