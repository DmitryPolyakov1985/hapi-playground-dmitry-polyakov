import _axios from "axios";

const axios = _axios.create({
  baseURL: "http://hapi.fhir.org/baseR4",
});

export const getPatients = (name, date) => {
  return axios.get(`/Patient?name=${name}&birthdate=${date}`);
};

export const getPractitioners = () => {
  return axios.get("/Practitioner");
};
