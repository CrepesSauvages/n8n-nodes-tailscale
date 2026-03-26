import type { INodeProperties } from 'n8n-workflow';

const aclOperation: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['acl'],
		},
	},
	options: [
		{
			name: 'Get',
			value: 'get',
			description: 'Retrieve the current ACL policy for the tailnet',
			action: 'Get ACL policy',
			routing: {
				request: {
					method: 'GET',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/acl',
					headers: {
						Accept: 'application/json',
					},
				},
			},
		},
		{
			name: 'Preview',
			value: 'preview',
			description: 'Preview the access rules for a device under a given policy',
			action: 'Preview ACL policy for a device',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/acl/preview',
					qs: {
						type: "={{ $parameter.previewForIp.includes(':') ? 'ipv6' : 'ipv4' }}",
						previewFor: '={{$parameter.previewForIp}}',
					},
					body: '={{JSON.parse($parameter.aclPolicy)}}',
				},
			},
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Replace the entire ACL policy of the tailnet',
			action: 'Update ACL policy',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/acl',
					body: '={{JSON.parse($parameter.aclPolicy)}}',
				},
			},
		},
		{
			name: 'Validate',
			value: 'validate',
			description: 'Validate an ACL policy without applying it',
			action: 'Validate ACL policy',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/acl/validate',
					body: '={{JSON.parse($parameter.aclPolicy)}}',
				},
				output: {
					postReceive: [
						{
							type: 'set',
							properties: {
								value: '={{ $response.body ?? { "valid": true } }}',
							},
						},
					],
				},
			},
		},
	],
	default: 'get',
};

const aclPolicyField: INodeProperties = {
	displayName: 'Policy (JSON)',
	name: 'aclPolicy',
	type: 'json',
	required: true,
	default: '{}',
	description: 'The ACL policy document as a JSON string. Refer to the <a href="https://tailscale.com/kb/1018/acls/">Tailscale ACL documentation</a> for the expected schema.',
	displayOptions: {
		show: {
			resource: ['acl'],
			operation: ['update', 'validate', 'preview'],
		},
	},
};

const previewForIpField: INodeProperties = {
	displayName: 'Preview For (IP Address)',
	name: 'previewForIp',
	type: 'string',
	required: true,
	default: '',
	placeholder: '100.64.0.1 or fd7a:115c:a1e0::1',
	description: 'A raw IPv4 or IPv6 address (not a hostname or CIDR). The protocol type is detected automatically: addresses containing ":" are treated as IPv6, all others as IPv4.',
	displayOptions: {
		show: {
			resource: ['acl'],
			operation: ['preview'],
		},
	},
};

export const aclDescription: INodeProperties[] = [
	aclOperation,
	aclPolicyField,
	previewForIpField,
];
