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
                output: {
                    postReceive: [
                        {
                            type: 'set',
                            properties: {
                                value: '={{ { "success": true, "deviceId": $parameter.deviceId } }}',
                            },
                        },
                    ],
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
                output: {
                    postReceive: [
                        {
                            type: 'set',
                            properties: {
                                value: '={{ { "success": true, "deviceId": $parameter.deviceId } }}',
                            },
                        },
                    ],
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
                output: {
                    postReceive: [
                        {
                            type: 'set',
                            properties: {
                                value: '={{ { "success": true, "deviceId": $parameter.deviceId } }}',
                            },
                        },
                    ],
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
            name: 'Set Name',
            value: 'setName',
            description: 'Set the name of a device',
            action: 'Set name of a device',
            routing: {
                request: {
                    method: 'POST',
                    url: '=/api/v2/device/{{$parameter.deviceId}}/name',
                },
                output: {
                    postReceive: [
                        {
                            type: 'set',
                            properties: {
                                value: '={{ { "success": true, "deviceId": $parameter.deviceId } }}',
                            },
                        },
                    ],
                },
            },
        },
        {
            name: 'Set Routes',
            value: 'setRoutes',
            description: 'Set the subnet routes of a device',
            action: 'Set routes of a device',
            routing: {
                request: {
                    method: 'POST',
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
    displayName: 'Device Name or ID',
    name: 'deviceId',
    type: 'options',
    required: true,
    default: '',
    description: 'The device to operate on. Choose from the list or enter a node ID manually. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    typeOptions: {
        loadOptionsMethod: 'getDevices',
    },
    displayOptions: {
        show: {
            resource: ['device'],
            operation: ['get', 'delete', 'expireKey', 'authorize', 'updateTags', 'getRoutes', 'setRoutes', 'setName'],
        },
    },
};

const tagsField: INodeProperties = {
    displayName: 'Tag Names or IDs',
    name: 'tags',
    type: 'multiOptions',
    required: true,
    default: [],
    description: 'ACL tags to assign to the device. Tags are collected from existing devices in the tailnet. Each tag must start with "tag:". Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    typeOptions: {
        loadOptionsMethod: 'getTags',
    },
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
            value: '={{$value}}',
        },
    },
};

const routesField: INodeProperties = {
    displayName: 'Routes',
    name: 'routes',
    type: 'fixedCollection',
    typeOptions: {
        multipleValues: true,
    },
    required: true,
    default: { values: [] },
    description: 'Subnet routes to advertise for this device (CIDR notation)',
    options: [
        {
            displayName: 'Route',
            name: 'values',
            values: [
                {
                    displayName: 'CIDR',
                    name: 'route',
                    type: 'string',
                    default: '',
                    placeholder: '10.0.0.0/8',
                    description: 'A subnet route in CIDR notation',
                },
            ],
        },
    ],
    displayOptions: {
        show: {
            resource: ['device'],
            operation: ['setRoutes'],
        },
    },
    routing: {
        send: {
            type: 'body',
            property: 'routes',
            value: '={{ ($parameter.routes.values ?? []).map(r => r.route) }}',
        },
    },
};

const deviceNameField: INodeProperties = {
    displayName: 'Name',
    name: 'deviceName',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'my-device',
    description: 'The new name for the device',
    displayOptions: {
        show: {
            resource: ['device'],
            operation: ['setName'],
        },
    },
    routing: {
        send: {
            type: 'body',
            property: 'name',
            value: '={{$value}}',
        },
    },
};

export const deviceDescription: INodeProperties[] = [getOperation, deviceIdField, tagsField, routesField, deviceNameField];
