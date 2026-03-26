import {
    NodeConnectionTypes,
    type IAllExecuteFunctions,
    type ILoadOptionsFunctions,
    type INodePropertyOptions,
    type INodeType,
    type INodeTypeDescription,
} from 'n8n-workflow';
import { deviceDescription } from './resources/device';
import { dnsDescription } from './resources/dns';
import { authKeyDescription } from './resources/authKey';
import { aclDescription } from './resources/acl';
import { userDescription } from './resources/user';

export class Tailscale implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Tailscale',
        name: 'tailscale',
        icon: 'file:../../icons/tailscale.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Manage your Tailscale tailnet — devices, routes, and more',
        defaults: {
            name: 'Tailscale',
        },
        usableAsTool: true,
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'tailscaleApi',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['apiKey'],
                    },
                },
            },
            {
                name: 'tailscaleOAuth2Api',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['oAuth2'],
                    },
                },
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.tailscale.com',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'options',
                options: [
                    {
                        name: 'API Key',
                        value: 'apiKey',
                    },
                    {
                        name: 'OAuth2',
                        value: 'oAuth2',
                    },
                ],
                default: 'apiKey',
            },
            {
                displayName: 'Tailnet Name or ID',
                name: 'tailnet',
                type: 'options',
                required: true,
                default: '-',
                description: 'Your tailnet organization name. Choose from the list or select "-" for the default tailnet of the authenticated user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                typeOptions: {
                    loadOptionsMethod: 'getTailnets',
                },
            },
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'ACL / Policy',
                        value: 'acl',
                    },
                    {
                        name: 'Auth Key',
                        value: 'authKey',
                    },
                    {
                        name: 'Device',
                        value: 'device',
                    },
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option
                        name: 'DNS',
                        value: 'dns',
                    },
                    {
                        name: 'User',
                        value: 'user',
                    },
                ],
                default: 'device',
            },
            ...aclDescription,
            ...authKeyDescription,
            ...deviceDescription,
            ...dnsDescription,
            ...userDescription,
        ],
    };

    methods = {
        loadOptions: {
            async getTailnets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const authentication =
                    (this.getCurrentNodeParameters()?.authentication as string) ?? 'apiKey';
                const credentialType =
                    authentication === 'oAuth2' ? 'tailscaleOAuth2Api' : 'tailscaleApi';
                const credentials = await this.getCredentials(credentialType);

                const options: INodePropertyOptions[] = [
                    { name: 'Default (-)', value: '-' },
                ];

                if (credentials.tailnet && credentials.tailnet !== '-') {
                    options.push({
                        name: credentials.tailnet as string,
                        value: credentials.tailnet as string,
                    });
                }

                return options;
            },

            async getDevices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const authentication =
                    (this.getCurrentNodeParameters()?.authentication as string) ?? 'apiKey';
                const credentialType =
                    authentication === 'oAuth2' ? 'tailscaleOAuth2Api' : 'tailscaleApi';
                const tailnet =
                    (this.getCurrentNodeParameters()?.tailnet as string) ?? '-';

                const response = await this.helpers.httpRequestWithAuthentication.call(
                        this as unknown as IAllExecuteFunctions,
                        credentialType,
                        {
                            method: 'GET',
                            url: `https://api.tailscale.com/api/v2/tailnet/${encodeURIComponent(tailnet)}/devices`,
                            headers: { Accept: 'application/json' },
                            json: true,
                        },
                    );

                return (response.devices ?? []).map(
                    (d: { hostname: string; name: string; nodeId: string }) => ({
                        name: `${d.hostname} (${d.nodeId})`,
                        value: d.nodeId,
                    }),
                );
            },

            async getAuthKeys(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const authentication =
                    (this.getCurrentNodeParameters()?.authentication as string) ?? 'apiKey';
                const credentialType =
                    authentication === 'oAuth2' ? 'tailscaleOAuth2Api' : 'tailscaleApi';
                const tailnet =
                    (this.getCurrentNodeParameters()?.tailnet as string) ?? '-';

                const response = await this.helpers.httpRequestWithAuthentication.call(
                        this as unknown as IAllExecuteFunctions,
                        credentialType,
                        {
                            method: 'GET',
                            url: `https://api.tailscale.com/api/v2/tailnet/${encodeURIComponent(tailnet)}/keys`,
                            headers: { Accept: 'application/json' },
                            json: true,
                        },
                    );

                return (response.keys ?? []).map(
                    (k: { id: string; description?: string }) => ({
                        name: k.description ? `${k.description} (${k.id})` : k.id,
                        value: k.id,
                    }),
                );
            },

            async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const authentication =
                    (this.getCurrentNodeParameters()?.authentication as string) ?? 'apiKey';
                const credentialType =
                    authentication === 'oAuth2' ? 'tailscaleOAuth2Api' : 'tailscaleApi';
                const tailnet =
                    (this.getCurrentNodeParameters()?.tailnet as string) ?? '-';

                const response = await this.helpers.httpRequestWithAuthentication.call(
                        this as unknown as IAllExecuteFunctions,
                        credentialType,
                        {
                            method: 'GET',
                            url: `https://api.tailscale.com/api/v2/tailnet/${encodeURIComponent(tailnet)}/devices`,
                            headers: { Accept: 'application/json' },
                            json: true,
                        },
                    );

                const tagSet = new Set<string>();
                for (const device of response.devices ?? []) {
                    for (const tag of device.tags ?? []) {
                        tagSet.add(tag as string);
                    }
                }

                return Array.from(tagSet).map((tag) => ({ name: tag, value: tag }));
            },

            async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const authentication =
                    (this.getCurrentNodeParameters()?.authentication as string) ?? 'apiKey';
                const credentialType =
                    authentication === 'oAuth2' ? 'tailscaleOAuth2Api' : 'tailscaleApi';
                const tailnet =
                    (this.getCurrentNodeParameters()?.tailnet as string) ?? '-';

                const response = await this.helpers.httpRequestWithAuthentication.call(
                    this as unknown as IAllExecuteFunctions,
                    credentialType,
                    {
                        method: 'GET',
                        url: `https://api.tailscale.com/api/v2/tailnet/${encodeURIComponent(tailnet)}/users`,
                        headers: { Accept: 'application/json' },
                        json: true,
                    },
                );

                return (response.users ?? []).map(
                    (u: { id: string; displayName?: string; loginName?: string }) => ({
                        name: u.displayName
                            ? `${u.displayName} (${u.loginName ?? u.id})`
                            : (u.loginName ?? u.id),
                        value: u.id,
                    }),
                );
            },
        },
    };
}
