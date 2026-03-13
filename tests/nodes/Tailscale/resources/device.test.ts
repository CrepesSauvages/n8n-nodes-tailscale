import { describe, it, expect } from 'vitest';
import { deviceDescription } from '../../../../nodes/Tailscale/resources/device';

describe('deviceDescription', () => {
    it('should export an array of 5 property entries', () => {
        expect(Array.isArray(deviceDescription)).toBe(true);
        expect(deviceDescription).toHaveLength(5);
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

        it('should contain all 9 expected operations', () => {
            const options = operationField.options as Array<{ value: string; name: string }>;
            const values = options.map((o) => o.value);
            expect(values).toContain('authorize');
            expect(values).toContain('delete');
            expect(values).toContain('expireKey');
            expect(values).toContain('get');
            expect(values).toContain('getMany');
            expect(values).toContain('getRoutes');
            expect(values).toContain('setName');
            expect(values).toContain('setRoutes');
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
            expect(showOps).toContain('setRoutes');
            expect(showOps).toContain('setName');
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

    describe('routes field (index 3)', () => {
        const routesField = deviceDescription[3];

        it('should be named "routes"', () => {
            expect(routesField.name).toBe('routes');
        });

        it('should be of type "fixedCollection"', () => {
            expect(routesField.type).toBe('fixedCollection');
        });

        it('should be required', () => {
            expect(routesField.required).toBe(true);
        });

        it('should support multiple values', () => {
            expect(routesField.typeOptions?.multipleValues).toBe(true);
        });

        it('should only display for the setRoutes operation', () => {
            const showOps = routesField.displayOptions?.show?.operation as string[];
            expect(showOps).toEqual(['setRoutes']);
        });

        it('should send value as body property "routes"', () => {
            expect(routesField.routing?.send?.type).toBe('body');
            expect(routesField.routing?.send?.property).toBe('routes');
        });

        it('should have a "values" sub-collection with a "route" CIDR field', () => {
            const options = routesField.options as Array<{ name: string; values: Array<{ name: string; type: string }> }>;
            expect(options).toHaveLength(1);
            expect(options[0].name).toBe('values');
            const cidrField = options[0].values[0];
            expect(cidrField.name).toBe('route');
            expect(cidrField.type).toBe('string');
        });
    });

    describe('deviceName field (index 4)', () => {
        const deviceNameField = deviceDescription[4];

        it('should be named "deviceName"', () => {
            expect(deviceNameField.name).toBe('deviceName');
        });

        it('should be of type "string"', () => {
            expect(deviceNameField.type).toBe('string');
        });

        it('should be required', () => {
            expect(deviceNameField.required).toBe(true);
        });

        it('should only display for the setName operation', () => {
            const showOps = deviceNameField.displayOptions?.show?.operation as string[];
            expect(showOps).toEqual(['setName']);
        });

        it('should send value as body property "name"', () => {
            expect(deviceNameField.routing?.send?.type).toBe('body');
            expect(deviceNameField.routing?.send?.property).toBe('name');
        });
    });
});
