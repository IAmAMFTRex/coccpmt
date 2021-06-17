import * as React from "react"
import Layout from "../components/layout"
var axios = require('axios');
var _ = require('lodash');


const IndexPage = () => (
  <Layout>

    <h1>ChargeOver Payments</h1>

  </Layout>
)



  //Code will make a REST API Post request to get a list of customers
  //that have an open balance and a credit card on file with ChargeOver
  //
  //For each Open Invoice, a subsequent Post request is made to attempt payment
  //API Data for POST Request on Report
  var data = '';
  var config = {
      method: 'post',
      //url: 'https://netpipe.chargeover.com/api/v3/_report/91?action=reportData', //Production
      url: 'https://netcom-staging2.chargeover.com/api/v3/_report/105?action=reportData', //Sandbox
      headers: { 
      //'Authorization': 'Basic b2VKajNpTE8yNWxzQ3p4a1k3YmQwcUhVNnlUUUI5RG06RXRKUlpMejBicmNoYTRZQ1VzTkE1UWlPdVdEMm9UNzE=', //Production
      'Authorization': 'Basic VHpqbGY5eWl2MTN4dFZPSFJkcmVEa1lobXNKOFpVTmI6dGhRTG1Jc2FBeGtHQlJpVVZ1cFRGWEQ3Nk1qTmU1MU8=', //Sandbox
      'Content-Type': 'application/json'
      },
      data : data,
  };
  //First API Request is made
  axios(config)
      .then(response => {
          let openReport = response.data.response["_report"]
          let invoiceCount = response.data.response["_count"]
          console.log("Invoices to pay: " + invoiceCount)
          attemptPay(openReport)
      })
      .catch(function (error) {
      console.log(error);
      });
  //Second API Request is made to attempt payment    
  function attemptPay(openReport) {
      let iid = openReport.map(({ invoice_invoice_id }) => invoice_invoice_id) //Get InvoiceIDs
      let cid = openReport.map(({ customer_customer_id }) => customer_customer_id) //Get CustomerIDs
      let cname = openReport.map(({ customer_company }) => customer_company) //Get Customer Names
      var invoices = []; //create empty array
      for(var i in iid) { //Create Payload for each Invoice
          invoices = '{"customer_id": ' + cid[i] + ',"applied_to": [{"invoice_id": ' + iid[i] + '}]}'
          console.log("Attempting to pay Invoice ID# " + iid[i] + " for " + cname[i] + "(CustID# " + cid[i] + ")")
          payEach(invoices, iid[i]);  //Initiate Invoice Payment
      };
          
  }
      function payEach(invoices, iid) {
          var configPay = {
              method: 'post',
              //url: 'https://netpipe.chargeover.com/api/v3/_report/91?action=reportData',
              url: 'https://netcom-staging2.chargeover.com/api/v3/transaction?action=pay',
              headers: { 
              //'Authorization': 'Basic b2VKajNpTE8yNWxzQ3p4a1k3YmQwcUhVNnlUUUI5RG06RXRKUlpMejBicmNoYTRZQ1VzTkE1UWlPdVdEMm9UNzE=', 
              'Authorization': 'Basic VHpqbGY5eWl2MTN4dFZPSFJkcmVEa1lobXNKOFpVTmI6dGhRTG1Jc2FBeGtHQlJpVVZ1cFRGWEQ3Nk1qTmU1MU8=', 
              'Content-Type': 'application/json'
              },
              data : invoices,
          };
          axios(configPay)
              .then(response => {
              var feedback = response.status
              
              confirmation(iid);
              })
              .catch(function (error) {
              console.log(error);
              });
      };
      
  function confirmation(iid) {
    var verification ='';
    var verifyPay = {
        method: 'get',
        //url: 'https://netpipe.chargeover.com/api/v3/_report/91?action=reportData',
        url: 'https://netcom-staging2.chargeover.com/api/v3/invoice/' + iid,
        headers: { 
        //'Authorization': 'Basic b2VKajNpTE8yNWxzQ3p4a1k3YmQwcUhVNnlUUUI5RG06RXRKUlpMejBicmNoYTRZQ1VzTkE1UWlPdVdEMm9UNzE=', 
        'Authorization': 'Basic VHpqbGY5eWl2MTN4dFZPSFJkcmVEa1lobXNKOFpVTmI6dGhRTG1Jc2FBeGtHQlJpVVZ1cFRGWEQ3Nk1qTmU1MU8=', 
        'Content-Type': 'application/json'
        },
        data : verification,
    };
    axios(verifyPay)
        .then(response => {
          let invoiceNumber = response.data.response.invoice_id
          let invoiceStatus = response.data.response.invoice_status_name
          let invoiceTotal = response.data.response.total
          
          console.log("Invoice #: " + invoiceNumber + " is: " + invoiceStatus + "($" + invoiceTotal + ")");
        })
        .catch(function (error) {
        console.log(error);
        });
  };


export default IndexPage