import {api} from "./_api"

export async function get({params}) {
    return api({method: "GET"}, params.ing)
}