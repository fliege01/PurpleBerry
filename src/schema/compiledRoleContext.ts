/**
 * Internal statement action format
 * @private
 */
export type compiledStatementAction = [ // action
	string, // path
	boolean, // isSuffix *path
	boolean, // isPrefix, path*
	boolean // ignore ownershio (if true ownership is like any, otherwise needs to be owner)
];

/**
 * Internal statement resource format
 * @private
 */
export type compiledStatementResource = [ // Resource
	string, // path
	boolean, // isSuffix *path
	boolean // isPrefix, path*
];

/**
 * Internal statement format
 * @private
 */
export type compiledStatement = [ // Single Statement
	Array<compiledStatementAction>,
	Array<compiledStatementResource>
];

export interface compiledRoleContext {
	_affectedRoles: Array<string>,
	_statements: Array<compiledStatement>
}
