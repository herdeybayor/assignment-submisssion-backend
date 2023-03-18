import type { Level } from "./user";

export type AssignmentDataInput = {
    title: string;
    description: string;
    attachment: string;
    dueDate: Date;
    level: Level;
    department: string;
};
