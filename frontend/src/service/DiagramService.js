import {
    API_URL
} from '../utils';

export const createDiagram = async (data) => {
    return await fetch(`${API_URL}/diagrams/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': String(data.name),
            'description': String(data.description),
            'xml': String(data.xml),
        })
    }).then(response => response.json())
}

export const listDiagram = async () => {
    let res = await fetch(`${API_URL}/diagrams/list/`, {
        method: "GET",
    })
}

export const getDiagram = async (diagramId) => {
    return await fetch(`${API_URL}/diagrams/get/${diagramId}`, {
        method: "GET",
    }).then(response => response.json())
}

export const updateDiagram = async (data, diagramId) => {
    return await fetch(`${API_URL}/diagrams/update/${diagramId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': String(data.name),
            'description': String(data.description),
            'xml': String(data.xml),
        })
    }).then(response => response.json())
}