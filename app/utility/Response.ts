import {BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED} from "./HttpResponseCodes";
import {BadRequestError, ForbiddenError, InternalServerError, UnauthorizedError} from "./Errors";
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
            throw new UnauthorizedError(errorMessage ?? 'unauthorizedError');
        }
        if (response.status === FORBIDDEN) {
            throw new ForbiddenError(errorMessage ?? 'forbiddenError');
        }
        if (response.status === BAD_REQUEST) {
            throw new BadRequestError(errorMessage ?? 'badRequestError');
        }
        if (response.status === INTERNAL_SERVER_ERROR) {
            throw new InternalServerError(errorMessage ?? "serverError");
        }
        if (response.status === NOT_FOUND) {
            throw new Error(errorMessage ?? 'notFoundError');
        }

        throw new Error(errorMessage ?? 'errorOccurred');
    }
}