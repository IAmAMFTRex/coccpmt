import React from "react"
//import { Button } from "@material-ui/core";
//import Layout from "../components/layout"
//var axios = require("axios")
//var _ = require("lodash")

export default class ccpay extends React.Component {
    state = {
      firstName: "",
      lastName: "",
    }
    handleInputChange = event => {
      const target = event.target
      const value = target.value
      const name = target.name
      this.setState({
        [name]: value,
      })
    }
    handleSubmit = event => {
      event.preventDefault()
      alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
    }
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            First name
            <input
              type="text"
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            Last name
            <input
              type="text"
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleInputChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )
    }
  }