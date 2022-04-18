import {retrievePopularIngredients, retrievePopularRecommendations} from "$lib/database"

export const api = async (request, data) => {
    let status = 500
    let body = {}

    switch(request.method.toUpperCase()) {
        case "GET":
            let response
            if(data) {
                response = await retrievePopularRecommendations(data)
            } else {
                response = await retrievePopularIngredients()
            }
            
            body = response.body
            status = response.status;
            break;
        default:
            break;
    }

    return {status, body}
}