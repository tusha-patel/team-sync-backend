import "dotenv/config"
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";


const seedRoles = async () => {
    console.log("Seeding roles stared ...");

    try {
        await connectDatabase();
        const session = await mongoose.startSession();
        session.startTransaction();
        console.log("Clearing existing roles...");

        await RoleModel.deleteMany({}, { session });

        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];
            const existingRole = await RoleModel.findOne({ name: role })
                .session(session);
            if (!existingRole) {
                const newRole = new RoleModel({
                    name: role,
                    permissions: permissions,
                });                
                await newRole.save({ session });
            } else {
                console.log(`Role ${role} already exists, skipping creation.`);
            }

        }

        await session.commitTransaction();
        console.log("Transaction committed");
        session.endSession();
        console.log("session ended");
        console.log("seeding roles completed successfully.");
    } catch (error) {
        console.log("Error seeding roles:", error);
    }
}


seedRoles().catch((error) =>
    console.error("Error running seed script", error)
);