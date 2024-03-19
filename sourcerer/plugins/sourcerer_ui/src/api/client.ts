export async function client(endpoint: string, {body, ...customConfig}: any = {}) {
    const headers = {
        'Content-Type': 'application/json',
    }

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    }

    if (body) {
        config.body = JSON.stringify(body)
    }

    let data
    try {
        const response = await window.fetch(endpoint, config)
        data = await response.json()
        if (response.ok) {
            return data
        }
        throw new Error(response.statusText)
    } catch (err: any) {
        if (err.message === 'Unauthorized') {
            // eslint-disable-next-line no-restricted-globals
            location.assign("/authenticate")
        }
        if (data?.error) {
            return Promise.reject(data.error)
        }
        return Promise.reject(err.message ? err.message : data)
    }
}

function authToken(){
    return {Authorization: "Bearer " + window.localStorage.getItem('sourcer_token')}
}

client.get = function (endpoint: string, customConfig = {}) {
    return client(endpoint, {headers: authToken(), ...customConfig})
}

client.post = function (endpoint: string, body: any, customConfig = {}) {
    return client(endpoint, {headers: authToken(), ...customConfig, body})
}

client.delete = function (endpoint: string, customConfig = {}) {
    return client(endpoint, {headers: authToken(), ...customConfig, method: 'DELETE'})
}
