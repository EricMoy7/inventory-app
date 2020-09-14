import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Paper from "@material-ui/core/Paper";
import NewShipmentModal from "./NewShipmentModal";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 200,
    width: 200,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

export default function Selector() {
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={spacing}>
          <Grid item>
            <Paper className={classes.paper}>
              <NewShipmentModal />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
