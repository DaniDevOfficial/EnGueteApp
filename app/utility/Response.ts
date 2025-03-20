import {BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, UNAUTHORIZED} from "./HttpResponseCodes";
import {BadRequestError, ForbiddenError, InternalServerError, UnauthorizedError} from "./Errors";
import {handleAuthorisationKeysFromHeader} from "./Auth";

/**
 * This function checks if a response is okay or not. If its okay it also handles the auth headers. this is just a template function, which handles basic errors and headers.
 * @param response
 */
export async function handleDefaultResponseAndHeaders(response: Response) {
    if (!response.ok) {
        if (response.status === UNAUTHORIZED) {
            throw new UnauthorizedError('Not authorized');
        }
        if (response.status === FORBIDDEN) {
            throw new ForbiddenError('You are not allowed to access these Resources');
        }
        if (response.status === BAD_REQUEST) {
            throw new BadRequestError('Wrong data provided');
        }
        if (response.status === INTERNAL_SERVER_ERROR) {
            throw new InternalServerError("Internal server error");
        }
        throw new Error('An unexpected error occurred');
    }

    await handleAuthorisationKeysFromHeader(response.headers);
}

