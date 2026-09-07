/**
 * Insert Doctor Script
 * 
 * This script inserts a new doctor into the MediKiosk database.
 * Usage: node backend/scripts/insertDoctor.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Insert a new doctor into the database
 */
async function insertDoctor(doctorData) {
  try {
    console.log('\n🏥 Inserting doctor into database...');
    console.log('Doctor data:', doctorData);

    const { data, error } = await supabase
      .from('doctors')
      .insert([doctorData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('\n✅ Doctor inserted successfully!');
    console.log('\nDoctor Details:');
    console.log('━'.repeat(50));
    console.log('ID:', data.doctor_id);
    console.log('Name:', data.full_name);
    console.log('Email:', data.email);
    console.log('Specialization:', data.specialization);
    console.log('Department:', data.department);
    console.log('Phone:', data.phone);
    console.log('Active:', data.is_active);
    console.log('Created At:', data.created_at);
    console.log('━'.repeat(50));

    return data;
  } catch (error) {
    console.error('\n❌ Error inserting doctor:', error.message);
    throw error;
  }
}

/**
 * Get all doctors from the database
 */
async function getAllDoctors() {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching doctors:', error.message);
    throw error;
  }
}

/**
 * Display all doctors
 */
async function listDoctors() {
  try {
    console.log('\n📋 Fetching all doctors...');
    const doctors = await getAllDoctors();

    if (doctors.length === 0) {
      console.log('\nNo doctors found in database.');
      return;
    }

    console.log(`\nFound ${doctors.length} doctor(s):`);
    console.log('━'.repeat(80));

    doctors.forEach((doctor, index) => {
      console.log(`\n${index + 1}. ${doctor.full_name}`);
      console.log(`   Email: ${doctor.email}`);
      console.log(`   Specialization: ${doctor.specialization}`);
      console.log(`   Department: ${doctor.department}`);
      console.log(`   Phone: ${doctor.phone}`);
      console.log(`   Active: ${doctor.is_active}`);
      console.log(`   ID: ${doctor.doctor_id}`);
    });

    console.log('━'.repeat(80));
  } catch (error) {
    console.error('❌ Error listing doctors:', error.message);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🏥 MediKiosk - Doctor Insertion Script');
  console.log('━'.repeat(50));

  // Example doctors to insert
  const doctors = [
    {
      full_name: 'Dr. Ananya Mehta',
      email: 'ananya.mehta@medikiosk.health',
      specialization: 'General Medicine',
      department: 'General Medicine',
      phone: '9123456791',
      is_active: true
    },
    {
      full_name: 'Dr. Rohan Kapoor',
      email: 'rohan.kapoor@medikiosk.health',
      specialization: 'Internal Medicine',
      department: 'Internal Medicine',
      phone: '9123456792',
      is_active: true
    },
    {
      full_name: 'Dr. Priya Sharma',
      email: 'priya.sharma@medikiosk.health',
      specialization: 'Pediatrics',
      department: 'Pediatrics',
      phone: '9123456793',
      is_active: true
    }
  ];

  // Check command line arguments
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'list') {
    // List all doctors
    await listDoctors();
  } else if (command === 'insert') {
    // Insert specific doctor or all example doctors
    if (args[1]) {
      // Insert doctor from JSON argument
      try {
        const doctorData = JSON.parse(args[1]);
        await insertDoctor(doctorData);
      } catch (error) {
        console.error('❌ Invalid JSON format for doctor data');
        console.log('\nUsage: node insertDoctor.js insert \'{ "full_name": "Dr. Name", ... }\'');
      }
    } else {
      // Insert all example doctors
      console.log(`\nInserting ${doctors.length} example doctors...`);
      for (const doctor of doctors) {
        try {
          await insertDoctor(doctor);
        } catch (error) {
          if (error.message.includes('duplicate key')) {
            console.log(`⚠️  Doctor with email ${doctor.email} already exists, skipping...`);
          }
        }
      }
    }

    // List all doctors after insertion
    await listDoctors();
  } else {
    // Show usage
    console.log('\nUsage:');
    console.log('  node backend/scripts/insertDoctor.js list          # List all doctors');
    console.log('  node backend/scripts/insertDoctor.js insert        # Insert example doctors');
    console.log('  node backend/scripts/insertDoctor.js insert \'JSON\' # Insert custom doctor');
    console.log('\nExample custom doctor JSON:');
    console.log(`  '${JSON.stringify(doctors[0], null, 2).replace(/\n/g, ' ')}'`);
  }

  console.log('\n✅ Script completed\n');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = { insertDoctor, getAllDoctors, listDoctors };
