import clientPromise from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request){
    if (request.method === 'POST') {
        try {
            let body = await request.json();
            const client = await clientPromise;
            let db_connect = client.db("tasks");

            let userId  = searchParams.get("id") || "";
            let myobj = {
                "title": body.title ? body.title : "No Title Added",
                "description": body.description ? body.description  : "No Description Added",
                "dueDate": body.dueDate ? body.dueDate : new Date().toJSON().slice(0,10),
                "status": body.status ? body.status : "Not Yet Applied",
                 userId: userId
              };
              let createResult = await db_connect.collection("tasks").insertOne({...myobj});
              return NextResponse.json({data: createResult});

        }catch (e) {
            console.error(e)
          }  
    } else {
        let message ={message: "Method Not Allowed"}
        return NextResponse.json(message);
      }
}
