"use client"

import { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/user.context';
import { Dialog, DialogActions, DialogContent, DialogTitle,DialogContentText, Button } from '@mui/material';
import { useAuth } from '@clerk/nextjs';

export default function DeleteButton(props) {
    const {setAlertMessage} = useContext(UserContext);
    const {taskId, buttonSetting} = props;
    const {userId} = useAuth();
    const [opened, setOpened] = useState(false);

    const deleteTask = async (taskId) => {
        const deleteReq = {
            "method": "DELETE",
            'Content-Type': 'application/json',
        };
        try {
            let url  =  `/api/tasks/delete?taskid=${taskId}`
          const response = await fetch(`${url}`, deleteReq);
          let task = await response.json();
          return task;
        } catch (error) {
                      console.error('unexpected error: ', error);
                setAlertMessage({message: 'An unexpected error occurred', severity: "error" })
                return 'An unexpected error occurred';
                    
            }
      };

      const handleOpen = () => {
        setOpened(true);
      };
    
    const handleClose = () => {
        setOpened(false);
      };
    
    const handleAgree = () => {
      deleteTask(taskId)
        handleClose();
      };
    const handleDisagree = () => {
        handleClose();
      };


      return (
        <>
          <button onClick={handleOpen} className={buttonSetting}>Delete task</button>
                <Dialog
                open={opened}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
          <DialogTitle id="alert-dialog-title">
            Delete task
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this task?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDisagree} color="primary">
              Disagree
            </Button>
            <Button onClick={handleAgree} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
          </Dialog>
        </>)

 
}
