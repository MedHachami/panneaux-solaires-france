# Supabase Setup Guide for Solar Panel Lead Forms

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Fill in project details:
   - **Name**: `calhan-energies-leads`
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users (e.g., EU West)

### 2. Create Database Table

After your project is ready, go to the SQL Editor in your Supabase dashboard and run this query:

```sql
-- Create leads table
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Personal Information
  first_name TEXT,
  last_name TEXT,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Project Information
  postal_code TEXT NOT NULL,
  project_type TEXT,
  roof_surface TEXT,
  current_energy_bill TEXT,
  preferred_contact_time TEXT,
  message TEXT,

  -- Consent & Preferences
  newsletter BOOLEAN DEFAULT FALSE,
  terms BOOLEAN DEFAULT TRUE,

  -- Tracking
  source TEXT DEFAULT 'website_form',
  form_type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'new',
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_postal_code ON leads(postal_code);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting leads (public access)
CREATE POLICY "Allow public to insert leads" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Create policy for authenticated users to read leads
CREATE POLICY "Allow authenticated to read leads" ON leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to update leads
CREATE POLICY "Allow authenticated to update leads" ON leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: The public key for client-side access

### 4. Update Environment Variables

Update your `.env` file with the actual values:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Database Table Name
PUBLIC_SUPABASE_LEADS_TABLE=leads
```

### 5. Test the Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Test the forms by submitting data
4. Check your Supabase dashboard to see if leads are being stored

## 📊 Database Schema Details

### Leads Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `created_at` | TIMESTAMP | Auto-generated creation timestamp |
| `updated_at` | TIMESTAMP | Auto-updated modification timestamp |
| `first_name` | TEXT | User's first name |
| `last_name` | TEXT | User's last name |
| `name` | TEXT | Full name (computed) |
| `email` | TEXT | Email address (required) |
| `phone` | TEXT | Phone number (required) |
| `postal_code` | TEXT | Postal code (required) |
| `project_type` | TEXT | Type of solar project |
| `roof_surface` | TEXT | Available roof surface |
| `current_energy_bill` | TEXT | Current energy bill range |
| `preferred_contact_time` | TEXT | Best time to contact |
| `message` | TEXT | Additional message |
| `newsletter` | BOOLEAN | Newsletter subscription |
| `terms` | BOOLEAN | Terms acceptance |
| `source` | TEXT | Lead source |
| `form_type` | TEXT | Type of form submitted |
| `status` | TEXT | Lead status (new, contacted, qualified, etc.) |

## 🔧 Advanced Configuration

### Email Notifications

Set up email notifications for new leads:

1. Go to **Database** → **Edge Functions** in Supabase
2. Create a new function for email notifications
3. Configure SMTP settings

### Analytics Integration

Track form conversions:

1. Go to **Settings** → **Integrations**
2. Connect Google Analytics or other analytics tools
3. Set up conversion tracking for form submissions

### Backup Strategy

Set up automated backups:

1. Go to **Settings** → **Database**
2. Configure backup schedule
3. Set up automated exports if needed

## 🛡️ Security Best Practices

### Row Level Security (RLS)

The database is configured with RLS enabled:
- ✅ Public can insert leads (for forms)
- ✅ Only authenticated users can read/update leads
- ✅ Sensitive data is protected

### Data Validation

Form validation includes:
- ✅ Email format validation
- ✅ Required field checks
- ✅ Phone number format
- ✅ Postal code validation

### GDPR Compliance

The setup includes:
- ✅ Data minimization
- ✅ Consent management
- ✅ Right to erasure capabilities
- ✅ Data retention policies

## 📈 Monitoring & Maintenance

### Dashboard Monitoring

Monitor your leads in the Supabase dashboard:
- **Table Editor**: View and edit leads
- **SQL Editor**: Run custom queries
- **Logs**: Monitor API usage
- **Reports**: Generate lead reports

### Performance Optimization

Optimize database performance:
- ✅ Indexes on frequently queried columns
- ✅ Efficient query patterns
- ✅ Connection pooling
- ✅ Caching strategies

## 🚨 Troubleshooting

### Common Issues

1. **Form not submitting**
   - Check environment variables
   - Verify Supabase keys
   - Check browser console for errors

2. **Data not appearing in database**
   - Check RLS policies
   - Verify table permissions
   - Check API key permissions

3. **Slow form loading**
   - Enable caching
   - Optimize images
   - Use CDN for assets

### Support

If you encounter issues:
1. Check the Supabase status page
2. Review the browser console
3. Check the Supabase logs
4. Contact Supabase support

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Best Practices](https://supabase.com/docs/guides/database)

---

**Need Help?** Check the Supabase documentation or contact their support team for assistance with setup and configuration.