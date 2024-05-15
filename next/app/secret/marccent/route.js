import { NextResponse } from "next/server";
import { post } from "@marccent/util";

export async function GET() {
  return post(`${process.env.SERVERURL}token/pair`, { 
    username: process.env.MARCCENT_USERNAME,
    password: process.env.MARCCENT_PASSWORD
  }, {}, { cache: 'no-store' })
  .then(res => NextResponse.json(res)).catch(error => NextResponse.json(error));
}