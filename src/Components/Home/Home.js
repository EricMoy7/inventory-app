import React, {Component} from "react";
import { auth } from "../Firebase";
import '../../../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries} from 'react-vis';


class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
      }
    });
  }
  render() {
    const data = [
      {x: 0, y: 8},
      {x: 1, y: 5},
      {x: 2, y: 4},
      {x: 3, y: 9},
      {x: 4, y: 1},
      {x: 5, y: 7},
      {x: 6, y: 6},
      {x: 7, y: 3},
      {x: 8, y: 2},
      {x: 9, y: 0}
    ];
    return this.state.user ? (
      <div className="App">
        <XYPlot height={300} width={300}>
          <LineSeries data={data} />
        </XYPlot>
      </div>
    ) : (
      <h1>You are not logged in</h1>
    );
  }
}

export default Home;
