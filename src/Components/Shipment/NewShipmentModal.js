import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function SimpleModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="standard-basic" label="Shipment Name" />
        <RadioGroup name="packing-type" value={value} onChange={handleChange}>
          <FormControlLabel
            value="individual-products"
            label="Individual Products"
            control={<Radio />}
          ></FormControlLabel>

          <FormControlLabel
            value="casepacked-products"
            label="Case Packed Products"
            control={<Radio />}
          ></FormControlLabel>
        </RadioGroup>

        <RadioGroup name="box-contents" value={value} onChange={handleChange}>
          <FormControlLabel
            value="on"
            label="On"
            control={<Radio />}
          ></FormControlLabel>

          <FormControlLabel
            value="Off"
            label="Off"
            control={<Radio />}
          ></FormControlLabel>
        </RadioGroup>
      </form>
    </div>
  );

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Open Modal
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
