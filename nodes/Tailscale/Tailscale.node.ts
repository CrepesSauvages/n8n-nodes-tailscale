import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { deviceDescription } from './resources/device';

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
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Device',
                        value: 'device',
                    },
                ],
                default: 'device',
            },
            ...deviceDescription,
        ],
    };
}
