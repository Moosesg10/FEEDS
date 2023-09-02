import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  AWS_BUKECT_NAME,
  AWS_BUKECT_PUBLIC_KEY,
  AWS_BUKECT_REGION,
  AWS_BUKECT_SECRET_KEY,
} from "./Config.js";
import fs from "fs";
const client = new S3Client({
  region: AWS_BUKECT_REGION,
  credentials: {
    accessKeyId: AWS_BUKECT_PUBLIC_KEY,
    secretAccessKey: AWS_BUKECT_SECRET_KEY,
  },
});
import fsp from "fs/promises"


export const UploadFile = async (file) => {
  const string = fs.ReadStream(file.path);
  const command = new PutObjectCommand({
    Key: file.filename,
    Bucket: AWS_BUKECT_NAME,
    Body: string,
  });
  return await client.send(command);
};

export const DeleteFile = async (req,res) =>{
  const filename = req.params.name
  const command = new DeleteObjectCommand({
    Bucket: AWS_BUKECT_NAME, // required
    Key: filename, // required
  })
  fsp.unlink(`public/download/${filename}`)
 const resposen = await client.send(command)
 res.send("Archivo borrado")
}

export const GetFile = async (file) =>{
 if(file.length >0){  for (let i = 0; i < file.length; i++) {
  const filename = file[i].nameImg;
  const command = new GetObjectCommand({
    Bucket:AWS_BUKECT_NAME,
    Key: filename
})
const results = await client.send(command)
await results.Body.pipe(fs.createWriteStream(`./public/download/${filename}`))
}

return file}
return {message:"sin archivos"}
}
