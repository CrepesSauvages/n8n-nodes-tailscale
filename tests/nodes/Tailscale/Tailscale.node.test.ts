import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ILoadOptionsFunctions } from 'n8n-workflow';

// Mock n8n-workflow to avoid loading the native `isolated-vm` addon (no
// prebuilt binary for Node 25 on Windows). We only need the runtime value
// of NodeConnectionTypes for the node description.
vi.mock('n8n-workflow', () => ({
    NodeConnectionTypes: { Main: 'main' },
}));

import { Tailscale } from '../../../nodes/Tailscale/Tailscale.node';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeLoadOptionsCtx(
    params: Record<string, unknown>,
    credentials: Record<string, unknown>,
    httpResponse: unknown = { devices: [] },
): ILoadOptionsFunctions {
    return {
        getCurrentNodeParameters: vi.fn().mockReturnValue(params),
        getCredentials: vi.fn().mockResolvedValue(credentials),
        helpers: {
            httpRequestWithAuthentication: {
                call: vi.fn().mockResolvedValue(httpResponse),
            },
        },
    } as unknown as ILoadOptionsFunctions;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Tailscale Node', () => {
    let node: Tailscale;

    beforeEach(() => {
        node = new Tailscale();
    });

    // -----------------------------------------------------------------------
    // description
    // -----------------------------------------------------------------------

    describe('description', () => {
        it('should have the correct displayName, name, and version', () => {
            expect(node.description.displayName).toBe('Tailscale');
            expect(node.description.name).toBe('tailscale');
            expect(node.description.version).toBe(1);
        });

        it('should be usable as a tool', () => {
            expect(node.description.usableAsTool).toBe(true);
        });

        it('should have the Tailscale API base URL as requestDefaults', () => {
            expect(node.description.requestDefaults?.baseURL).toBe('https://api.tailscale.com');
        });

        it('should declare both apiKey and oAuth2 credentials', () => {
            const credNames = node.description.credentials!.map((c) => c.name);
            expect(credNames).toContain('tailscaleApi');
            expect(credNames).toContain('tailscaleOAuth2Api');
        });

        it('should expose authentication, tailnet, and resource top-level properties', () => {
            const propNames = node.description.properties.map((p) => p.name);
            expect(propNames).toContain('authentication');
            expect(propNames).toContain('tailnet');
            expect(propNames).toContain('resource');
        });

        it('authentication property should default to "apiKey"', () => {
            const authProp = node.description.properties.find((p) => p.name === 'authentication')!;
            expect(authProp.default).toBe('apiKey');
        });

        it('resource property should offer "Device" as an option', () => {
            const resourceProp = node.description.properties.find(
                (p) => p.name === 'resource',
            )!;
            const options = resourceProp.options as Array<{ value: string }>;
            expect(options.map((o) => o.value)).toContain('device');
        });

        it('tailnet property should use loadOptionsMethod "getTailnets"', () => {
            const tailnetProp = node.description.properties.find((p) => p.name === 'tailnet')!;
            expect(tailnetProp.typeOptions?.loadOptionsMethod).toBe('getTailnets');
        });
    });

    // -----------------------------------------------------------------------
    // loadOptions.getTailnets
    // -----------------------------------------------------------------------

    describe('methods.loadOptions.getTailnets', () => {
        it('should always include the "Default (-)" option first', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey' },
                { tailnet: '-' },
            );
            const result = await node.methods.loadOptions.getTailnets.call(ctx);
            expect(result[0]).toEqual({ name: 'Default (-)', value: '-' });
        });

        it('should append the tailnet from credentials when it is not "-"', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey' },
                { tailnet: 'acme.com' },
            );
            const result = await node.methods.loadOptions.getTailnets.call(ctx);
            expect(result).toHaveLength(2);
            expect(result[1]).toEqual({ name: 'acme.com', value: 'acme.com' });
        });

        it('should return only the default when tailnet credential is "-"', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey' },
                { tailnet: '-' },
            );
            const result = await node.methods.loadOptions.getTailnets.call(ctx);
            expect(result).toHaveLength(1);
        });

        it('should request tailscaleApi credentials for apiKey authentication', async () => {
            const ctx = makeLoadOptionsCtx({ authentication: 'apiKey' }, { tailnet: '-' });
            await node.methods.loadOptions.getTailnets.call(ctx);
            expect(ctx.getCredentials).toHaveBeenCalledWith('tailscaleApi');
        });

        it('should request tailscaleOAuth2Api credentials for oAuth2 authentication', async () => {
            const ctx = makeLoadOptionsCtx({ authentication: 'oAuth2' }, { tailnet: '-' });
            await node.methods.loadOptions.getTailnets.call(ctx);
            expect(ctx.getCredentials).toHaveBeenCalledWith('tailscaleOAuth2Api');
        });

        it('should fall back to apiKey when authentication parameter is absent', async () => {
            const ctx = makeLoadOptionsCtx({}, { tailnet: '-' });
            await node.methods.loadOptions.getTailnets.call(ctx);
            expect(ctx.getCredentials).toHaveBeenCalledWith('tailscaleApi');
        });
    });

    // -----------------------------------------------------------------------
    // loadOptions.getDevices
    // -----------------------------------------------------------------------

    describe('methods.loadOptions.getDevices', () => {
        it('should map each device to { name: "hostname (nodeId)", value: nodeId }', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey', tailnet: '-' },
                {},
                {
                    devices: [
                        { hostname: 'laptop', name: 'laptop.tail', nodeId: 'nodeA' },
                        { hostname: 'router', name: 'router.tail', nodeId: 'nodeB' },
                    ],
                },
            );
            const result = await node.methods.loadOptions.getDevices.call(ctx);
            expect(result).toEqual([
                { name: 'laptop (nodeA)', value: 'nodeA' },
                { name: 'router (nodeB)', value: 'nodeB' },
            ]);
        });

        it('should return an empty array when the API returns no devices', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey', tailnet: '-' },
                {},
                { devices: [] },
            );
            const result = await node.methods.loadOptions.getDevices.call(ctx);
            expect(result).toHaveLength(0);
        });

        it('should handle a missing "devices" key gracefully', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey', tailnet: '-' },
                {},
                {},
            );
            const result = await node.methods.loadOptions.getDevices.call(ctx);
            expect(result).toHaveLength(0);
        });

        it('should encode the tailnet name in the request URL', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey', tailnet: 'my tailnet' },
                {},
                { devices: [] },
            );
            await node.methods.loadOptions.getDevices.call(ctx);
            const callArgs = (
                ctx.helpers.httpRequestWithAuthentication as { call: ReturnType<typeof vi.fn> }
            ).call.mock.calls[0];
            expect(callArgs[2].url).toContain(encodeURIComponent('my tailnet'));
        });
    });

    // -----------------------------------------------------------------------
    // loadOptions.getTags
    // -----------------------------------------------------------------------

    describe('methods.loadOptions.getTags', () => {
        it('should collect and deduplicate tags across all devices', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey', tailnet: '-' },
                {},
                {
                    devices: [
                        { hostname: 'a', nodeId: '1', tags: ['tag:server', 'tag:dev'] },
                        { hostname: 'b', nodeId: '2', tags: ['tag:dev', 'tag:mobile'] },
                    ],
                },
            );
            const result = await node.methods.loadOptions.getTags.call(ctx);
            expect(result).toHaveLength(3);
            const values = result.map((r) => r.value).sort();
            expect(values).toEqual(['tag:dev', 'tag:mobile', 'tag:server']);
        });

        it('should return an empty array when no device has tags', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey', tailnet: '-' },
                {},
                { devices: [{ hostname: 'a', nodeId: '1' }] },
            );
            const result = await node.methods.loadOptions.getTags.call(ctx);
            expect(result).toHaveLength(0);
        });

        it('should return an empty array when there are no devices', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey', tailnet: '-' },
                {},
                { devices: [] },
            );
            const result = await node.methods.loadOptions.getTags.call(ctx);
            expect(result).toHaveLength(0);
        });

        it('each option should have matching name and value', async () => {
            const ctx = makeLoadOptionsCtx(
                { authentication: 'apiKey', tailnet: '-' },
                {},
                { devices: [{ hostname: 'a', nodeId: '1', tags: ['tag:prod'] }] },
            );
            const result = await node.methods.loadOptions.getTags.call(ctx);
            expect(result[0]).toEqual({ name: 'tag:prod', value: 'tag:prod' });
        });
    });
});
