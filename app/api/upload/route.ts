import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// endpoint to get the list of files in the bucket
export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  return NextResponse.json(response?.Contents ?? []);
}

// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    console.log('formData', formData);
    
    const files = formData.getAll("files") as File[];
    console.log('files', files);

    const responses = await Promise.all(
      files.map(async (file) => {
        const Body = Buffer.from(await file.arrayBuffer());
        const params = {
          Bucket: process.env.AMPLIFY_BUCKET,
          Key: file.name,
          Body: Body,
          ContentType: file.type,
        };

        try {
          const result = await s3.send(new PutObjectCommand(params));
          console.log('Upload result:', result);
          return result;
        } catch (error: any) {
          console.error('Upload error:', error);
          return { error: error.message };
        }
      })
    );

    console.log('responses', responses);
    return NextResponse.json(responses);
  } catch (error: any) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: error.message });
  }
}