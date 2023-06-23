import {ObjectId} from "mongodb";
import { NextResponse, NextRequest } from 'next/server';
import clientPromise from "../../../../../lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
    if (request.method === 'GET') {
    try {
        const {userId} = getAuth(request).split("_")[1]
      const client = await clientPromise;
      let db_connect = client.db("tasks");
      const { searchParams } = new URL(request.url);
    //   let userId = searchParams.get("id") || "";

      let taskId = searchParams.get("taskId") || "";
      if (taskId.length>0) {     
        let myquery = { "userId": userId,
          "_id": new ObjectId(taskId) };
        let taskResult = await db_connect
          .collection("tasksData")
          .findOne(myquery);
       return NextResponse.json({data: {...taskResult, id: taskId}});
          
      } else {
          let myquery = { "userId": userId}
          let idx = 0
          let cursor = db_connect
            .collection("tasksData")
            .find(myquery)
            .map((task)=>{
              task.id= task._id.toString();
              task.taskNumber = idx;
              idx++
              return task
            })

            const result = await cursor.toArray();

            return NextResponse.json({data:result});

      }
    } catch (e) {
        console.error(e)
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"})
    }
    }
