function validateStringArrayValue(value: Array<string> | string) {
	let isValid = false;
	if (Array.isArray(value)) {
		let arrayValid = (value.length >= 1);
		for (let i = 0; i < value.length; i++) {
			if (typeof value[i] !== 'string') arrayValid = false;
		}
		if (arrayValid) isValid = true;
	} else isValid = true;
	return isValid;
}

export interface BaseSchemaCollection {
	[index: string]: BaseSchema;
}

export interface BaseSchema {
	$version: 1;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BaseSchema = (schema: any) => {
	return (schema.$version === 1);
};

export interface PermissionStatement {
	action: Array<string> | string,
	resource: Array<string> | string
}

export const PermissionStatement = (statement: PermissionStatement) => {
	return (validateStringArrayValue(statement.action) && validateStringArrayValue(statement.resource));
};

export interface PermissionSchema extends BaseSchema {
	$extend?: Array<string> | string,
	statements?: PermissionStatement[] | PermissionStatement
}

export const PermissionSchema = (schema: PermissionSchema) => {
	let isInvalid = false;
	if(!BaseSchema(schema)) isInvalid = true;
	if (schema.$extend && !validateStringArrayValue(schema.$extend)) isInvalid = true;
	if (schema.statements && Array.isArray(schema.statements)) {
		let arrayValid = schema.statements.length >= 1;
		for (let i = 0; i < schema.statements.length; i++) {
			if (!PermissionStatement(schema.statements[i])) {
				arrayValid = false;
				break;
			}
		}
		if (!arrayValid) isInvalid = true;
	}
	return !isInvalid;
};

export interface RoleSchema extends BaseSchema {
	$extend?: Array<string> | string,
	statements?: PermissionStatement[] | PermissionStatement
	permission?: Array<string> | string
}

export const RoleSchema = (schema: RoleSchema) => {
	let isInvalid = false;
	if(!BaseSchema(schema)) isInvalid = true;
	if (schema.$extend && !validateStringArrayValue(schema.$extend)) isInvalid = true;
	if (schema.statements && Array.isArray(schema.statements)) {
		let arrayValid = schema.statements.length >= 1;
		for (let i = 0; i < schema.statements.length; i++) {
			if (!PermissionStatement(schema.statements[i])) {
				arrayValid = false;
				break;
			}
		}
		if (!arrayValid) isInvalid = true;
	}
	if(schema.permission && !validateStringArrayValue(schema.permission)) isInvalid = true;
	return !isInvalid;
};

export interface resolvedSchemaCache {
	permission: Set<string>,
	role: Set<string>
}