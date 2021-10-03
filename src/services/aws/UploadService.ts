import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class UploadService {
  private S3: S3Client;

  constructor() {
    this.S3 = new S3Client({ region: 'ap-southeast-1' });
  }

  async writeFile(file: { _data: Buffer }, meta: { filename: string, headers: { 'content-type': string } }): Promise<string> {
    const fileName = +new Date() + meta.filename;
    const bucketName = process.env.AWS_BUCKET_NAME || "";
    const commandPut = new PutObjectCommand({
      Bucket: bucketName, // Nama S3 Bucket yang digunakan
      Key: fileName, // Nama berkas yang akan disimpan
      // eslint-disable-next-line no-underscore-dangle
      Body: file._data, // Berkas (dalam bentuk Buffer) yang akan disimpan
      ContentType: meta.headers['content-type'], // MIME Type berkas yang akan disimpan
    });

    const commandGet = new GetObjectCommand({
      Key: fileName,
      Bucket: bucketName
    });

    await this.S3.send(commandPut);
    return await getSignedUrl(this.S3, commandGet);
  }
}

export default UploadService;
