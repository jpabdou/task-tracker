import clientPromise from "../../../../../lib/mongodb";
import { NextResponse, NextRequest } from 'next/server';
import {ObjectId} from "mongodb";
import { getAuth } from "@clerk/nextjs/server";

export async function DELETE(request) {
    if (request.method === 'DELETE') {
    try {
      const client = await clientPromise;
      let db_connect = client.db("tasks");
      const { searchParams } = new URL(request.url);
      const {userId} = getAuth(request).split("_")[1]

      let taskId = searchParams.get("taskId") || "";
      let query = { _id: new ObjectId(taskId), userId: userId };
      let deleteResult = await db_connect.collection("tasksData").deleteOne(query);
        console.log("1 document deleted");
        return NextResponse.json({data: deleteResult});
    } catch (e) {
        console.error(e)
      }
    } else{
        NextResponse.json({message: "Method Not Allowed"})
    }
    }
