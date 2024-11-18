// $lib/contensis-clients.js
import { Client as DC } from 'contensis-delivery-api'
import { UniversalClient } from 'contensis-management-api'
import {
	PRIVATE_CONTENSIS_ACCESS_TOKEN,
	PRIVATE_CONTENSIS_CLIENT_ID,
	PRIVATE_CONTENSIS_CLIENT_SECRET
} from '$env/static/private'
import {
	PUBLIC_CONTENSIS_URL,
	PUBLIC_CONTENSIS_PROJECT_ID_EUI_WEBSITE,
	PUBLIC_CONTENSIS_PROJECT_ID_PERSONAL_WEBSITES
} from '$env/static/public'

const baseConfig = {
	rootUrl: PUBLIC_CONTENSIS_URL,
	accessToken: PRIVATE_CONTENSIS_ACCESS_TOKEN
}

export const EuiDeliveryClient = DC.create({
	...baseConfig,
	projectId: PUBLIC_CONTENSIS_PROJECT_ID_EUI_WEBSITE
})

export const PwDeliveryClient = DC.create({
	...baseConfig,
	projectId: PUBLIC_CONTENSIS_PROJECT_ID_PERSONAL_WEBSITES
})

export const PwManagementClient = UniversalClient.create({
	rootUrl: PUBLIC_CONTENSIS_URL,
	projectId: PUBLIC_CONTENSIS_PROJECT_ID_PERSONAL_WEBSITES,
	clientType: 'client_credentials',
	clientDetails: {
		clientId: PRIVATE_CONTENSIS_CLIENT_ID,
		clientSecret: PRIVATE_CONTENSIS_CLIENT_SECRET
	}
})
