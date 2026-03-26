import { describe, it, expect } from 'vitest';
import { authKeyDescription } from '../../../../nodes/Tailscale/resources/authKey';

describe('authKeyDescription', () => {
	it('should export an array of 9 property entries', () => {
		expect(Array.isArray(authKeyDescription)).toBe(true);
		expect(authKeyDescription).toHaveLength(9);
	});

	// ── operation field ────────────────────────────────────────────────────

	describe('operation field (index 0)', () => {
		const operationField = authKeyDescription[0];

		it('should be named "operation"', () => {
			expect(operationField.name).toBe('operation');
		});

		it('should be of type "options"', () => {
			expect(operationField.type).toBe('options');
		});

		it('should have "getMany" as the default', () => {
			expect(operationField.default).toBe('getMany');
		});

		it('should only display for the "authKey" resource', () => {
			expect(operationField.displayOptions?.show?.resource).toEqual(['authKey']);
		});

		it('should contain all 4 expected operations', () => {
			const options = operationField.options as Array<{ value: string }>;
			const values = options.map((o) => o.value);
			expect(values).toContain('create');
			expect(values).toContain('delete');
			expect(values).toContain('get');
			expect(values).toContain('getMany');
		});

		it('each operation should have a name, value, description, and action', () => {
			const options = operationField.options as Array<{
				value: string;
				name: string;
				description: string;
				action: string;
			}>;
			for (const op of options) {
				expect(op.name).toBeTruthy();
				expect(op.value).toBeTruthy();
				expect(op.description).toBeTruthy();
				expect(op.action).toBeTruthy();
			}
		});

		it('create should use POST', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { method?: string } };
			}>;
			const op = options.find((o) => o.value === 'create')!;
			expect(op.routing?.request?.method).toBe('POST');
		});

		it('delete should use DELETE', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { method?: string } };
			}>;
			const op = options.find((o) => o.value === 'delete')!;
			expect(op.routing?.request?.method).toBe('DELETE');
		});

		it('get and getMany should use GET', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { method?: string } };
			}>;
			for (const value of ['get', 'getMany']) {
				const op = options.find((o) => o.value === value)!;
				expect(op.routing?.request?.method).toBe('GET');
			}
		});

		it('getMany should unwrap the "keys" root property', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { output?: { postReceive?: Array<{ type: string; properties?: { property: string } }> } };
			}>;
			const op = options.find((o) => o.value === 'getMany')!;
			const postReceive = op.routing?.output?.postReceive ?? [];
			expect(postReceive[0]?.type).toBe('rootProperty');
			expect(postReceive[0]?.properties?.property).toBe('keys');
		});
	});

	// ── keyId field ────────────────────────────────────────────────────────

	describe('keyId field (index 1)', () => {
		const field = authKeyDescription[1];

		it('should be named "keyId"', () => {
			expect(field.name).toBe('keyId');
		});

		it('should be of type "options"', () => {
			expect(field.type).toBe('options');
		});

		it('should be required', () => {
			expect(field.required).toBe(true);
		});

		it('should use loadOptionsMethod "getAuthKeys"', () => {
			expect(field.typeOptions?.loadOptionsMethod).toBe('getAuthKeys');
		});

		it('should only display for get and delete operations', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['authKey']);
			const showOps = field.displayOptions?.show?.operation as string[];
			expect(showOps).toContain('get');
			expect(showOps).toContain('delete');
			expect(showOps).not.toContain('create');
			expect(showOps).not.toContain('getMany');
		});
	});

	// ── reusable field ─────────────────────────────────────────────────────

	describe('reusable field (index 2)', () => {
		const field = authKeyDescription[2];

		it('should be named "reusable"', () => {
			expect(field.name).toBe('reusable');
		});

		it('should be of type "boolean"', () => {
			expect(field.type).toBe('boolean');
		});

		it('should default to false', () => {
			expect(field.default).toBe(false);
		});

		it('should only display for authKey / create', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['authKey']);
			expect(field.displayOptions?.show?.operation).toEqual(['create']);
		});
	});

	// ── ephemeral field ────────────────────────────────────────────────────

	describe('ephemeral field (index 3)', () => {
		const field = authKeyDescription[3];

		it('should be named "ephemeral"', () => {
			expect(field.name).toBe('ephemeral');
		});

		it('should be of type "boolean"', () => {
			expect(field.type).toBe('boolean');
		});

		it('should default to false', () => {
			expect(field.default).toBe(false);
		});

		it('should only display for authKey / create', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['authKey']);
			expect(field.displayOptions?.show?.operation).toEqual(['create']);
		});
	});

	// ── preauthorized field ────────────────────────────────────────────────

	describe('preauthorized field (index 4)', () => {
		const field = authKeyDescription[4];

		it('should be named "preauthorized"', () => {
			expect(field.name).toBe('preauthorized');
		});

		it('should be of type "boolean"', () => {
			expect(field.type).toBe('boolean');
		});

		it('should default to false', () => {
			expect(field.default).toBe(false);
		});

		it('should only display for authKey / create', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['authKey']);
			expect(field.displayOptions?.show?.operation).toEqual(['create']);
		});
	});

	// ── noExpiry field ─────────────────────────────────────────────────────

	describe('noExpiry field (index 5)', () => {
		const field = authKeyDescription[5];

		it('should be named "noExpiry"', () => {
			expect(field.name).toBe('noExpiry');
		});

		it('should be of type "boolean"', () => {
			expect(field.type).toBe('boolean');
		});

		it('should default to false', () => {
			expect(field.default).toBe(false);
		});

		it('should only display for authKey / create', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['authKey']);
			expect(field.displayOptions?.show?.operation).toEqual(['create']);
		});
	});

	// ── keyTags field ──────────────────────────────────────────────────────

	describe('keyTags field (index 6)', () => {
		const field = authKeyDescription[6];

		it('should be named "keyTags"', () => {
			expect(field.name).toBe('keyTags');
		});

		it('should be of type "multiOptions"', () => {
			expect(field.type).toBe('multiOptions');
		});

		it('should default to an empty array', () => {
			expect(field.default).toEqual([]);
		});

		it('should use loadOptionsMethod "getTags"', () => {
			expect(field.typeOptions?.loadOptionsMethod).toBe('getTags');
		});

		it('should only display for authKey / create', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['authKey']);
			expect(field.displayOptions?.show?.operation).toEqual(['create']);
		});
	});

	// ── expirySeconds field ────────────────────────────────────────────────

	describe('expirySeconds field (index 7)', () => {
		const field = authKeyDescription[7];

		it('should be named "expirySeconds"', () => {
			expect(field.name).toBe('expirySeconds');
		});

		it('should be of type "number"', () => {
			expect(field.type).toBe('number');
		});

		it('should default to 86400', () => {
			expect(field.default).toBe(86400);
		});

		it('should only display for authKey / create', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['authKey']);
			expect(field.displayOptions?.show?.operation).toEqual(['create']);
		});

		it('should be hidden when noExpiry is true', () => {
			const showNoExpiry = field.displayOptions?.show?.noExpiry as boolean[] | undefined;
			expect(showNoExpiry).toEqual([false]);
		});
	});

	// ── keyDescription field ───────────────────────────────────────────────

	describe('keyDescription field (index 8)', () => {
		const field = authKeyDescription[8];

		it('should be named "keyDescription"', () => {
			expect(field.name).toBe('keyDescription');
		});

		it('should be of type "string"', () => {
			expect(field.type).toBe('string');
		});

		it('should default to an empty string', () => {
			expect(field.default).toBe('');
		});

		it('should only display for authKey / create', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['authKey']);
			expect(field.displayOptions?.show?.operation).toEqual(['create']);
		});
	});
});
