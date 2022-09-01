import {
    API_URL
} from '../utils';

export const getRecommendations = async (data) => {
    let keyword = String(data)
    return await fetch(`${API_URL}/association_rules/list/${keyword}`, {
        method: "GET",
    }).then(response => response.json())
}