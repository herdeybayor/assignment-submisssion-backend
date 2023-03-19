export type ResultDataInput = {
    attachment: string;
    assignment: string;
};

export type GetResultsInput = {
    limit?: number;
    next?: string;
    user?: string;
    assignment?: string;
};
