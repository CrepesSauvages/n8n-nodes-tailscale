import type { INodeProperties } from 'n8n-workflow';

const userOperation: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['user'],
		},
	},
	options: [
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a user from the tailnet',
			action: 'Delete a user',
			routing: {
				request: {
					method: 'DELETE',
					url: '=/api/v2/user/{{$parameter.userId}}',
				},
				output: {
					postReceive: [
						{
							type: 'set',
							properties: {
								value: '={{ { "success": true, "userId": $parameter.userId } }}',
							},
						},
					],
				},
			},
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Retrieve a user by ID',
			action: 'Get a user',
			routing: {
				request: {
					method: 'GET',
					url: '=/api/v2/user/{{$parameter.userId}}',
				},
			},
		},
		{
			name: 'Get Many',
			value: 'getMany',
			description: 'Retrieve all users in the tailnet',
			action: 'Get many users',
			routing: {
				request: {
					method: 'GET',
					url: '=/api/v2/tailnet/{{$parameter.tailnet}}/users',
				},
				output: {
					postReceive: [
						{
							type: 'rootProperty',
							properties: {
								property: 'users',
							},
						},
					],
				},
			},
		},
		{
			name: 'Restore',
			value: 'restore',
			description: 'Restore a suspended user',
			action: 'Restore a user',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/user/{{$parameter.userId}}/restore',
				},
				output: {
					postReceive: [
						{
							type: 'set',
							properties: {
								value: '={{ { "success": true, "userId": $parameter.userId } }}',
							},
						},
					],
				},
			},
		},
		{
			name: 'Set Role',
			value: 'setRole',
			description: 'Set the role of a user',
			action: 'Set role of a user',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/user/{{$parameter.userId}}/role',
				},
			},
		},
		{
			name: 'Suspend',
			value: 'suspend',
			description: 'Suspend a user',
			action: 'Suspend a user',
			routing: {
				request: {
					method: 'POST',
					url: '=/api/v2/user/{{$parameter.userId}}/suspend',
				},
				output: {
					postReceive: [
						{
							type: 'set',
							properties: {
								value: '={{ { "success": true, "userId": $parameter.userId } }}',
							},
						},
					],
				},
			},
		},
	],
	default: 'getMany',
};

const userIdField: INodeProperties = {
	displayName: 'User Name or ID',
	name: 'userId',
	type: 'options',
	required: true,
	default: '',
	description: 'The user to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	typeOptions: {
		loadOptionsMethod: 'getUsers',
	},
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['get', 'delete', 'suspend', 'restore', 'setRole'],
		},
	},
};

const roleField: INodeProperties = {
	displayName: 'Role',
	name: 'role',
	type: 'options',
	required: true,
	default: 'member',
	description: 'The role to assign to the user',
	options: [
		{ name: 'Admin', value: 'admin' },
		{ name: 'Billing Admin', value: 'billing-admin' },
		{ name: 'Member', value: 'member' },
		{ name: 'Owner', value: 'owner' },
	],
	displayOptions: {
		show: {
			resource: ['user'],
			operation: ['setRole'],
		},
	},
	routing: {
		send: {
			type: 'body',
			property: 'role',
			value: '={{$value}}',
		},
	},
};

export const userDescription: INodeProperties[] = [userOperation, userIdField, roleField];
