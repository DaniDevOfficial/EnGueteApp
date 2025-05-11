import {BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED} from "./HttpResponseCodes";
import {BadRequestError, ForbiddenError, FRONTEND_ERRORS, InternalServerError, UnauthorizedError} from "./Errors";
import {handleAuthorisationKeysFromHeader} from "./Auth";

/**
 * This function checks if a response is okay or not. If its okay it also handles the auth headers. this is just a template function, which handles basic errors and headers.
 * @param response
 */
export async function handleDefaultResponseAndHeaders(response: Response) {
    await handleResponse(response);
    await handleAuthorisationKeysFromHeader(response.headers);
}


export async function handleResponse(response: Response) {

    if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.error || false;
        if (response.status === UNAUTHORIZED) {
            throw new UnauthorizedError(errorMessage ?? FRONTEND_ERRORS.UNAUTHORIZED_ERROR);
        }
        if (response.status === FORBIDDEN) {
            throw new ForbiddenError(errorMessage ?? FRONTEND_ERRORS.FORBIDDEN_ERROR);
        }
        if (response.status === BAD_REQUEST) {
            throw new BadRequestError(errorMessage ?? FRONTEND_ERRORS.BAD_REQUEST_ERROR);
        }
        if (response.status === INTERNAL_SERVER_ERROR) {
            throw new InternalServerError(errorMessage ?? FRONTEND_ERRORS.INTERNAL_SERVER_ERROR);
        }
        if (response.status === NOT_FOUND) {
            throw new Error(errorMessage ?? FRONTEND_ERRORS.NOT_FOUND_ERROR);
        }

        throw new Error(errorMessage ?? FRONTEND_ERRORS.UNKNOWN_ERROR);
    }
}