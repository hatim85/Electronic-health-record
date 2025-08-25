const Doctor = require('./doctorContract');
const Diagnostics = require('./diagnosticsContract');
const Patient = require('./patientContract');
const Hospital = require('./hospitalContract');
const Insurance = require('./insuranceContract');
const Pharma = require('./pharmaContract');
const Registration = require('./registrationContract');
const Researcher = require('./researcherContract');
const Helper=require('../utils/helper.js');
const Query = require('../utils/query.js');

module.exports = {
  ...Doctor,
  ...Diagnostics,
  ...Patient,
  ...Hospital,
  ...Insurance,
  ...Pharma,
  ...Registration,
  ...Researcher,
  ...Helper,
  ...Query
};
