import {retrieveRecommendations} from "$lib/database"

export const api = async (request) => {
    let status = 500
    let body = {}

    switch(request.method.toUpperCase()) {
        case "GET":
            let response = await retrieveRecommendations(request.params.ing)

            body = response.body
            status = response.status;
            break;
        default:
            break;
    }

    return {status, body}
}