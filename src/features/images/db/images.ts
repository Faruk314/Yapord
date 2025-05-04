import { minioClient } from "@/minio/minio";
import { env } from "@/data/env/server";

async function uploadImagesToMinio(images: File[], fileNames: string[]) {
  try {
    for (const [index, image] of images.entries()) {
      const fileName = fileNames[index];
      const buffer = await image.arrayBuffer();

      await minioClient.putObject(
        env.MINIO_BUCKET_NAME,
        fileName,
        Buffer.from(buffer),
        buffer.byteLength,
        { "Content-Type": image.type }
      );
    }
  } catch {
    throw new Error("Failed to upload images to MinIO");
  }
}

async function deleteImagesFromMinio(fileNames: string[]) {
  try {
    const result = await minioClient.removeObjects(
      env.MINIO_BUCKET_NAME,
      fileNames
    );

    if (result[0]?.Error) {
      throw new Error("Failed to delete images from MinIO");
    }
  } catch {
    throw new Error("Failed to delete images from MinIO");
  }
}

export { uploadImagesToMinio, deleteImagesFromMinio };
