import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (
  !process.env.S3_ENDPOINT ||
  !process.env.S3_ACCESS_KEY_ID ||
  !process.env.S3_SECRET_ACCESS_KEY ||
  !process.env.S3_BUCKET
) {
  throw new Error("Missing required S3 environment variables.");
}

export const s3 = new S3Client({
  region: process.env.S3_REGION ?? "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for non-AWS S3-compatible endpoints
});

export const BUCKET = process.env.S3_BUCKET;
export const RESUMES_PREFIX = "resumes/";

/** Upload a buffer to S3 and return the object key. */
export async function uploadResume(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

/** Generate a short-lived pre-signed download URL (15 min). */
export async function getResumeDownloadUrl(key: string): Promise<string> {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: 900 });
}

/** Delete a resume from S3. */
export async function deleteResume(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/** List all resume objects under the resumes/ prefix. */
export async function listResumes(): Promise<
  { key: string; size: number; lastModified: Date }[]
> {
  const res = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: RESUMES_PREFIX })
  );
  return (res.Contents ?? [])
    .filter((obj) => obj.Key && obj.Key !== RESUMES_PREFIX)
    .map((obj) => ({
      key: obj.Key!,
      size: obj.Size ?? 0,
      lastModified: obj.LastModified ?? new Date(),
    }));
}
