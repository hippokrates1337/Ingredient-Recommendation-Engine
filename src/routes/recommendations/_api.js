import {retrieveNNRecommendations, retrievePopularIngredients, retrievePopularRecommendations} from "$lib/database"

export const api = async (request) => {
    let status = 500
    let body = {}

    switch(request.method.toUpperCase()) {
        case "GET":
            let response
            if(request.params.ing) {
                response = await retrievePopularRecommendations(request.params.ing)
                await retrieveNNRecommendations(request.params.ing)
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