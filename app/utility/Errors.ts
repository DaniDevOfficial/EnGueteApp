export class UnauthorizedError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class BadRequestError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'BadRequestError';
    }
}

export class InternalServerError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'InternalServerError';
    }
}

export class DoNothingError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'InternalServerError';
    }
}

export class ForbiddenError extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}