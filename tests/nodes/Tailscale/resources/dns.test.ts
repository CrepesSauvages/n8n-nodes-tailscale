import { describe, it, expect } from 'vitest';
import { dnsDescription } from '../../../../nodes/Tailscale/resources/dns';

describe('dnsDescription', () => {
	it('should export an array of 5 property entries', () => {
		expect(Array.isArray(dnsDescription)).toBe(true);
		expect(dnsDescription).toHaveLength(5);
	});

	// ── operation field ────────────────────────────────────────────────────

	describe('operation field (index 0)', () => {
		const operationField = dnsDescription[0];

		it('should be named "operation"', () => {
			expect(operationField.name).toBe('operation');
		});

		it('should be of type "options"', () => {
			expect(operationField.type).toBe('options');
		});

		it('should have "getNameservers" as the default', () => {
			expect(operationField.default).toBe('getNameservers');
		});

		it('should only display for the "dns" resource', () => {
			expect(operationField.displayOptions?.show?.resource).toEqual(['dns']);
		});

		it('should contain all 9 expected operations', () => {
			const options = operationField.options as Array<{ value: string }>;
			const values = options.map((o) => o.value);
			expect(values).toContain('getNameservers');
			expect(values).toContain('setNameservers');
			expect(values).toContain('getPreferences');
			expect(values).toContain('setPreferences');
			expect(values).toContain('getSearchPaths');
			expect(values).toContain('setSearchPaths');
			expect(values).toContain('getSplitDns');
			expect(values).toContain('setSplitDns');
			expect(values).toContain('updateSplitDns');
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

		it('GET operations should use the GET method', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { method?: string } };
			}>;
			const getOps = ['getNameservers', 'getPreferences', 'getSearchPaths', 'getSplitDns'];
			for (const value of getOps) {
				const op = options.find((o) => o.value === value)!;
				expect(op.routing?.request?.method).toBe('GET');
			}
		});

		it('setNameservers and setPreferences and setSearchPaths should use POST', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { method?: string } };
			}>;
			for (const value of ['setNameservers', 'setPreferences', 'setSearchPaths']) {
				const op = options.find((o) => o.value === value)!;
				expect(op.routing?.request?.method).toBe('POST');
			}
		});

		it('setSplitDns should use PUT', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { method?: string } };
			}>;
			const op = options.find((o) => o.value === 'setSplitDns')!;
			expect(op.routing?.request?.method).toBe('PUT');
		});

		it('updateSplitDns should use PATCH', () => {
			const options = operationField.options as Array<{
				value: string;
				routing?: { request?: { method?: string } };
			}>;
			const op = options.find((o) => o.value === 'updateSplitDns')!;
			expect(op.routing?.request?.method).toBe('PATCH');
		});
	});

	// ── nameserversField ───────────────────────────────────────────────────

	describe('nameservers field (index 1)', () => {
		const field = dnsDescription[1];

		it('should be named "dnsServers"', () => {
			expect(field.name).toBe('dnsServers');
		});

		it('should be of type "fixedCollection"', () => {
			expect(field.type).toBe('fixedCollection');
		});

		it('should support multiple values', () => {
			expect(field.typeOptions?.multipleValues).toBe(true);
		});

		it('should be required', () => {
			expect(field.required).toBe(true);
		});

		it('should only display for dns / setNameservers', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['dns']);
			expect(field.displayOptions?.show?.operation).toEqual(['setNameservers']);
		});

		it('should send body property "dns"', () => {
			expect(field.routing?.send?.type).toBe('body');
			expect(field.routing?.send?.property).toBe('dns');
		});
	});

	// ── magicDnsField ──────────────────────────────────────────────────────

	describe('magicDNS field (index 2)', () => {
		const field = dnsDescription[2];

		it('should be named "magicDNS"', () => {
			expect(field.name).toBe('magicDNS');
		});

		it('should be of type "boolean"', () => {
			expect(field.type).toBe('boolean');
		});

		it('should default to true', () => {
			expect(field.default).toBe(true);
		});

		it('should be required', () => {
			expect(field.required).toBe(true);
		});

		it('should only display for dns / setPreferences', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['dns']);
			expect(field.displayOptions?.show?.operation).toEqual(['setPreferences']);
		});

		it('should send body property "magicDNS"', () => {
			expect(field.routing?.send?.type).toBe('body');
			expect(field.routing?.send?.property).toBe('magicDNS');
		});
	});

	// ── searchPathsField ───────────────────────────────────────────────────

	describe('searchPaths field (index 3)', () => {
		const field = dnsDescription[3];

		it('should be named "searchPaths"', () => {
			expect(field.name).toBe('searchPaths');
		});

		it('should be of type "fixedCollection"', () => {
			expect(field.type).toBe('fixedCollection');
		});

		it('should support multiple values', () => {
			expect(field.typeOptions?.multipleValues).toBe(true);
		});

		it('should be required', () => {
			expect(field.required).toBe(true);
		});

		it('should only display for dns / setSearchPaths', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['dns']);
			expect(field.displayOptions?.show?.operation).toEqual(['setSearchPaths']);
		});

		it('should send body property "searchPaths"', () => {
			expect(field.routing?.send?.type).toBe('body');
			expect(field.routing?.send?.property).toBe('searchPaths');
		});
	});

	// ── splitDnsConfigField ────────────────────────────────────────────────

	describe('splitDnsConfig field (index 4)', () => {
		const field = dnsDescription[4];

		it('should be named "splitDnsConfig"', () => {
			expect(field.name).toBe('splitDnsConfig');
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

		it('should only display for dns / setSplitDns and updateSplitDns', () => {
			expect(field.displayOptions?.show?.resource).toEqual(['dns']);
			const ops = field.displayOptions?.show?.operation as string[];
			expect(ops).toContain('setSplitDns');
			expect(ops).toContain('updateSplitDns');
		});
	});
});
