import type { INodeProperties } from 'n8n-workflow';

const dnsOperation: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['dns'],
		},
	},
	options: [
		{
			name: 'Get Nameservers',
			value: 'getNameservers',
			description: 'List the global nameservers configured',
			action: 'Get nameservers',
			routing: {
				request: {
					method: 'GET',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/dns/nameservers',
				},
			},
		},
		{
			name: 'Get Preferences',
			value: 'getPreferences',
			description: 'Retrieve DNS preferences (MagicDNS on/off)',
			action: 'Get DNS preferences',
			routing: {
				request: {
					method: 'GET',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/dns/preferences',
				},
			},
		},
		{
			name: 'Get Search Paths',
			value: 'getSearchPaths',
			description: 'List the search domains',
			action: 'Get search paths',
			routing: {
				request: {
					method: 'GET',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/dns/searchpaths',
				},
			},
		},
		{
			name: 'Get Split DNS',
			value: 'getSplitDns',
			description: 'Retrieve the split DNS configuration (domain → nameservers)',
			action: 'Get split DNS',
			routing: {
				request: {
					method: 'GET',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/dns/split-dns',
				},
			},
		},
		{
			name: 'Set Nameservers',
			value: 'setNameservers',
			description: 'Set the global nameservers, replacing all existing ones',
			action: 'Set nameservers',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/dns/nameservers',
				},
			},
		},
		{
			name: 'Set Preferences',
			value: 'setPreferences',
			description: 'Enable or disable MagicDNS',
			action: 'Set DNS preferences',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/dns/preferences',
				},
			},
		},
		{
			name: 'Set Search Paths',
			value: 'setSearchPaths',
			description: 'Set the search domains, replacing all existing ones',
			action: 'Set search paths',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/dns/searchpaths',
				},
			},
		},
		{
			name: 'Set Split DNS',
			value: 'setSplitDns',
			description: 'Replace the entire split DNS configuration',
			action: 'Set split DNS',
			routing: {
				request: {
					method: 'PUT',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/dns/split-dns',
					body: '={{JSON.parse($parameter.splitDnsConfig)}}',
				},
			},
		},
		{
			name: 'Update Split DNS',
			value: 'updateSplitDns',
			description: 'Update certain domains in the split DNS configuration',
			action: 'Update split DNS',
			routing: {
				request: {
					method: 'PATCH',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/dns/split-dns',
					body: '={{JSON.parse($parameter.splitDnsConfig)}}',
				},
			},
		},
	],
	default: 'getNameservers',
};

// ── Set Nameservers ──────────────────────────────────────────────────────────

const nameserversField: INodeProperties = {
	displayName: 'Nameservers',
	name: 'dnsServers',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	required: true,
	default: { values: [] },
	description: 'Global DNS server IP addresses that will replace the current list',
	displayOptions: {
		show: {
			resource: ['dns'],
			operation: ['setNameservers'],
		},
	},
	options: [
		{
			name: 'values',
			displayName: 'Nameserver',
			values: [
				{
					displayName: 'IP Address',
					name: 'ip',
					type: 'string',
					default: '',
					placeholder: '8.8.8.8',
					description: 'The IP address of the DNS nameserver',
				},
			],
		},
	],
	routing: {
		send: {
			type: 'body',
			property: 'dns',
			value: "={{ $value.values?.map((v) => v.ip) ?? [] }}",
		},
	},
};

// ── Set Preferences ──────────────────────────────────────────────────────────

const magicDnsField: INodeProperties = {
	displayName: 'MagicDNS',
	name: 'magicDNS',
	type: 'boolean',
	required: true,
	default: true,
	description: 'Whether to enable MagicDNS for the tailnet',
	displayOptions: {
		show: {
			resource: ['dns'],
			operation: ['setPreferences'],
		},
	},
	routing: {
		send: {
			type: 'body',
			property: 'magicDNS',
			value: '={{$value}}',
		},
	},
};

// ── Set Search Paths ─────────────────────────────────────────────────────────

const searchPathsField: INodeProperties = {
	displayName: 'Search Paths',
	name: 'searchPaths',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	required: true,
	default: { values: [] },
	description: 'DNS search domains that will replace the current list',
	displayOptions: {
		show: {
			resource: ['dns'],
			operation: ['setSearchPaths'],
		},
	},
	options: [
		{
			name: 'values',
			displayName: 'Search Path',
			values: [
				{
					displayName: 'Domain',
					name: 'domain',
					type: 'string',
					default: '',
					placeholder: 'example.com',
					description: 'A DNS search domain',
				},
			],
		},
	],
	routing: {
		send: {
			type: 'body',
			property: 'searchPaths',
			value: "={{ $value.values?.map((v) => v.domain) ?? [] }}",
		},
	},
};

// ── Set / Update Split DNS ───────────────────────────────────────────────────

const splitDnsConfigField: INodeProperties = {
	displayName: 'Split DNS Configuration',
	name: 'splitDnsConfig',
	type: 'json',
	required: true,
	default: '{}',
	description:
		'JSON object mapping domain names to arrays of nameserver IPs. To remove a domain (update only), set its value to null. Example: <code>{"example.com": ["100.100.100.100"], "corp.internal": ["10.0.0.1"]}</code>',
	displayOptions: {
		show: {
			resource: ['dns'],
			operation: ['setSplitDns', 'updateSplitDns'],
		},
	},
};

export const dnsDescription: INodeProperties[] = [
	dnsOperation,
	nameserversField,
	magicDnsField,
	searchPathsField,
	splitDnsConfigField,
];
