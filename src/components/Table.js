import React, { Component } from 'react';
import {getPatients} from '../services/index';

export class Table extends Component {
    state = {
        patients: [],
        name: '',
        date: '',
        errors: {}
    }

    componentDidMount() {
        getPatients(this.state.name, this.state.date).then((res) => {
            this.setState({ patients: this.patientCard(res)});
        });
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
        console.log(patients);
        return patients
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        const {name, date} = this.state;

        if(this.handleValidation()) {
            getPatients(this.state.name, this.state.date).then((res) => {
                this.setState({ patients: this.patientCard(res)});
            });
            console.log('Form submitted');
        } else {
            console.log('Form has errors');
        }
    }

    handleValidation() {
        let name = this.state.name;
        let isFormValid = true;
        let errors = {}

        if(!name) {
            errors["name"] = 'Name is required'
            isFormValid = false;
        }

        this.setState({errors})
        return isFormValid;
    }



    render() {    
        const {patients} = this.state;
        console.log()
        
        return (
            <>
                <h4>List of Patients</h4>

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
                            <input type="date" name='date' id='date' value={this.state.date} onChange={e => this.setState({date: e.target.value})} />
                        </div>
                    </div>
                    <button onClick={this.handleSubmit} type='submit' className='submit-btn'>search</button>
                </form>

                <table className='patients-table'>
                    <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                    </tr>
                    </thead>
                    <tbody>
                        {patients
                            // .sort((a, b) => {
                            //     console.log('a dob', parseInt(a.dob), 'b dob', parseInt(b.dob))
                            // })
                            .map((patient) => (
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