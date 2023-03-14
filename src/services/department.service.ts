import Department from "../models/department.model";
import CustomError from "../utils/custom-error";

class DepartmentService {
    async create(name: string) {
        return await new Department({ name }).save();
    }

    async getAll() {
        return await Department.find();
    }

    async getOne(departmentId: string) {
        const department = await Department.findOne({ _id: departmentId });
        if (!department) throw new CustomError("department does not exist");

        return department;
    }

    async update(departmentId: string, name: string) {
        const department = await Department.findOne({ _id: departmentId });
        if (!department) throw new CustomError("department does not exist");

        department.name = name;
        return await department.save();
    }

    async delete(departmentId: string) {
        const department = await Department.findOne({ _id: departmentId });
        if (!department) throw new CustomError("department does not exist");

        return await department.remove();
    }
}

export default new DepartmentService();
