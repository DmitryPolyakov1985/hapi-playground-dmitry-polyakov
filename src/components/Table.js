import React, { Component } from 'react';
import {getPatients} from '../services/index';
import moment from 'moment'

export class Table extends Component {
    state = {
        patients: [],
        name: '',
        date: '',
        errors: {},
        startTime: '',
    }

    getPatientsData = (name, date) => {
        let startTime = Date.now();
        let start = moment(startTime).format('ddd Do MMM YYYY [at] h:mm:ss');

        getPatients(name, date)
            .then((res) => {
            this.setState({ patients: this.patientCard(res)});
            this.timerFunc(startTime);
            
            // set start time state
            this.setState({startTime: start})
        })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.getPatientsData(this.state.name, this.state.date);
    };

    patientCard = res => {
        let patients = (
            (res.data.entry || []).map((item) => {
                const name = item.resource.name || [];
                return {
                    id: item.resource.id,
                    name: `${((name[0] || {}).given || []).join(" ")} ${typeof name[0]?.family === 'undefined' ? (name[0] || {})?.family : ""}`,
                    dob: item.resource.birthDate,
                    gender: item.resource.gender,
                }
            })
        );
        return patients
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if(this.handleValidation()) {
            this.getPatientsData(this.state.name, this.state.date);
        } else {
            console.log('Form has errors');
        }
    }

    handleValidation() {
        let name = this.state.name;
        const date = this.state.date;
        const formattedDate = moment(date).format('YYYY-MM-DD');
        let isFormValid = true;
        let errors = {};

        console.log(formattedDate);

        // const today = moment();
        // const formattedInputDate = date.format('YYYY-MM-DD');


        if(name !== '' && name !== 'undefined') {
            if(!name.match(/^[a-zA-Z]+$/)) {
                isFormValid = false;
                errors["name"] = 'Only letters are allowed';
            }
        }

        if(date !== '' && formattedDate === 'Invalid date') {
            isFormValid = false;
            errors["date"] = 'Date must be formatted as YYYY-MM-DD';
        }

        if(date !== '' && formattedDate !== date) {
            isFormValid = false;
            errors["date"] = 'Wrong format';
        }

        this.setState({errors})
        return isFormValid;
    };

    timerFunc = (startTime) => {
        let now = Date.now();
        let seconds = Math.floor((now - startTime)/1000);
        let milliseconds = Math.floor((now - startTime)%1000);
        this.setState({timer: `${seconds}.${milliseconds} seconds`});
    }

    render() {    
        const {patients} = this.state;
        
        return (
            <>  
                <div>
                    <h4 className='list-heading'>List of Patients</h4>
                    <div className="underline"></div>
                </div>
                <form id='form' className='form'>
                    <div className='form-field'>
                        <label htmlFor="name">Name: </label>
                        <div className='name-form-block'>
                            <input type="text" name='name' id='name' placeholder='Name' value={this.name} onChange={e => this.setState({name: e.target.value})} />
                            {this.state.errors.name && <span className='name-error'>*{this.state.errors.name}</span>}
                        </div>
                    </div>
                    <div className='form-field'>
                        <label htmlFor="date">Date: </label>
                        <div className='date-form-block'>
                            <input type="text" name='date' id='date' placeholder='Date' value={this.state.date} onChange={e => this.setState({date: e.target.value})} />
                            {this.state.errors.date && <span className='date-error'>*{this.state.errors.date}</span>}
                        </div>
                    </div>
                    <button onClick={this.handleSubmit} type='submit' className='submit-btn'>search</button>
                </form>

                {this.state.startTime && (
                    <div className='req-time-container'>
                        <p className='req-time-text'>Results as of {this.state.startTime}</p>
                    </div>
                )}

                <table className='patients-table'>
                    <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                    </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.name}</td>
                                <td>{patient.dob}</td>
                                <td>{patient.gender}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        )
    }
};

export default Table;