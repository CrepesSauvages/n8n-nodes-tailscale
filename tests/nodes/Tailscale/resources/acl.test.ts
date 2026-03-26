import { describe, it, expect } from 'vitest';
import { aclDescription } from '../../../../nodes/Tailscale/resources/acl';

describe('aclDescription', () => {
	it('should export an array of 3 property entries', () => {
		expect(Array.isArray(aclDescription)).toBe(true);
		expect(aclDescription).toHaveLength(3);
	});

	// ── operation field ────────────────────────────────────────────────────

	describe('operation field (index 0)', () => {
		const operationField = aclDescription[0];

		it('should be named "operation"', () => {
			expect(operationField.name).toBe('operation');
		});

		it('should be of type "options"', () => {
			expect(operationField.type).toBe('options');
		});

		it('should have "get" as the default', () => {
			expect(operationField.default).toBe('get');
		});

		it('should only display for the "acl" resource', () => {
			expect(operationField.displayOptions?.show?.resource).toEqual(['acl']);
		});

		it('should contain all 4 expected operations', () => {
			const options = operationField.options as Array<{ value: string }>;
			const values = options.map((o) => o.value);
			expect(values).toContain('get');
			expect(values).toContain('update');
			expect(values).toContain('validate');
			expect(values).toContain('preview');
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

		it('get should use GET', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { method?: string } };
			}>;
			const op = options.find((o) => o.value === 'get')!;
			expect(op.routing?.request?.method).toBe('GET');
		});

		it('update, validate, and preview should use POST', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { method?: string } };
			}>;
			for (const value of ['update', 'validate', 'preview']) {
				const op = options.find((o) => o.value === value)!;
				expect(op.routing?.request?.method).toBe('POST');
			}
		});

		it('validate URL should contain /acl/validate', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { url?: string } };
			}>;
			const op = options.find((o) => o.value === 'validate')!;
			expect(op.routing?.request?.url).toContain('/acl/validate');
		});

		it('preview URL should contain /acl/preview', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { url?: string } };
			}>;
			const op = options.find((o) => o.value === 'preview')!;
			expect(op.routing?.request?.url).toContain('/acl/preview');
		});
	});

	// ── aclPolicy field ────────────────────────────────────────────────────

	describe('aclPolicy field (index 1)', () => {
		const field = aclDescription[1];

		it('should be named "aclPolicy"', () => {
			expect(field.name).toBe('aclPolicy');
		});

		it('should be of type "json"', () => {
			expect(field.type).toBe('json');
		});

		it('should be required', () => {
			expect(field.required).toBe(true);
		});

		it('should default to "{}"', () => {
			expect(field.default).toBe('{}');
		});

		it('should only display for acl / update, validate, and preview', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['acl']);
			const showOps = field.displayOptions?.show?.operation as string[];
			expect(showOps).toContain('update');
			expect(showOps).toContain('validate');
			expect(showOps).toContain('preview');
			expect(showOps).not.toContain('get');
		});
	});

	describe('previewForIp field (index 2)', () => {
		const field = aclDescription[2];

		it('should be named "previewForIp"', () => {
			expect(field.name).toBe('previewForIp');
		});

		it('should be of type "string"', () => {
			expect(field.type).toBe('string');
		});

		it('should be required', () => {
			expect(field.required).toBe(true);
		});

		it('should only display for acl / preview', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['acl']);
			expect(field.displayOptions?.show?.operation).toEqual(['preview']);
		});

		it('should NOT use a loadOptionsMethod', () => {
			expect(field.typeOptions?.loadOptionsMethod).toBeUndefined();
		});

		it('should NOT have routing.send (qs params are on the operation)', () => {
			expect(field.routing).toBeUndefined();
		});
	});

	describe('preview operation qs', () => {
		const operationField = aclDescription[0];
		const options = operationField.options as Array<{
			value: string;
			routing?: { request?: { qs?: Record<string, string> } };
		}>;
		const previewOp = options.find((o) => o.value === 'preview')!;

		it('should include a dynamic "type" qs parameter', () => {
			expect(previewOp.routing?.request?.qs?.type).toContain('ipv6');
			expect(previewOp.routing?.request?.qs?.type).toContain('ipv4');
		});

		it('should include a "previewFor" qs parameter referencing previewForIp', () => {
			expect(previewOp.routing?.request?.qs?.previewFor).toContain('previewForIp');
		});
	});
});
