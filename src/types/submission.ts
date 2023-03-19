export type SubmissionDataInput = {
    answer: string;
    attachment?: string;
    assignment: string;
};

export type GetSubmissionsInput = {
    limit?: number;
    next?: string;
    assignment?: string;
    user?: string;
};
