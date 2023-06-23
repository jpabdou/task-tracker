"use client"
import React, {useContext, useEffect,useState} from "react";
import TaskList from "../components/TaskList";
import { useRouter } from "next/navigation";
import TaskForm from "../components/TaskForm";
import { UserContext } from "../../../contexts/user.context";
import { useAuth } from "@clerk/nextjs";

export default function Page() {
    const {
        isSignedIn,
        userId
      } = useAuth();

    const [hasMounted, setHasMounted] = useState(false);
    const [vis, setVis] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState({})
    const [taskId, setTaskId] = useState("")

    const { setAlertMessage } = useContext(UserContext);

    const router = useRouter();
    const buttonSetting = "self-center w-52 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";

    async function getTasks() {
        try {
            const getReq = {
                "method": "GET",
                "Content-type": "application/json",
              };
            let url = `/api/tasks/read?id=${userId.split('_')[1]}`
            const res = await fetch(`${url}`, getReq);
            if (!(res.status === 200)) {
              setAlertMessage({message: "Failed to fetch data.", severity: "error"})
                router.push("/");
              throw new Error('Failed to fetch data');
              
            }
            return res.json()
            
        } catch (e) {
            console.error(e)
        }
    
      }
  
      useEffect(()=>{
        if (tasks.length === 0) {
          if (isSignedIn){
            getTasks().then(result=>{
                console.log(result)
              if (result.data.length === 0) {
                setVis(true);
                setAlertMessage({message: "No tasks found. Submit a task first.", severity: "error"});
              }
              else{
                let result = result.data;
              setTasks(result);
            }
            }
            )
          } else {
              router.push("/sign-in")
              setAlertMessage({message:"Not Logged In.", severity: "error"})            
          }
      }
    },[])
  
    useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
    return(
        <div className="flex flex-col flex-wrap align-evenly justify-evenly">
        <button className={buttonSetting} onClick={()=>{setVis(true)}}>Add a New Task</button>
        {vis && <TaskForm editTask={editTask} taskId={taskId} setTaskId={setTaskId} setVis={setVis} setEditTask={setEditTask} tasks={tasks} setTasks ={setTasks} />}            
        <TaskList tasks={tasks} setEditTask={setEditTask} setTaskId={setTaskId} setVis={setVis} />
        </div>
    )
}
