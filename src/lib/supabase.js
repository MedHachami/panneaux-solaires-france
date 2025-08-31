import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
    import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey =
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database operations
export const submitLead = async(leadData) => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([{
                ...leadData,
                created_at: new Date().toISOString(),
                source: 'website_form',
                status: 'new'
            }])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error submitting lead:', error);
        return { success: false, error: error.message };
    }
};

export const getLeads = async() => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching leads:', error);
        return { success: false, error: error.message };
    }
};