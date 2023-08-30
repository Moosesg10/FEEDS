import { config } from "dotenv";

config()

export const  PORT = process.env.PORT
export const  AWS_BUKECT_NAME = process.env.AWS_BUKECT_NAME
export const  AWS_BUKECT_REGION = process.env.AWS_BUKECT_REGION
export const  AWS_BUKECT_PUBLIC_KEY = process.env.AWS_BUKECT_PUBLIC_KEY
export const  AWS_BUKECT_SECRET_KEY = process.env.AWS_BUKECT_SECRET_KEY
export const  URL_REQUEST = process.env.URL_REQUEST