import { describe, it, expect } from 'vitest';
import { userDescription } from '../../../../nodes/Tailscale/resources/user';

describe('userDescription', () => {
    it('should export an array of 3 property entries', () => {
        expect(Array.isArray(userDescription)).toBe(true);
        expect(userDescription).toHaveLength(3);
    });

    describe('operation field (index 0)', () => {
        const operationField = userDescription[0];

        it('should be named "operation"', () => {
            expect(operationField.name).toBe('operation');
        });

        it('should be of type "options"', () => {
            expect(operationField.type).toBe('options');
        });

        it('should have "getMany" as the default', () => {
            expect(operationField.default).toBe('getMany');
        });

        it('should only display for the "user" resource', () => {
            expect(operationField.displayOptions?.show?.resource).toEqual(['user']);
        });

        it('should contain all 6 expected operations', () => {
            const options = operationField.options as Array<{ value: string }>;
            const values = options.map((o) => o.value);
            expect(values).toContain('getMany');
            expect(values).toContain('get');
            expect(values).toContain('delete');
            expect(values).toContain('suspend');
            expect(values).toContain('restore');
            expect(values).toContain('setRole');
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

        it('delete should use DELETE', () => {
            const options = operationField.options as Array<{
                value: string;
                routing?: { request?: { method?: string } };
            }>;
            const op = options.find((o) => o.value === 'delete')!;
            expect(op.routing?.request?.method).toBe('DELETE');
        });

        it('suspend, restore, and setRole should use POST', () => {
            const options = operationField.options as Array<{
                value: string;
                routing?: { request?: { method?: string } };
            }>;
            for (const value of ['suspend', 'restore', 'setRole']) {
                const op = options.find((o) => o.value === value)!;
                expect(op.routing?.request?.method).toBe('POST');
            }
        });

        it('getMany should unwrap the "users" root property', () => {
            const options = operationField.options as Array<{
                value: string;
                routing?: { output?: { postReceive?: Array<{ type: string; properties?: { property: string } }> } };
            }>;
            const op = options.find((o) => o.value === 'getMany')!;
            const postReceive = op.routing?.output?.postReceive ?? [];
            expect(postReceive[0]?.type).toBe('rootProperty');
            expect(postReceive[0]?.properties?.property).toBe('users');
        });

        it('getMany URL should include tailnet parameter', () => {
            const options = operationField.options as Array<{
                value: string;
                routing?: { request?: { url?: string } };
            }>;
            const op = options.find((o) => o.value === 'getMany')!;
            expect(op.routing?.request?.url).toContain('tailnet');
            expect(op.routing?.request?.url).toContain('users');
        });

        it('get/delete/suspend/restore/setRole URLs should include userId parameter', () => {
            const options = operationField.options as Array<{
                value: string;
                routing?: { request?: { url?: string } };
            }>;
            for (const value of ['get', 'delete', 'suspend', 'restore', 'setRole']) {
                const op = options.find((o) => o.value === value)!;
                expect(op.routing?.request?.url).toContain('userId');
            }
        });
    });

    describe('userId field (index 1)', () => {
        const field = userDescription[1];

        it('should be named "userId"', () => {
            expect(field.name).toBe('userId');
        });

        it('should be of type "options"', () => {
            expect(field.type).toBe('options');
        });

        it('should be required', () => {
            expect(field.required).toBe(true);
        });

        it('should use loadOptionsMethod "getUsers"', () => {
            expect(field.typeOptions?.loadOptionsMethod).toBe('getUsers');
        });

        it('should only display for the "user" resource', () => {
            expect(field.displayOptions?.show?.resource).toEqual(['user']);
        });

        it('should display for all operations except getMany', () => {
            const showOps = field.displayOptions?.show?.operation as string[];
            expect(showOps).toContain('get');
            expect(showOps).toContain('delete');
            expect(showOps).toContain('suspend');
            expect(showOps).toContain('restore');
            expect(showOps).toContain('setRole');
            expect(showOps).not.toContain('getMany');
        });
    });

    describe('role field (index 2)', () => {
        const field = userDescription[2];

        it('should be named "role"', () => {
            expect(field.name).toBe('role');
        });

        it('should be of type "options"', () => {
            expect(field.type).toBe('options');
        });

        it('should be required', () => {
            expect(field.required).toBe(true);
        });

        it('should default to "member"', () => {
            expect(field.default).toBe('member');
        });

        it('should only display for user / setRole', () => {
            expect(field.displayOptions?.show?.resource).toEqual(['user']);
            expect(field.displayOptions?.show?.operation).toEqual(['setRole']);
        });

        it('should offer owner, admin, member, billing-admin options', () => {
            const options = field.options as Array<{ value: string }>;
            const values = options.map((o) => o.value);
            expect(values).toContain('owner');
            expect(values).toContain('admin');
            expect(values).toContain('member');
            expect(values).toContain('billing-admin');
        });

        it('should send value as body property "role"', () => {
            expect(field.routing?.send?.type).toBe('body');
            expect(field.routing?.send?.property).toBe('role');
        });
    });
});
