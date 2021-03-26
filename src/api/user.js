import {SERVER_URL} from '../constants';

export const loadUserSchema = () => {
    return fetch(SERVER_URL, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(`Error loading user schema: ${JSON.stringify(response)}`);
    }).catch(error => {
        return Promise.reject(error);
    })
}

export const saveApplication = (application) => {
    return fetch(SERVER_URL, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(application),
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.text()
            .then(message => Promise.reject(message));
    }).catch(error => {
        return Promise.reject(error);
    })
}
