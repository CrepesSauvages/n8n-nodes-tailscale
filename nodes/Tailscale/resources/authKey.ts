import type { INodeProperties } from 'n8n-workflow';

const authKeyOperation: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['authKey'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new auth key for the tailnet',
			action: 'Create an auth key',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/keys',
					body: {
						capabilities: {
							devices: {
								create: {
									reusable: '={{$parameter.reusable}}',
									ephemeral: '={{$parameter.ephemeral}}',
									preauthorized: '={{$parameter.preauthorized}}',
									tags: '={{$parameter.keyTags?.length > 0 ? $parameter.keyTags : []}}',
								},
							},
						},
						expirySeconds: '={{$parameter.expirySeconds > 0 ? $parameter.expirySeconds : undefined}}',
						description: '={{$parameter.keyDescription || undefined}}',
					},
				},
			},
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete an auth key',
			action: 'Delete an auth key',
			routing: {
				request: {
					method: 'DELETE',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/keys/{{$parameter.keyId}}',
				},
				output: {
					postReceive: [
						{
							type: 'set',
							properties: {
								value: '={{ { "success": true, "keyId": $parameter.keyId } }}',
							},
						},
					],
				},
			},
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Retrieve an auth key by ID',
			action: 'Get an auth key',
			routing: {
				request: {
					method: 'GET',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/keys/{{$parameter.keyId}}',
				},
			},
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'List all auth keys for the tailnet',
			action: 'Get many auth keys',
			routing: {
				request: {
					method: 'GET',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/keys',
				},
				output: {
					postReceive: [
						{
							type: 'rootProperty',
							properties: {
								property: 'keys',
							},
						},
					],
				},
			},
		},
	],
	default: 'getMany',
};

// ── Key ID field ─────────────────────────────────────────────────────────────

const keyIdField: INodeProperties = {
	displayName: 'Key Name or ID',
	name: 'keyId',
	type: 'options',
	required: true,
	default: '',
	description: 'The auth key to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	typeOptions: {
		loadOptionsMethod: 'getAuthKeys',
	},
	displayOptions: {
		show: {
			resource: ['authKey'],
			operation: ['get', 'delete'],
		},
	},
};

// ── Create fields ─────────────────────────────────────────────────────────────

const reusableField: INodeProperties = {
	displayName: 'Reusable',
	name: 'reusable',
	type: 'boolean',
	default: false,
	description: 'Whether this key can be used more than once',
	displayOptions: {
		show: {
			resource: ['authKey'],
			operation: ['create'],
		},
	},
};

const ephemeralField: INodeProperties = {
	displayName: 'Ephemeral',
	name: 'ephemeral',
	type: 'boolean',
	default: false,
	description: 'Whether devices registered with this key are ephemeral (removed when they disconnect)',
	displayOptions: {
		show: {
			resource: ['authKey'],
			operation: ['create'],
		},
	},
};

const preauthorizedField: INodeProperties = {
	displayName: 'Preauthorized',
	name: 'preauthorized',
	type: 'boolean',
	default: false,
	description: 'Whether devices registered with this key are pre-authorized (no manual approval needed)',
	displayOptions: {
		show: {
			resource: ['authKey'],
			operation: ['create'],
		},
	},
};

const keyTagsField: INodeProperties = {
	displayName: 'Tag Names or IDs',
	name: 'keyTags',
	type: 'multiOptions',
	default: [],
	description: 'ACL tags to assign to devices registered with this key. Each tag must start with "tag:". Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	typeOptions: {
		loadOptionsMethod: 'getTags',
	},
	displayOptions: {
		show: {
			resource: ['authKey'],
			operation: ['create'],
		},
	},
};

const expirySecondsField: INodeProperties = {
	displayName: 'Expiry (Seconds)',
	name: 'expirySeconds',
	type: 'number',
	default: 86400,
	description: 'Lifetime of the key in seconds. Set to 0 for no expiry.',
	displayOptions: {
		show: {
			resource: ['authKey'],
			operation: ['create'],
		},
	},
};

const keyDescriptionField: INodeProperties = {
	displayName: 'Description',
	name: 'keyDescription',
	type: 'string',
	default: '',
	description: 'Human-readable description for the key',
	displayOptions: {
		show: {
			resource: ['authKey'],
			operation: ['create'],
		},
	},
};

export const authKeyDescription: INodeProperties[] = [
	authKeyOperation,
	keyIdField,
	reusableField,
	ephemeralField,
	preauthorizedField,
	keyTagsField,
	expirySecondsField,
	keyDescriptionField,
];
