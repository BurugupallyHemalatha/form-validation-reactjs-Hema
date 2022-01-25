import React, { Component } from "react";
import ReactSelect from "react-select";

class App extends Component {
  constructor() {
    super();
    this.state = {
      form: {
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        gender: null,
        language: [],
        country: null,
        zipCode: ""
      },
      formErrors: {
        name: null,
        email: null,
        mobile: null,
        password: null,
        confirmPassword: null,
        gender: null,
        language: null,
        country: null
      }
    };
    this.countryList = [
      { value: "india", label: "India" },
      { value: "us", label: "US" },
      { value: "australia", label: "Australia" }
    ];
    this.languageList = [
      { value: "english", label: "English" },
      { value: "hindi", label: "Hindi" },
      { value: "spanish", label: "Spanish" },
      { value: "arabic", label: "Arabic" }
    ];
  }

  validateNumber = evt => {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === "paste") {
      key = theEvent.clipboardData.getData("text/plain");
    } else {
      // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  };

  handleChange = e => {
    const { name, value, checked } = e.target;
    const { form, formErrors } = this.state;
    let formObj = {};
    if (name === "language") {
      // handle the change event of language field
      if (checked) {
        // push selected value in list
        formObj = { ...form };
        formObj[name].push(value);
      } else {
        // remove unchecked value from the list
        formObj = {
          ...form,
          [name]: form[name].filter(x => x !== value)
        };
      }
    } else {
      // handle change event except language field
      formObj = {
        ...form,
        [name]: value
      };
    }
    this.setState({ form: formObj }, () => {
      if (!Object.keys(formErrors).includes(name)) return;
      let formErrorsObj = {};
      if (name === "password" || name === "confirmPassword") {
        let refValue = this.state.form[
          name === "password" ? "confirmPassword" : "password"
        ];
        const errorMsg = this.validateField(name, value, refValue);
        formErrorsObj = { ...formErrors, [name]: errorMsg };
        if (!errorMsg && refValue) {
          formErrorsObj.confirmPassword = null;
          formErrorsObj.password = null;
        }
      } else {
        const errorMsg = this.validateField(
          name,
          name === "language" ? this.state.form["language"] : value
        );
        formErrorsObj = { ...formErrors, [name]: errorMsg };
      }
      this.setState({ formErrors: formErrorsObj });
    });
  };

  validateField = (name, value, refValue) => {
    let errorMsg = null;
    switch (name) {
      case "name":
        if (!value) errorMsg = "Please enter Name.";
        break;
      case "email":
        if (!value) errorMsg = "Please enter Email.";
        else if (
          !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          )
        )
          errorMsg = "Please enter valid Email.";
        break;
      case "mobile":
        if (!value) errorMsg = "Please enter Mobile.";
        break;
      case "country":
        if (!value) errorMsg = "Please select Country.";
        break;
      case "gender":
        if (!value) errorMsg = "Please select Gender.";
        break;
      case "password":
        // refValue is the value of Confirm Password field
        if (!value) errorMsg = "Please enter Password.";
        else if (refValue && value !== refValue)
          errorMsg = "Password and Confirm Password does not match.";
        break;
      case "confirmPassword":
        // refValue is the value of Password field
        if (!value) errorMsg = "Please enter Confirm Password.";
        else if (refValue && value !== refValue)
          errorMsg = "Password and Confirm Password does not match.";
        break;
      case "language":
        if (value.length === 0) errorMsg = "Please select Language.";
        break;
      default:
        break;
    }
    return errorMsg;
  };

  validateForm = (form, formErrors, validateFunc) => {
    const errorObj = {};
    Object.keys(formErrors).map(x => {
      let refValue = null;
      if (x === "password" || x === "confirmPassword") {
        refValue = form[x === "password" ? "confirmPassword" : "password"];
      }
      const msg = validateFunc(x, form[x], refValue);
      if (msg) errorObj[x] = msg;
    });
    return errorObj;
  };

  handleSubmit = () => {
    const { form, formErrors } = this.state;
    const errorObj = this.validateForm(form, formErrors, this.validateField);
    if (Object.keys(errorObj).length !== 0) {
      this.setState({ formErrors: { ...formErrors, ...errorObj } });
      return false;
    }
    console.log("Data: ", form);
  };

  render() {
    const { form, formErrors } = this.state;
    return (
      <>
      <h1 style={{color:"red"}}>Hema form validation</h1>
        <div className="signup-box">
          <p className="title">Sign up</p>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Name:<span className="asterisk">*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={this.handleChange}
                  onBlur={this.handleChange}
                />
                {formErrors.name && (
                  <span className="err">{formErrors.name}</span>
                )}
              </div>
              <div className="form-group">
                <label>
                  Email:<span className="asterisk">*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={this.handleChange}
                  onBlur={this.handleChange}
                />
                {formErrors.email && (
                  <span className="err">{formErrors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label>
                  Password:<span className="asterisk">*</span>
                </label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={this.handleChange}
                  onBlur={this.handleChange}
                />
                {formErrors.password && (
                  <span className="err">{formErrors.password}</span>
                )}
              </div>
              <div className="form-group">
                <label>
                  Confirm Password:<span className="asterisk">*</span>
                </label>
                <input
                  className="form-control"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={this.handleChange}
                  onBlur={this.handleChange}
                />
                {formErrors.confirmPassword && (
                  <span className="err">{formErrors.confirmPassword}</span>
                )}
              </div>
              <div className="form-group">
                <label className="mr-3">
                  Language:<span className="asterisk">*</span>
                </label>
                <div className="form-control border-0 p-0 pt-1">
                  {this.languageList.map((x, i) => {
                    return (
                      <label key={i} className="mr-2">
                        <input
                          type="checkbox"
                          name="language"
                          value={x.value}
                          checked={form.language.includes(x.value)}
                          onChange={this.handleChange}
                        />{" "}
                        {x.label}
                      </label>
                    );
                  })}
                </div>
                {formErrors.language && (
                  <span className="err">{formErrors.language}</span>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Mobile:<span className="asterisk">*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={this.handleChange}
                  onBlur={this.handleChange}
                  onKeyPress={this.validateNumber}
                />
                {formErrors.mobile && (
                  <span className="err">{formErrors.mobile}</span>
                )}
              </div>
              <div className="form-group">
                <label className="mr-3">
                  Gender:<span className="asterisk">*</span>
                </label>
                <div className="form-control border-0 p-0 pt-1">
                  <label className="mr-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={form.gender === "male"}
                      onChange={this.handleChange}
                    />{" "}
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={form.gender === "female"}
                      onChange={this.handleChange}
                    />{" "}
                    Female
                  </label>
                </div>
                {formErrors.gender && (
                  <span className="err">{formErrors.gender}</span>
                )}
              </div>
              <div className="form-group">
                <label>Zip Code:</label>
                <input
                  className="form-control"
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label>
                  Country:<span className="asterisk">*</span>
                </label>
                <ReactSelect
                  name="country"
                  options={this.countryList}
                  value={this.countryList.find(x => x.value === form.country)}
                  onChange={e =>
                    this.handleChange({
                      target: {
                        name: "country",
                        value: e.value
                      }
                    })
                  }
                />
                {formErrors.country && (
                  <span className="err">{formErrors.country}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <input
              type="button"
              className="btn btn-primary"
              value="Submit"
              onClick={this.handleSubmit}
            />
          </div>
        </div>
        <h3 style={{ textAlign: "center" }}>
          <a href="http://www.cluemediator.com/form-validation-in-reactjs" target="_blank">
           Here is the step by step explanation of form validation in React JS by Hema Reddy Burugupally
          </a>
        </h3>
      </>
    );
  }
}

export default App;
