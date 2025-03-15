import axios from 'axios'
import { config } from 'dotenv'
import { ChatwootParams, ConnectInstance, ConnectionStatus, CreateInstanceResponse, events, WRCInstance } from './wrc-sdk-types'

config()

const baseURL = process.env.WRC_BASE_URL
const apiKey = process.env.WRC_API_KEY

export async function fetchInstances(): Promise<WRCInstance[]> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        const response = await axios.get<WRCInstance[]>(`${baseURL}/instance/fetchInstances`, {
            headers: {
                'apiKey': `${apiKey}`,
            },
        })

        return response.data
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching instances:', error.message)
        } else if (axios.isAxiosError(error) && error.response) {
            console.error('Error fetching instances:', error.response.data)
        } else {
            console.error('Error desconocido al obtener instancias')
        }
        throw error
    }
}

export async function fetchInstance(instanceName: string): Promise<WRCInstance | null> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        const response = await axios.get<WRCInstance[]>(`${baseURL}/instance/fetchInstances`, {
            headers: {
                'apiKey': `${apiKey}`,
            },
            params: {
                instanceName: instanceName || '',
            },
        })

        return response.data[0]
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        
        if (error instanceof Error) {
            console.error('Error fetching instances:', error.message)
        } else if (axios.isAxiosError(error) && error.response) {
            console.error('Error fetching instances:', error.response.data)
        } else {
            console.error('Error desconocido al obtener instancias')
        }
        throw error
    }
}


export async function createInstanceBasic(instanceName: string): Promise<CreateInstanceResponse> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        const response = await axios.post<CreateInstanceResponse>(`${baseURL}/instance/create`, 
        { 
            instanceName,
            groupsIgnore: true, 
            qrcode: false,
            integration: "WHATSAPP-BAILEYS",
        }, 
        {
            headers: {
                'apiKey': `${apiKey}`,
            },
        })

        return response.data
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating instance:', error.message)
        } else if (axios.isAxiosError(error) && error.response) {
            console.error('Error creating instance:', error.response.data)
        } else {
            console.error('Error desconocido al crear la instancia')
        }
        throw error
    }
}

// https://wapi.raphauy.dev/instance/connectionState/{instanceName}
export async function connectionState(instanceName: string): Promise<ConnectionStatus> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        const response = await axios.get(`${baseURL}/instance/connectionState/${instanceName}`, {
            headers: {
                'apiKey': `${apiKey}`,
            },
        })

        return response.data.instance
    } catch (error: unknown) {
        throw error
    }
}

// https://wapi.raphauy.dev/instance/logout/{instanceName} (DELETE)
export async function logoutInstance(instanceName: string): Promise<WRCInstance | null> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        const response = await axios.delete<WRCInstance>(`${baseURL}/instance/logout/${instanceName}`, {
            headers: {
                'apiKey': `${apiKey}`,
            },
        })

        return response.data
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Error logout instance:', error.response.data)
        } else {
            console.error('Error desconocido al logout instance')
        }
        return null
    }
}

// https://wapi.raphauy.dev/instance/delete/{instanceName} (DELETE)
export async function deleteInstance(instanceName: string): Promise<WRCInstance> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        const response = await axios.delete<WRCInstance>(`${baseURL}/instance/delete/${instanceName}`, {
            headers: {
                'apiKey': `${apiKey}`,
            },
        })

        return response.data
    } catch (error: unknown) {
        throw error
    }
}

// https://wapi.raphauy.dev/instance/connect/{instanceName} (GET)
export async function connectInstance(instanceName: string): Promise<string | null> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        const response = await axios.get<ConnectInstance>(`${baseURL}/instance/connect/${instanceName}`, {
            headers: {
                'apiKey': `${apiKey}`,
            },
        })

        return response.data.code
    } catch (error: unknown) {
        throw error
    }
}

// https://wapi.raphauy.dev/instance/restart/{instanceName} (PUT)
export async function restartInstance(instanceName: string): Promise<WRCInstance> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        const response = await axios.put<WRCInstance>(`${baseURL}/instance/restart/${instanceName}`, {
            headers: {
                'apiKey': `${apiKey}`,
            },
        })

        return response.data
    } catch (error: unknown) {
        //         throw error.response?.data || error.response || error;
        if (axios.isAxiosError(error) && error.response) {
            console.error('Error restarting instance:', error.response.data)
        } else {
            console.error('Error desconocido al reiniciar la instancia')
        }
        throw error
    }
}

export async function enableChatwoot(instanceName: string, params: ChatwootParams): Promise<boolean> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        const response = await axios.post<ChatwootParams>(`${baseURL}/chatwoot/set/${instanceName}`, params, {
            headers: {
                'apiKey': `${apiKey}`,
                'Content-Type': 'application/json',
            },
        })
        console.log(response)

        if (response.status === 200) {
            return true
        } else {
            return false
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Error setting chatwoot:', error.response)
        } else {
            console.error('Error desconocido al setear chatwoot')
        }
        return false
    }
}

export async function disableChatwoot(instanceName: string): Promise<boolean> {
    const params = {
        enabled: false,
    }

    try {
        const response = await axios.post<ChatwootParams>(`${baseURL}/chatwoot/set/${instanceName}`, params, {
            headers: {
                'apiKey': `${apiKey}`,
            },
        })

        return true
    } catch (error: unknown) {
        throw error
    }
}

export async function sendText(instanceName: string, phone: string, text: string): Promise<boolean> {
    if (!baseURL || !apiKey) {
        throw new Error('WRC_BASE_URL or WRC_API_KEY is not set')
    }

    try {
        await axios.post(`${baseURL}/message/sendText/${instanceName}`, {
            number: phone,
            text,
        }, {
            headers: {
                'apiKey': `${apiKey}`,
            },
        })

        return true
    } catch (error: unknown) {
        throw error
    }

}

