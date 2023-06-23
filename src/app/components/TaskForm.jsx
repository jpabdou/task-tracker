"use client"
import React, {useState, useEffect, useContext } from "react";
import DeleteButton from "./DeleteButton";
import { useAuth } from '@clerk/nextjs'
import { UserContext } from "../../../contexts/user.context";
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from "@mui/material";
import { useRouter } from "next/navigation";

export default function TaskForm(props) {
    const {
        userId,
        isLoaded,
        isSignedIn,
      } = useAuth();

    const currentDate = new Date().toJSON().slice(0,10);
    const { setAlertMessage } = useContext(UserContext);
    const router = useRouter();
    let {editTask, taskId, tasks, setTasks, setVis, setEditTask, setTaskId} = props;
    let initialTaskInput ={title: "", taskNumber: tasks.length, description: "", dueDate: currentDate, status: "Not Started Yet"};
    if (taskId)  {
        initialTaskInput = editTask;
    };

    const h2Setting = "text-2xl text-center";
    const h3Setting = "text-1xl text-center";
    const divInputSetting = "flex flex-row justify-center my-2 w-auto h-auto";
    const formSetting = "h-1/2 flex flex-col flex-wrap justify-evenly content-left";
    const buttonSetting = "self-center w-52 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";
    const disabledButtonSetting = "self-center w-52 rounded-md border-2 p-3 border-black object-left bg-gray-700 text-white hover:bg-gray-200 hover:text-black";
    const requiredSetting = "after:content-['*'] after:ml-0.5 after:text-red-500";
    const highlightRequiredSetting = "bg-yellow-400";

    const [task, setTask] = useState(initialTaskInput);
    const [disabled, setDisabled] = useState(true);
    const [highlightOn, setHighlightOn] = useState(false);

    const updateTask = async (task, taskId) => {
        let {description} = task;
        if (description.trim().length === 0) {
            description = "No Description Added"
        }
        const updateReq = {
            "method": "PUT",
            "body": JSON.stringify({...task}),
            'Content-Type': 'application/json',
        };
        try {
            let url = `/api/tasks/update?taskId=${taskId}`

          const response = await fetch(url, updateReq);
          let task = await response.json();
          return task;
        } catch (error) {

                console.error('unexpected error: ', error);
                return 'An unexpected error occurred';
                  
            }
      };

      const postTask = async (task) => {
        let {description} = task;
        if (description.trim().length === 0) {
            description = "No Description Added"
        }
        const postReq = {
            "method": "POST",
            "body": JSON.stringify({...task}),
            "Content-type": "application/json",
          };
        try {
          const response = await fetch(`/api/tasks/create`, postReq);
          let result = await response.json();
          return result;
        } catch (error) {

                console.error('unexpected error: ', error);
                return 'An unexpected error occurred';
                
            }
      };

    const onSubmitTask = (event) => {
        event.preventDefault();
        manualErrorSetting();
        if (disabled) {
            setHighlightOn(true)
        } else {
            if (taskId) {
                updateTask(task, taskId).then(res=>{
                    let targetIndex = task.taskNumber;
                    tasks.splice(targetIndex, 1, task);
                    setTasks([...tasks]);
                    setTask(initialTaskInput);
                    setEditTask({});
                    setVis(false);
                    setTaskId("");


                })

            } else {
                postTask(task).then(res=>{
                    console.log(res)
                    tasks.push({...task, _id: res.data.insertedId, id: res.data.insertedId.toString()});
                    setTasks([...tasks]);
                    setTask(initialTaskInput);
                    setVis(false);
                })
                .catch(err=>{
                    console.error(err);
                })

            }
            setHighlightOn(false);
            router.refresh();
        }

    }

    const handleChangeInput= (event) => {
        let val = event.target.value;
        let name = event.target.name;

            setTask({...task, [name]: val});
        }
    

    const requiredArr = ["title", "dueDate", "status"];
    const inputArr = [["title","Task Title"],["dueDate","Due Date"]];
    const statusArr= ["Not Started Yet", "In Progress", "Completed", "Cancelled"];


    const taskTest = (requiredElements, task) =>{
        return requiredElements.some(ele=>{return task[ele]?.trim().length === 0});
    };

    const manualErrorSetting = () => {
        setDisabled(taskTest(requiredArr, task));
    }

    useEffect(()=>{
        if (!(isSignedIn) || !(isLoaded) ) {
            return null
        }
    },[])

    useEffect(()=>{
        if (!(isSignedIn) ) {
            setAlertMessage({message:"Not Logged In", severity: "error"})
            router.push("/sign-in")
        }
    },[])

    useEffect(() =>{
        manualErrorSetting();
        },[task]);



    return (
        <div className="w-full text-center">
            <h2 className={h2Setting}>{taskId ? "View or update task details below" : "Enter the task details below:"}</h2> 
            <h3 className={h3Setting+ " " + requiredSetting}>Required Fields</h3>
            <form className={formSetting} onSubmit={onSubmitTask}>
                {inputArr.map(inputElement=>{
                    return( 
                        <div key={inputElement[0]} className={divInputSetting}>
                            <label 
                                htmlFor={inputElement[0]} 
                                className={`${requiredSetting} ${highlightOn && task[inputElement[0]].trim().length ===0 && highlightRequiredSetting}`}
                            >
                                Enter {inputElement[1]}:
                            </label>
                                <input 
                                    name={inputElement[0]} 
                                    type={inputElement[0] === "dueDate" ? "date" : "text"} 
                                    value={task[inputElement[0]]} placeholder={`Enter ${inputElement[1]} Here`} 
                                    onChange={handleChangeInput} 
                                />
                        </div>               

                    )
                })}
                    <div className={divInputSetting}>
                        <label htmlFor="description">
                            Enter task Description:
                        </label>
                        <textarea name="description" value={task.description} placeholder='Enter task Description Here' onChange={handleChangeInput} />
                    </div>

                    

                    <FormControl>
                        <FormLabel id="task-status-group">Task Status</FormLabel>
                        <RadioGroup
                            aria-labelledby="task-status-group"
                            name="status"
                            value={task.status}
                            onChange={handleChangeInput}
                            style={{width: '200px', alignSelf: 'center'}}
                        >
                            {statusArr.map((ele, idx)=>{
                                return(<FormControlLabel key={idx} value={ele} control={<Radio />} label={ele} />)
                            })}
                            
                        </RadioGroup>
                        </FormControl>
                <button className={disabled ? disabledButtonSetting : buttonSetting}>{disabled ? `Fill ${highlightOn ? "Highlighted" : ""} Required Fields` : `${taskId ? "Update" : "Submit"} Task Entry` }</button>                
            </form>
            <div className="my-2">
            {taskId && <DeleteButton buttonSetting={buttonSetting} taskId={taskId} />}
            </div>

            </div>
            );
};
