import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TailscaleOAuth2Api implements ICredentialType {
    name = 'tailscaleOAuth2Api';

    extends = ['oAuth2Api'];

    displayName = 'Tailscale OAuth2 API';

    icon = 'file:../icons/tailscale.svg' as const;

    documentationUrl = 'https://tailscale.com/kb/1215/oauth-clients';

    properties: INodeProperties[] = [
        {
            displayName: 'Grant Type',
            name: 'grantType',
            type: 'hidden',
            default: 'clientCredentials',
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: 'https://api.tailscale.com/api/v2/oauth/token',
        },
        {
            displayName: 'Authentication',
            name: 'authentication',
            type: 'hidden',
            default: 'body',
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
}
