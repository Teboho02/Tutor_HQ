import express from 'express';
import { supabase, getUserWithRoleData } from '../config/supabase.js';
import { authenticate, validateBody } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', validateBody({
    email: { required: true, type: 'string' },
    password: { required: true, type: 'string' },
    fullName: { required: true, type: 'string' },
    role: {
        required: true,
        type: 'string',
        validate: (value) => {
            if (!['student', 'tutor', 'parent', 'admin'].includes(value)) {
                return 'role must be one of: student, tutor, parent, admin';
            }
        }
    }
}), async (req, res) => {
    try {
        const { email, password, fullName, role, ...additionalData } = req.body;

        // Sign up user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role
                }
            }
        });

        if (authError) {
            return res.status(400).json({
                error: 'Signup Failed',
                message: authError.message
            });
        }

        // The profile is automatically created via database trigger
        // If role is student or tutor, create additional record
        if (authData.user) {
            if (role === 'student') {
                const { error: studentError } = await supabase
                    .from('students')
                    .insert({
                        id: authData.user.id,
                        grade_level: additionalData.gradeLevel,
                        school: additionalData.school,
                        parent_id: additionalData.parentId,
                        learning_goals: additionalData.learningGoals
                    });

                if (studentError) {
                    console.error('Error creating student record:', studentError);
                }
            } else if (role === 'tutor') {
                const { error: tutorError } = await supabase
                    .from('tutors')
                    .insert({
                        id: authData.user.id,
                        subjects: additionalData.subjects || [],
                        qualifications: additionalData.qualifications,
                        experience_years: additionalData.experienceYears,
                        hourly_rate: additionalData.hourlyRate,
                        availability: additionalData.availability || {}
                    });

                if (tutorError) {
                    console.error('Error creating tutor record:', tutorError);
                }
            }
        }

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                role: role
            },
            session: authData.session
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create user'
        });
    }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateBody({
    email: { required: true, type: 'string' },
    password: { required: true, type: 'string' }
}), async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({
                error: 'Login Failed',
                message: error.message
            });
        }

        // Get user profile with role data
        const { user: userWithRole, error: profileError } = await getUserWithRoleData(data.user.id);

        if (profileError) {
            console.error('Error fetching user profile:', profileError);
        }

        res.json({
            message: 'Login successful',
            user: userWithRole || {
                id: data.user.id,
                email: data.user.email
            },
            session: data.session
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to login'
        });
    }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authenticate, async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(400).json({
                error: 'Logout Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to logout'
        });
    }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const { user: userWithRole, error } = await getUserWithRoleData(req.user.id);

        if (error) {
            return res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch user profile'
            });
        }

        res.json({
            user: userWithRole
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch user profile'
        });
    }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Refresh token is required'
            });
        }

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken
        });

        if (error) {
            return res.status(401).json({
                error: 'Refresh Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Token refreshed successfully',
            session: data.session
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to refresh token'
        });
    }
});

/**
 * POST /api/auth/reset-password
 * Request password reset
 */
router.post('/reset-password', validateBody({
    email: { required: true, type: 'string' }
}), async (req, res) => {
    try {
        const { email } = req.body;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.CLIENT_URL}/reset-password`
        });

        if (error) {
            return res.status(400).json({
                error: 'Reset Password Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Password reset email sent'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to send reset password email'
        });
    }
});

/**
 * POST /api/auth/update-password
 * Update password (requires authentication)
 */
router.post('/update-password', authenticate, validateBody({
    newPassword: { required: true, type: 'string' }
}), async (req, res) => {
    try {
        const { newPassword } = req.body;

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            return res.status(400).json({
                error: 'Update Password Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update password'
        });
    }
});

export default router;
