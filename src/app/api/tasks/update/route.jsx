import {ObjectId} from "mongodb";
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";

import clientPromise from "../../../../../lib/mongodb";

export async function PUT(request) {
    if (request.method === 'PUT') {

    try {
        let body = await request.json() 
        const client = await clientPromise;
      let db_connect = client.db("tasks");
      const { searchParams } = new URL(request.url);
      const {userId} = getAuth(request).split("_")[1]
      let taskId = searchParams.get("taskId") || "";

      let myquery = { "userId": userId,
        "_id": new ObjectId(taskId) };
      let newvalues = {
        $set: {
            "title": body.title ? body.title : "No Title Added",
            "description": body.description ? body.description  : "No Description Added",
            "dueDate": body.dueDate ? body.dueDate : new Date().toJSON().slice(0,10),
            "status": body.status ? body.status : "Not Yet Applied"
        },
      };
      let updateResult = await db_connect
        .collection("tasks")
        .updateOne(myquery, newvalues);
          console.log("1 document updated");
         return NextResponse.json({data: updateResult});
    } catch (e) {
        console.error(e)
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"})
    }
    }
