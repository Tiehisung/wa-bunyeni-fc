import LogModel from "@/models/logs";
import { ELogSeverity } from "@/types/log.interface";
import { getApiErrorMessage } from "../lib/error-api";
import connectDB from "@/config/db.config";
export class LoggerService {
    static async info(title: string, description?: any, req?: Request, meta?: any) {
        return this.log(title, getApiErrorMessage(description), ELogSeverity.INFO, req, meta);
    }

    static async warn(title: string, description?: any, req?: Request, meta?: any) {
        return this.log(title, getApiErrorMessage(description), ELogSeverity.WARNING, req, meta);
    }

    static async error(title: string, description?: any, req?: Request, meta?: any) {
        return this.log(title, getApiErrorMessage(description), ELogSeverity.CRITICAL, req, meta);
    }
    static async critical(title: string, description?: any, req?: Request, meta?: any) {
        return this.log(title, getApiErrorMessage(description), ELogSeverity.CRITICAL, req, meta);
    }

    private static async log(
        title: string,
        description: string = '',
        severity: ELogSeverity,
        req?: Request,
        meta: any = {}
    ) {
        await connectDB()
        try {
            let userData = null;

            return await LogModel.create({
                title,
                description: description.toString(),
                user: userData,
                severity,
                meta,
                createdAt: new Date()
            });
        } catch (error) {
            console.error("Logging failed:", error);
            return null;
        }
    }
}

