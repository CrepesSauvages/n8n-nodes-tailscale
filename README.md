# n8n-nodes-tailscale

This is an n8n community node for [Tailscale](https://tailscale.com). It lets you manage your tailnet devices directly from n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Device

| Operation | Description |
|---|---|
| **Get** | Retrieve a device by ID |
| **Get Many** | List all devices in the tailnet |
| **Delete** | Remove a device from the tailnet |
| **Expire Key** | Expire the key of a device |
| **Authorize** | Authorize a pending device |
| **Update Tags** | Update the ACL tags of a device |
| **Get Routes** | Retrieve subnet routes of a device |


### DNS
| Operation | Description |
|---|---|
| **Get Nameservers** | List the global nameservers configured |
| **Get Preferences** | Retrieve DNS preferences (MagicDNS on/off) |
| **Get Search Paths** | List the search domains |
| **Get Split DNS** | Retrieve the split DNS configuration (domain → nameservers) |
| **Set Nameservers** | Set the global nameservers, replacing all existing ones |
| **Set Preferences** | Enable or disable MagicDNS |
| **Set Search Paths** | Set the search domains, replacing all existing ones |
| **Set Split DNS** | Replace the entire split DNS configuration |
| **Update Split DNS** | Update certain domains in the split DNS configuration |


## Credentials

This node supports two authentication methods:

- **API Key** — Generate from the [Tailscale admin console](https://login.tailscale.com/admin/settings/keys)
- **OAuth2 (Client Credentials)** — Create an OAuth client from the [Tailscale admin console](https://login.tailscale.com/admin/settings/oauth)

Both require you to specify your **tailnet** (organization name or `-` for the default).

## Resources

- [Tailscale API Documentation](https://tailscale.com/api)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Repository](https://github.com/CrepesSauvages/n8n-nodes-tailscale)

## License

[MIT](LICENSE)
