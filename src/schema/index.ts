export interface BaseSchemaCollection {
	[index: string]: BaseSchema;
}

export interface BaseSchema {
	$version: 1;
}

export interface PermissionStatement {
	action: Array<string> | string,
	resource: Array<string> | string
}

export interface PermissionSchema extends BaseSchema {
	$extend?: Array<string> | string,
	statements?: PermissionStatement[] | PermissionStatement
}

export interface RoleSchema extends BaseSchema {
	$extend?: Array<string> | string,
	permission?: Array<string> | string
	statements?: Array<PermissionStatement>
}

export interface resolvedSchemaCache {
	permission: Set<string>,
	role: Set<string>
}