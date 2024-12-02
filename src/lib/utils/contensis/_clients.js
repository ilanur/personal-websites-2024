import { Client } from 'contensis-delivery-api'
import { UniversalClient } from 'contensis-management-api'
import {
	PRIVATE_CONTENSIS_ACCESS_TOKEN,
	PRIVATE_CONTENSIS_CLIENT_ID,
	PRIVATE_CONTENSIS_CLIENT_SECRET
} from '$env/static/private'
import { PUBLIC_CONTENSIS_URL, PUBLIC_CONTENSIS_PROJECT_ID } from '$env/static/public'

// Base configuration for delivery client
const baseDeliveryConfig = {
	rootUrl: PUBLIC_CONTENSIS_URL,
	accessToken: PRIVATE_CONTENSIS_ACCESS_TOKEN,
	projectId: PUBLIC_CONTENSIS_PROJECT_ID
}

// Default delivery client for client-side use
export const DeliveryClient = Client.create(baseDeliveryConfig)

// Management client remains unchanged
export const ManagementClient = UniversalClient.create({
	rootUrl: PUBLIC_CONTENSIS_URL,
	projectId: PUBLIC_CONTENSIS_PROJECT_ID,
	clientType: 'client_credentials',
	clientDetails: {
		clientId: PRIVATE_CONTENSIS_CLIENT_ID,
		clientSecret: PRIVATE_CONTENSIS_CLIENT_SECRET
	}
})
