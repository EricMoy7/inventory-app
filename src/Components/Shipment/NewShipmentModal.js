import React, { useReducer } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Axios from "axios";

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
    width: 600,
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
  boxContent: {
    padding: 20,
    width: "90%",
  },
  casePacked: {
    padding: 20,
    width: "90%",
  },
  label: {
    padding: 20,
    width: "90%",
  },
}));

const initialState = {
  uid: "",
  shipmentName: "",
  shipmentAddressName: "",
  shipmentAddressLine1: "",
  shipmentAddressCity: "",
  shipmentAddressState: "",
  shipmentAddressPostalCode: "",
  shipmentAddressCountryCode: "",
  packingType: "",
  channel: "",
  label: "",
  boxContent: "",
};

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

export default function SimpleModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    dispatch({ field: e.target.name, value: e.target.value });
    console.log(e.target.value);
  };

  const {
    shipmentName,
    shipmentAddressName,
    shipmentAddressLine1,
    shipmentAddressCity,
    shipmentAddressState,
    shipmentAddressPostalCode,
    shipmentAddressCountryCode,
    packingType,
    channel,
    label,
    boxContent,
  } = state;

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          name="shipmentName"
          label="Shipment Name"
          value={shipmentName}
          onChange={handleChange}
        />
        <h2>Shipment Address</h2>
        <TextField
          name="shipmentAddressName"
          label="Address Name"
          value={shipmentAddressName}
          onChange={handleChange}
        />
        <TextField
          name="shipmentAddressLine1"
          label="Address Line 1"
          value={shipmentAddressLine1}
          onChange={handleChange}
        />

        <TextField
          name="shipmentAddressCity"
          label="City"
          value={shipmentAddressCity}
          onChange={handleChange}
        />

        <TextField
          name="shipmentAddressState"
          label="State"
          value={shipmentAddressState}
          onChange={handleChange}
        />

        <TextField
          name="shipmentAddressPostalCode"
          label="Postal Code"
          value={shipmentAddressPostalCode}
          onChange={handleChange}
        />

        <TextField
          name="shipmentAddressCountryCode"
          label="Country"
          value={shipmentAddressCountryCode}
          onChange={handleChange}
        />

        <Paper className={classes.casePacked}>
          {/* Packing Option, MWS doesn't require. Saving in DB for later 
        --Required for CreateInboundShipment
        --AreCasesRequired
        --true: All boxes in shipment must be case packed
        --false: All boxes in the shipment must be individually packed*/}
          <RadioGroup name="packing-type" onChange={handleChange}>
            {/* cased-packed true */}
            <FormControlLabel
              name="packingType"
              value="true"
              label="Case Packed Products"
              control={<Radio />}
            ></FormControlLabel>
            {/* cased-packed false */}
            <FormControlLabel
              name="packingType"
              value="false"
              label="Individually Packed Products"
              control={<Radio />}
            ></FormControlLabel>
          </RadioGroup>
        </Paper>

        <Paper className={classes.boxContent}>
          {/* Box Contents, MWS doesn't require. Saving in DB for later 
        --Required for CreateInboundShipment
        --IntededBoxContentsSource
        --DEFAULT:NONE
        --OPTIONS: NONE, FEED, 2D_BARCODE*/}
          <RadioGroup name="box-contents" onChange={handleChange}>
            <FormControlLabel
              name="boxContent"
              value="FEED"
              label="Box Contents On"
              control={<Radio />}
            ></FormControlLabel>

            <FormControlLabel
              name="boxContent"
              value="NONE"
              label="Box Contents Off"
              control={<Radio />}
            ></FormControlLabel>
          </RadioGroup>
        </Paper>

        <Paper className={classes.label}>
          {/* Label requirements, MWS does require.
          --LabelPrepPreference
          --SELLER_LABEL
          --AMAZON_LABEL_ONLY
          --AMAZON_LABEL_PREFERRED*/}
          <RadioGroup name="label" onChange={handleChange}>
            <FormControlLabel
              name="label"
              value="SELLER_LABEL"
              label="Seller Label"
              control={<Radio />}
            ></FormControlLabel>

            <FormControlLabel
              name="label"
              value="AMAZON_LABEL_ONLY"
              label="Amazon Label Only"
              control={<Radio />}
            ></FormControlLabel>

            <FormControlLabel
              name="label"
              value="AMAZON_LABEL_PREFERRED"
              label="Amazon Label Preferred"
              control={<Radio />}
            ></FormControlLabel>
          </RadioGroup>
        </Paper>

        <Button
          onClick={() => {
            Axios.post(
              "https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/shipping/createClientShipment",
              {
                shipAddress: {
                  addressName: shipmentAddressName,
                  addressLine1: shipmentAddressLine1,
                  city: shipmentAddressCity,
                  state: shipmentAddressState,
                  postalCode: shipmentAddressPostalCode,
                  countryCode: shipmentAddressCountryCode,
                },
                packingType,
                channel,
                label,
                boxContent,
                channel: "FBA",
              },
              {
                params: {
                  uid: JSON.parse(sessionStorage.getItem("userData")).uid,
                  name: shipmentName,
                },
              }
            );
            handleClose();
          }}
        >
          Submit
        </Button>
      </form>
    </div>
  );

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Create New Shipment
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
