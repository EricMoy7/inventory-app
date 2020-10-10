import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { db } from "../../Firebase";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

export default function DenseTable({ uid, currentBatch }) {
  const classes = useStyles();

  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection(`users/${uid}/batches/current/batches/${currentBatch}`)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        setData(data);
      });
    return () => unsubscribe();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table
        className={classes.table}
        size="small"
        aria-label="a dense table"
        padding="none"
      >
        <TableHead>
          <TableRow>
            <TableCell style={{ maxWidth: 100 }}>Product</TableCell>
            <TableCell style={{ maxWidth: 100 }}>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.MSKU}>
              <TableCell style={{ maxWidth: 100 }}>
                <img src={row.imageUrl} alt={row.name} />
              </TableCell>
              <TableCell style={{ maxWidth: 100 }}>{row.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
