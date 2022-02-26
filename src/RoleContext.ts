import {compiledRoleContext} from '~/schema/compiledRoleContext';
import {CriticalPermissionManagerError} from '~/error/CriticalPermissionManagerError';

export default class RoleContext {
	private readonly ctx: compiledRoleContext;

	constructor(ctx: compiledRoleContext) {
		if (!ctx) throw new CriticalPermissionManagerError('RoleContext: construction context not given');
		this.ctx = ctx;
	}

	public getCompiledContext(): compiledRoleContext {
		return this.ctx;
	}

	public can(action: string, resource: string, isOwner = false) {
		let isAllowed = false;
		for (const statement of this.ctx._statements) {
			// Check if action matches statement
			let isAllowedByAction = false;
			for (const statementAction of statement[0]) {
				let isAllowedByActionPath = false;
				const statementActionPath = statementAction[0];
				const statementActionIsSuffix = statementAction[1];
				const statementActionIsPrefix = statementAction[2];
				const statementActionIgnoreOwnership = statementAction[3];

				if (statementActionIsSuffix && statementActionIsPrefix) isAllowedByActionPath = true;
				else if (statementActionIsSuffix) {
					if (action.indexOf(statementActionPath, action.length - statementActionPath.length) >= 0) isAllowedByActionPath = true;
				} else if (statementActionIsPrefix) {
					if (action.indexOf(statementActionPath, 0) >= 0) isAllowedByActionPath = true;
				} else if (statementActionPath === action) isAllowedByActionPath = true;

				if (isAllowedByActionPath && (isOwner || isAllowedByActionPath && statementActionIsSuffix || statementActionIgnoreOwnership)) {
					isAllowedByAction = true;
					break;
				}
			}

			// Check if resource matches statement
			let isAllowedByResource = false;
			for (const statementResource of statement[1]) {
				let isAllowedByResourcePath = false;
				const statementResourcePath = statementResource[0];
				const statementResourceIsSuffix = statementResource[1];
				const statementResourceIsPrefix = statementResource[2];

				if (statementResourceIsSuffix && statementResourceIsPrefix) isAllowedByResourcePath = true;
				else if (statementResourceIsSuffix) {
					if (resource.indexOf(statementResourcePath, resource.length - statementResourcePath.length) >= 0) isAllowedByResourcePath = true;
				} else if (statementResourceIsPrefix) {
					if (resource.indexOf(statementResourcePath, 0) >= 0) isAllowedByResourcePath = true;
				} else if (statementResourcePath === resource) isAllowedByResourcePath = true;

				if (isAllowedByResourcePath) {
					isAllowedByResource = true;
					break;
				}
			}

			if (isAllowedByAction && isAllowedByResource) {
				isAllowed = true;
				break;
			}
		}

		return isAllowed;
	}

	public exportRoleContext(): string {
		return JSON.stringify(this.ctx);
	}
}