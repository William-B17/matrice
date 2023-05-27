import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert, { AlertColor } from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

type Data = {
  area: Array<string>,
  rows: Record<string, Record<string, string>>
}

type MessageType = {
  state:boolean,
  messageSymbol:AlertColor,
  messageTitle:string,
  message:string
}

const App: React.FC = () => {

  const [message, setMessage] = React.useState<MessageType | null>(null);

  const [data, setdata] = useState<Data | null>(null)
  
  function getData() {
    fetch("http://localhost:5000/members").then(
      res => res.json()
    ).then(
      data => {
        console.log(data)
        setdata(data)
      }
    )
  }
 
  useEffect(() => {
    getData()
  }, [])

  const send = (value: string, row: string, area: number) => {
    if (isFinite(Number(value)) && value != "") {
        fetch("http://localhost:5000/savedata",
        {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json'},
          cache: "no-store",
          body: JSON.stringify({ value: Number(value), row: row, area: data?.area[area], data: data })
        }
      ).then(
        () => {
          setMessage({state:true,messageSymbol:"success",messageTitle:"Success!",message:" Changes saved!"})
          getData()
        }
      )
    } else {
      setMessage({state:true,messageSymbol:"error",messageTitle:"Error!",message:" You are only allowed to write numbers in cells!"})
    }
  }

  if (data != null) {
    return (
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Months</TableCell>
                {data.area.map((area: string) => (
                  <TableCell key={area} align="left">{area}</TableCell>)
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(data.rows).map((row: string) => (
                <TableRow
                  key={row}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row}
                  </TableCell>
                  {Object.keys(data.area).map((areakey: string) => (
                    <TableCell key={areakey}>
                      <input placeholder={
                        data.rows[row][data.area[Number(areakey)]] == null ?
                          "No data" :
                          data.rows[row][data.area[Number(areakey)]]
                        }
                        onChange={event => send(
                          event.target.value,
                          row,
                          Number(areakey)
                        )}
                      />
                    </TableCell>
                  )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <Collapse in={message?.state}>
          <Alert onClose={() => {setMessage({state:false,messageSymbol:"info",messageTitle:"Goodbye",message:" Have a nice day."})}} severity={message?.messageSymbol}><strong>{message?.messageTitle}</strong>{message?.message}</Alert>
        </Collapse>
      </div>
    )
  } else {
    return (
      <div>
        loading
      </div>
    )
  }

}

export default App;
