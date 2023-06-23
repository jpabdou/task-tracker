"use client"
import React, {useContext, useEffect,useState} from "react";

import TaskRow from "./TaskRow";
import { Table, TableRow, TableHead, TableCell, TableBody, Box, TablePagination } from "@mui/material";


export default function TaskList(props) {
    const {setTaskId, tasks, setEditTask, setVis} = props;

    const taskArr = []
    const [filteredtasks, setFilteredtasks] = useState(tasks);

    const initialFilterEntry = {filterKey: "title", filterTerm: ""};
    const [filterEntry, setFilterEntry] = useState(initialFilterEntry);
    const [filterSetting,setFilterSetting] = useState(initialFilterEntry);

    const currentDate = new Date().toJSON().slice(0,10);

    const filterArr = ["title", "dueDate", "status"];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const buttonSetting = "m-auto w-auto rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";
    

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleChange =(e)=>{
        const {name, value} = e.target;
        setFilterEntry({...filterEntry, [name]: value});
      }

      const submit = (e) =>{
        e.preventDefault();
        setFilterSetting(filterEntry);
      }
   

    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;
    
      useEffect(()=>{setFilteredtasks(tasks)},[tasks])
  const visibleRows = React.useMemo(
    () =>{
      return filteredtasks
      .filter((task)=>task[filterSetting.filterKey].toLocaleLowerCase('en-US').includes(filterSetting.filterTerm.toLocaleLowerCase('en-US')))
      .slice(
        page * rowsPerPage,
        (page+1) * rowsPerPage,
      )},
    [ filteredtasks, filterSetting ,page, rowsPerPage]
  );


    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
    

    return(
      <>
        <div className="flex flex-col flex-wrap align-evenly justify-evenly">
          <div className="flex flex-row justify-center">
          <form onSubmit={submit}>
            Filter by 
            <select value={filterEntry.filterKey} className="mx-2" name="filterKey" onChange={handleChange}>
              {filterArr.map(ele=>{return(<option key={ele} value={ele}>{ele}</option>)})}
            </select> for 
            <input name="filterTerm" className="mx-2" value={filterEntry.filterTerm} onChange={handleChange} type={filterEntry.filterKey === "dateApplied" ? "date" : "text"} />
            <button className='border-spacing-2 border-black mx-2 underline'>Filter</button>
          </form>
          <button className="underline mx-2" onClick={()=>{setFilterSetting(initialFilterEntry)}}>Reset Filter</button>
          </div>
        </div>
        <Box sx={{ display: { xs: 'none', sm:'none', md: 'none', lg: 'block', xl:'block'}}}>
        <Table style={{ width: '100%' }} aria-label="simple table">
                    <TableHead>
                        <TableRow key={'header row'}>                        
                            <TableCell scope="row" sx={{fontSize: 18, fontWeight:'bold'}}>Task Title
                            <br></br>
                            {"(Click to Edit Task)"}
                            </TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Due Date                            
                            <br></br>
                            {"(YYYY-MM-DD format)"}</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Task Description</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Task Status</TableCell>
                        </TableRow>
                    </TableHead>
            <TableBody>          
            {tasks.length >0 ?
            visibleRows.map((task)=>{
              return(<TaskRow key={task.id} idx={task.taskNumber} task={task} setEditTask={setEditTask} setTaskId={setTaskId} setVis={setVis} />)
            })
          : 
            <TableRow
            key="not-available"
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell colSpan={7}>Loading...</TableCell>
          </TableRow>}
          
          {emptyRows > 0 && (
                <TableRow                   
                style={{
                  height: 53 * emptyRows,
                }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
              </TableBody>
            </Table>
            <TablePagination 
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredtasks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    </>

    )
}
