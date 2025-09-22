import { logger } from "../../config/logger.ts";
import type { Request, Response } from "express";

export const healthCheck = (_req: Request, res: Response) => {
    logger.info('UI Backend is Healthy');
    res.status(200).json({ status: 'ok' });
};