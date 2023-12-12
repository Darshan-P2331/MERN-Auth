export const isResponseError = (obj: any): obj is ResponseError => {
    return 'data' in obj
}