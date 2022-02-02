import {GenericPermissionManagerError} from '~/error/GenericPermissionManagerError';

export class CriticalPermissionManagerError extends GenericPermissionManagerError {
	constructor(message: string) {
		super(message);
	}
}