export function resolveStatementWildcardPath(rawPath: string): [string, boolean, boolean] {
	const isSuffix: boolean = rawPath.indexOf('*') === 0;
	const isPrefix: boolean = rawPath.indexOf('*') === rawPath.length - 1;
	const path: string = (!isSuffix && !isPrefix) ? rawPath : rawPath.substring((isSuffix) ? 2 : 0, (isPrefix) ? rawPath.length - 2 : undefined);
	return [path, isSuffix, isPrefix];
}