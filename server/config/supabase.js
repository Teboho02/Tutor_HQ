import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
if (!process.env.SUPABASE_URL) {
    throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with anon key (for client-like operations)
export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: false, // Server-side, don't persist sessions
        },
    }
);

// Create Supabase admin client with service role key (for admin operations)
// This bypasses Row Level Security - use with caution!
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
    : null;

// Helper function to verify JWT token
export const verifyToken = async (token) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            return { user: null, error };
        }

        return { user, error: null };
    } catch (error) {
        return { user: null, error };
    }
};

// Helper function to get user profile with role
export const getUserProfile = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            return { profile: null, error };
        }

        return { profile: data, error: null };
    } catch (error) {
        return { profile: null, error };
    }
};

// Helper function to get user with their role-specific data
export const getUserWithRoleData = async (userId) => {
    try {
        const { profile, error: profileError } = await getUserProfile(userId);

        if (profileError || !profile) {
            return { user: null, error: profileError };
        }

        let roleData = null;
        let roleError = null;

        // Fetch role-specific data based on user role
        switch (profile.role) {
            case 'student':
                const { data: studentData, error: studentErr } = await supabase
                    .from('students')
                    .select('*')
                    .eq('id', userId)
                    .single();
                roleData = studentData;
                roleError = studentErr;
                break;

            case 'tutor':
                const { data: tutorData, error: tutorErr } = await supabase
                    .from('tutors')
                    .select('*')
                    .eq('id', userId)
                    .single();
                roleData = tutorData;
                roleError = tutorErr;
                break;

            case 'parent':
            case 'admin':
                // No additional data needed for these roles yet
                break;
        }

        return {
            user: {
                ...profile,
                roleData: roleData || {}
            },
            error: roleError
        };
    } catch (error) {
        return { user: null, error };
    }
};

export default supabase;
