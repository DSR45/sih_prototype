# MediKiosk Backend Scripts

Utility scripts for managing the MediKiosk database.

## 📋 Available Scripts

### Insert Doctor Script

Insert doctors into the MediKiosk database.

#### Prerequisites

1. **Install dependencies:**
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   # OR
   SUPABASE_ANON_KEY=your-anon-key
   ```

#### Usage

**List all doctors:**
```bash
node backend/scripts/insertDoctor.js list
```

**Insert example doctors:**
```bash
node backend/scripts/insertDoctor.js insert
```

This will insert 3 example doctors:
- Dr. Ananya Mehta (General Medicine)
- Dr. Rohan Kapoor (Internal Medicine)
- Dr. Priya Sharma (Pediatrics)

**Insert custom doctor:**
```bash
node backend/scripts/insertDoctor.js insert '{"full_name":"Dr. Vikram Singh","email":"vikram.singh@medikiosk.health","specialization":"Cardiology","department":"Cardiology","phone":"9123456794","is_active":true}'
```

#### Doctor Data Structure

```javascript
{
  full_name: "Dr. Full Name",          // Required
  email: "email@example.com",          // Required, must be unique
  specialization: "Specialization",    // Required
  department: "Department Name",       // Required
  phone: "9123456789",                 // Optional, 10-digit number
  is_active: true                      // Optional, defaults to true
}
```

#### Common Specializations

- General Medicine
- Internal Medicine
- Pediatrics
- Cardiology
- Orthopedics
- Dermatology
- Gynecology
- ENT (Ear, Nose, Throat)
- Ophthalmology
- Psychiatry
- Surgery
- Radiology
- Anesthesiology

### SQL Script Method

**Using psql:**
```bash
psql -h db.your-project.supabase.co -U postgres -d postgres -f backend/sql/insert_doctor.sql
```

**Using Supabase SQL Editor:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy contents of `backend/sql/insert_doctor.sql`
4. Paste and execute

## 🔗 Linking Doctor to Supabase Auth

After creating a doctor record, you can link it to a Supabase Auth user:

### Step 1: Create Auth User

```javascript
// In Supabase Dashboard > Authentication > Add User
// OR via code:
const { data, error } = await supabase.auth.admin.createUser({
  email: 'doctor@example.com',
  password: 'secure-password',
  email_confirm: true,
  user_metadata: {
    full_name: 'Dr. Name',
    role: 'doctor'
  }
});
```

### Step 2: Link Auth User to Doctor

```sql
UPDATE doctors 
SET auth_user_id = '<supabase-auth-user-uuid>' 
WHERE email = 'doctor@example.com';
```

OR via Node.js:

```javascript
const { data, error } = await supabase
  .from('doctors')
  .update({ auth_user_id: authUserId })
  .eq('email', 'doctor@example.com');
```

## 📊 Verify Insertion

**Check all doctors:**
```sql
SELECT 
    doctor_id,
    full_name,
    email,
    specialization,
    department,
    phone,
    is_active,
    created_at
FROM doctors
ORDER BY created_at DESC;
```

**Check specific doctor:**
```sql
SELECT * FROM doctors WHERE email = 'doctor@example.com';
```

## 🔒 Security Notes

1. **Use Service Role Key** for inserting doctors (requires admin privileges)
2. **Never commit** `.env` file with real credentials
3. **Validate email** format before insertion
4. **Set strong passwords** when creating Auth users
5. **Enable Row Level Security (RLS)** on doctors table in production

## 🐛 Troubleshooting

### Error: "duplicate key value violates unique constraint"
**Solution:** Email already exists. Use a different email or update existing doctor.

### Error: "SUPABASE_URL not set"
**Solution:** Create `.env` file with Supabase credentials.

### Error: "permission denied for table doctors"
**Solution:** Use SUPABASE_SERVICE_ROLE_KEY instead of ANON_KEY.

### Error: "relation doctors does not exist"
**Solution:** Run migrations first:
```bash
cd backend/supabase
supabase db push
```

## 📝 Examples

### Insert Multiple Doctors

```javascript
const doctors = [
  {
    full_name: 'Dr. Amit Sharma',
    email: 'amit.sharma@medikiosk.health',
    specialization: 'Cardiology',
    department: 'Cardiology',
    phone: '9123456795',
    is_active: true
  },
  {
    full_name: 'Dr. Neha Gupta',
    email: 'neha.gupta@medikiosk.health',
    specialization: 'Dermatology',
    department: 'Dermatology',
    phone: '9123456796',
    is_active: true
  }
];

for (const doctor of doctors) {
  await insertDoctor(doctor);
}
```

### Query Doctors by Department

```sql
SELECT * FROM doctors 
WHERE department = 'General Medicine' 
AND is_active = true;
```

### Update Doctor Status

```sql
UPDATE doctors 
SET is_active = false 
WHERE email = 'doctor@example.com';
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install @supabase/supabase-js dotenv

# 2. Set up .env file
echo "SUPABASE_URL=your-url" > backend/.env
echo "SUPABASE_SERVICE_ROLE_KEY=your-key" >> backend/.env

# 3. Insert example doctors
node backend/scripts/insertDoctor.js insert

# 4. Verify
node backend/scripts/insertDoctor.js list
```

## 📚 Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Database Schema](../sql/complete_schema.sql)
- [Seed Demo Data](../sql/seed_demo_data.sql)
- [Backend README](../README.md)
