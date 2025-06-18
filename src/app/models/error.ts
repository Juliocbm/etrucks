interface ValidationError {
    [key: string]: string[]; // Un índice de tipo string que devuelve un array de strings
}

interface ErrorResponse {
    type: string;
    title: string;
    status: number;
    traceId: string;
    errors: ValidationError;
}

interface HttpError {
    headers: {
        normalizedNames: {};
        lazyUpdate: null;
    };
    status: number;
    statusText: string;
    url: string;
    ok: boolean;
    name: string;
    message: string;
    error: ErrorResponse;
}
