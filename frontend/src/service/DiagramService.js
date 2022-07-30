import {
    API_URL
} from '../utils';

export const listDiagram = async () => {
    return await fetch(`${API_URL}/diagrams/list/`, {
        method: "GET",
    })
}

export const deleteDiagram = async (diagramId) => {
return await fetch(`${API_URL}/diagrams/delete/${diagramId}`, {
    method: "DELETE",
})
}