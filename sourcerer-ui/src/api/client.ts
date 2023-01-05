export async function client(endpoint: string, {body, ...customConfig}: any = {}) {
    const headers = {'Content-Type': 'application/json'}

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
        if (data?.error) {
            return Promise.reject(data.error)
        }
        return Promise.reject(err.message ? err.message : data)
    }
}

client.get = function (endpoint: string, customConfig = {}) {
    return client(endpoint, {
        headers: {Authorization: "Bearer " + window.localStorage.getItem('sourcer_token')},
        ...customConfig, method: 'GET'})
}

client.post = function (endpoint: string, body: any, customConfig = {}) {
    return client(endpoint, {
        headers: {Authorization: "Bearer " + window.localStorage.getItem('sourcer_token')},
        ...customConfig, body})
}