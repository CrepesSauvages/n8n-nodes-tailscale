import { describe, it, expect } from 'vitest';
import { deviceDescription } from '../../../../nodes/Tailscale/resources/device';

describe('deviceDescription', () => {
    it('should export an array of 3 property entries', () => {
        expect(Array.isArray(deviceDescription)).toBe(true);
        expect(deviceDescription).toHaveLength(3);
    });

    describe('operation field (index 0)', () => {
        const operationField = deviceDescription[0];

        it('should be named "operation"', () => {
            expect(operationField.name).toBe('operation');
        });

        it('should be of type "options"', () => {
            expect(operationField.type).toBe('options');
        });

        it('should have "getMany" as the default', () => {
            expect(operationField.default).toBe('getMany');
        });

        it('should only display for the "device" resource', () => {
            expect(operationField.displayOptions?.show?.resource).toEqual(['device']);
        });

        it('should contain all 7 expected operations', () => {
            const options = operationField.options as Array<{ value: string; name: string }>;
            const values = options.map((o) => o.value);
            expect(values).toContain('authorize');
            expect(values).toContain('delete');
            expect(values).toContain('expireKey');
            expect(values).toContain('get');
            expect(values).toContain('getMany');
            expect(values).toContain('getRoutes');
            expect(values).toContain('updateTags');
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
    });

    describe('deviceId field (index 1)', () => {
        const deviceIdField = deviceDescription[1];

        it('should be named "deviceId"', () => {
            expect(deviceIdField.name).toBe('deviceId');
        });

        it('should be of type "options"', () => {
            expect(deviceIdField.type).toBe('options');
        });

        it('should be required', () => {
            expect(deviceIdField.required).toBe(true);
        });

        it('should use loadOptionsMethod "getDevices"', () => {
            expect(deviceIdField.typeOptions?.loadOptionsMethod).toBe('getDevices');
        });

        it('should only be visible for the "device" resource', () => {
            expect(deviceIdField.displayOptions?.show?.resource).toEqual(['device']);
        });

        it('should display for all device-specific operations (excluding getMany)', () => {
            const showOps = deviceIdField.displayOptions?.show?.operation as string[];
            expect(showOps).toContain('get');
            expect(showOps).toContain('delete');
            expect(showOps).toContain('expireKey');
            expect(showOps).toContain('authorize');
            expect(showOps).toContain('updateTags');
            expect(showOps).toContain('getRoutes');
            expect(showOps).not.toContain('getMany');
        });
    });

    describe('tags field (index 2)', () => {
        const tagsField = deviceDescription[2];

        it('should be named "tags"', () => {
            expect(tagsField.name).toBe('tags');
        });

        it('should be of type "multiOptions"', () => {
            expect(tagsField.type).toBe('multiOptions');
        });

        it('should be required', () => {
            expect(tagsField.required).toBe(true);
        });

        it('should use loadOptionsMethod "getTags"', () => {
            expect(tagsField.typeOptions?.loadOptionsMethod).toBe('getTags');
        });

        it('should only display for the updateTags operation', () => {
            const showOps = tagsField.displayOptions?.show?.operation as string[];
            expect(showOps).toEqual(['updateTags']);
        });

        it('should send value as body property "tags"', () => {
            expect(tagsField.routing?.send?.type).toBe('body');
            expect(tagsField.routing?.send?.property).toBe('tags');
        });
    });
});
