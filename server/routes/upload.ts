import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Router, type Request, type Response } from "express";
import "dotenv/config";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler";
import { PresignedUrlSchema } from "../validation/uploadSchemas";

const router = Router();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("Cloudflare R2 credentials are not configured in .env file.");
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

router.post("/presigned-url", asyncHandler(async (req: Request, res: Response) => {
  const parsed = PresignedUrlSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { filename, contentType } = parsed.data;

  // Create a unique key for the file
  const randomBytes = crypto.randomBytes(16).toString("hex");
  const key = `${randomBytes}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 minutes
  });

  res.json({
    url: signedUrl,
    key: key, // The client will need this to know the final URL of the file
  });
}));

export default router;
