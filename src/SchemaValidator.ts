import {GenericPermissionManagerError} from '~/error/GenericPermissionManagerError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateSchema = (schema: any) => {
	if(!schema)throw new GenericPermissionManagerError('Schema not provided');
};