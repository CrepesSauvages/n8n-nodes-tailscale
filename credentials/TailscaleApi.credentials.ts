import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class TailscaleApi implements ICredentialType {
    name = 'tailscaleApi';

    displayName = 'Tailscale API';

    icon = 'file:../icons/tailscale.svg' as const;

    documentationUrl = 'https://tailscale.com/kb/1101/api';

    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'API key generated from the Tailscale admin console (Keys page)',
        },
        {
            displayName: 'Tailnet',
            name: 'tailnet',
            type: 'string',
            default: '-',
            description:
                'Your tailnet organization name (e.g. "example.com") or "-" to use the default tailnet for the authenticated user',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.tailscale.com',
            url: '=/api/v2/tailnet/{{$credentials.tailnet}}/devices',
            method: 'GET',
        },
    };
}
