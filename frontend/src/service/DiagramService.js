import {
    API_URL
} from '../utils';

export const listDiagram = async () => {
    let res= await fetch(`${API_URL}/diagrams/list/`, {
        method: "GET",
    })
    console.log(res.json())
}