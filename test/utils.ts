import {PermissionManager} from '~/PermissionManager';
import fs from 'node:fs';
import path from 'node:path';

export function importAllSchemesToPermissionManager(pm: PermissionManager) {
	const scanDir = path.join(__dirname, '../test/schemas/roles');
	for (const file of fs.readdirSync(scanDir)) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		pm.addRoleSchema(file.split('.')[0], require(path.join(scanDir, file)));
	}
}