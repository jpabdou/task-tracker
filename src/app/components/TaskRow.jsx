"use client"
import React, {useState, useEffect, useContext } from "react";
import { TableRow, TableCell, TextField, Select, MenuItem, SelectChangeEvent,FormControl, InputLabel, TableBody, Box } from "@mui/material";

export default function TaskRow(props) {


    const currentDate = new Date().toJSON().slice(0,10);

    let { idx, task, setTaskId, setEditTask, setVis} = props;
    let initialTaskInput ={title: "", taskNumber: taskNumbers.length, description: "", dueDate: currentDate, status: "Not Started Yet", id: ""};
    initialTaskInput = task;
    
    const buttonSetting = "m-auto w-auto rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";


       
  





    return (
            <TableRow
            key={`task ${idx}`}
            tabIndex={-1}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell scope="row"><button className="underline text-xl" onClick={()=>{
                setVis(true);
                setTaskId(task.id);
                setEditTask(task);
            }}>{task.title}</button></TableCell>
            <TableCell align="center" sx={{fontSize: 18}}>{task.dateApplied}</TableCell>
            <TableCell align="center" sx={{fontSize: 18}}>{task.description}</TableCell>
            <TableCell align="center" sx={{fontSize: 18}}>{task.status}</TableCell>
           </TableRow>
            
            );
};
