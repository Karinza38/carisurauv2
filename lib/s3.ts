"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.CARISURAU_S3_UPLOAD_KEY!,
    secretAccessKey: process.env.CARISURAU_S3_UPLOAD_SECRET!,
  },
});

export async function getS3PresignedUrl(fileName: string, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: "carisurau",
      Key: `images/${fileName}`,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    const imageUrl = `https://d252nd24znc5wy.cloudfront.net/images/${fileName}`;

    return {
      uploadUrl,
      imageUrl,
    };
  } catch (err) {
    console.log(err);
    return {
        message: "Failed to get presigned URL"
    };
  }
}
