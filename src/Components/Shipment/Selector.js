import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Paper from "@material-ui/core/Paper";
import NewShipmentModal from "./NewShipmentModal";
import ShipmentPlanList from "./ShipmentPlanList";
import ShipmentPlanInventory from "./ShipmentPlanInventory";
import Button from "@material-ui/core/Button";
import ShipmentLocations from "./ShipmentLocations";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 600,
    width: 400,
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
              <ShipmentPlanList />
              <NewShipmentModal />
            </Paper>
          </Grid>

          <Grid item>
            <Paper className={classes.paper}>
              <Button>Create Inbound Shipment Plan</Button>
            </Paper>
          </Grid>

          <Grid item>
            <Paper className={classes.paper}>
              <ShipmentLocations />
            </Paper>
          </Grid>

          <Grid item>
            <Paper>
              <ShipmentPlanInventory />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
