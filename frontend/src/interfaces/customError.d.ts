interface ResponseError extends Error {
    data?: {
        message?: string
    }
}