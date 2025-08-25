const { execSync } = require('child_process');

const scripts = [
  'node cert-script/registerOrg1Admin.js',
  'node cert-script/registerOrg2Admin.js',
  'node cert-script/onboardHospital01.js',
  'node cert-script/onboardDoctor.js',
  'node cert-script/onboardPatient.js',
  'node cert-script/onboardDiagnosticsCenter.js',
  'node cert-script/onboardPharmacies.js',

  //problematic start
  'node cert-script/onboardResearchAdmin.js', // remove if not present
  'node cert-script/onboardResearchers.js',
  //problematic end

  'node cert-script/onboardInsuranceCompany.js', // remove if not present
  'node cert-script/onboardInsuranceAgent.js'
];

scripts.forEach(cmd => {
  console.log(`\n=== Running: ${cmd} ===\n`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`❌ Error running ${cmd}:`, err.message);
    process.exit(1); // stop if something fails
  }
});

console.log('\n✅ All onboarding scripts completed successfully!\n');
