import type { Level } from "./user";

export type AssignmentDataInput = {
    title: string;
    description: string;
    attachment: string;
    dueDate: Date;
    level: Level;
    departments: string[];
};

export type GetAssignmentsInput = {
    limit?: number;
    next?: string;
    level?: Level;
    departments?: string[];
    createdBy?: string;
};
