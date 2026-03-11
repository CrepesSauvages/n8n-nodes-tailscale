import type { INodeProperties } from 'n8n-workflow';

const getOperation: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
        show: {
            resource: ['device'],
        },
    },
    options: [
        {
            name: 'Authorize',
            value: 'authorize',
            description: 'Authorize a pending device',
            action: 'Authorize a device',
            routing: {
                request: {
                    method: 'POST',
                    url: '=/api/v2/device/{{$parameter.deviceId}}/authorized',
                    body: {
                        authorized: true,
                    },
                },
            },
        },
        {
            name: 'Delete',
            value: 'delete',
            description: 'Delete a device from the tailnet',
            action: 'Delete a device',
            routing: {
                request: {
                    method: 'DELETE',
                    url: '=/api/v2/device/{{$parameter.deviceId}}',
                },
            },
        },
        {
            name: 'Expire Key',
            value: 'expireKey',
            description: 'Expire the key of a device',
            action: 'Expire key of a device',
            routing: {
                request: {
                    method: 'POST',
                    url: '=/api/v2/device/{{$parameter.deviceId}}/expire',
                },
            },
        },
        {
            name: 'Get',
            value: 'get',
            description: 'Retrieve a device by ID',
            action: 'Get a device',
            routing: {
                request: {
                    method: 'GET',
                    url: '=/api/v2/device/{{$parameter.deviceId}}',
                },
            },
        },
        {
            name: 'Get Many',
            value: 'getMany',
            description: 'Retrieve all devices in the tailnet',
            action: 'Get many devices',
            routing: {
                request: {
                    method: 'GET',
                    url: '=/api/v2/tailnet/{{$parameter.tailnet}}/devices',
                },
                output: {
                    postReceive: [
                        {
                            type: 'rootProperty',
                            properties: {
                                property: 'devices',
                            },
                        },
                    ],
                },
            },
        },
        {
            name: 'Get Routes',
            value: 'getRoutes',
            description: 'Retrieve the subnet routes of a device',
            action: 'Get routes of a device',
            routing: {
                request: {
                    method: 'GET',
                    url: '=/api/v2/device/{{$parameter.deviceId}}/routes',
                },
            },
        },
        {
            name: 'Update Tags',
            value: 'updateTags',
            description: 'Update the ACL tags of a device',
            action: 'Update tags of a device',
            routing: {
                request: {
                    method: 'POST',
                    url: '=/api/v2/device/{{$parameter.deviceId}}/tags',
                },
            },
        },
    ],
    default: 'getMany',
};

const deviceIdField: INodeProperties = {
    displayName: 'Device ID',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the device (nodeId)',
    displayOptions: {
        show: {
            resource: ['device'],
            operation: ['get', 'delete', 'expireKey', 'authorize', 'updateTags', 'getRoutes'],
        },
    },
};

const tagsField: INodeProperties = {
    displayName: 'Tags',
    name: 'tags',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'tag:server,tag:production',
    description:
        'Comma-separated list of ACL tags to assign (e.g. "tag:server,tag:production"). Each tag must start with "tag:".',
    displayOptions: {
        show: {
            resource: ['device'],
            operation: ['updateTags'],
        },
    },
    routing: {
        send: {
            type: 'body',
            property: 'tags',
            value: '={{$value.split(",").map(t => t.trim())}}',
        },
    },
};

export const deviceDescription: INodeProperties[] = [getOperation, deviceIdField, tagsField];
