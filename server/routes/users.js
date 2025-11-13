import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate, requireRole, requireOwnership } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users/profile/:userId
 * Get user profile by ID
 */
router.get('/profile/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'User profile not found'
            });
        }

        res.json({ profile: data });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch user profile'
        });
    }
});

/**
 * PUT /api/users/profile/:userId
 * Update user profile
 */
router.put('/profile/:userId', authenticate, requireOwnership, async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, avatarUrl, phone, bio } = req.body;

        const updates = {};
        if (fullName !== undefined) updates.full_name = fullName;
        if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;
        if (phone !== undefined) updates.phone = phone;
        if (bio !== undefined) updates.bio = bio;

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Update Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Profile updated successfully',
            profile: data
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update profile'
        });
    }
});

/**
 * GET /api/users/tutors
 * Get list of all tutors
 */
router.get('/tutors', async (req, res) => {
    try {
        const { subject, minRating, maxRate } = req.query;

        let query = supabase
            .from('tutors')
            .select(`
                *,
                profiles!inner(id, full_name, email, avatar_url, bio)
            `);

        // Filter by subject
        if (subject) {
            query = query.contains('subjects', [subject]);
        }

        // Filter by minimum rating
        if (minRating) {
            query = query.gte('rating', parseFloat(minRating));
        }

        // Filter by maximum hourly rate
        if (maxRate) {
            query = query.lte('hourly_rate', parseFloat(maxRate));
        }

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ tutors: data });
    } catch (error) {
        console.error('Get tutors error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch tutors'
        });
    }
});

/**
 * GET /api/users/tutors/:tutorId
 * Get tutor details by ID
 */
router.get('/tutors/:tutorId', async (req, res) => {
    try {
        const { tutorId } = req.params;

        const { data, error } = await supabase
            .from('tutors')
            .select(`
                *,
                profiles!inner(id, full_name, email, avatar_url, bio, phone)
            `)
            .eq('id', tutorId)
            .single();

        if (error) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Tutor not found'
            });
        }

        res.json({ tutor: data });
    } catch (error) {
        console.error('Get tutor error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch tutor'
        });
    }
});

/**
 * PUT /api/users/tutors/:tutorId
 * Update tutor profile
 */
router.put('/tutors/:tutorId', authenticate, requireOwnership, async (req, res) => {
    try {
        const { tutorId } = req.params;
        const { subjects, qualifications, experienceYears, hourlyRate, availability } = req.body;

        const updates = {};
        if (subjects !== undefined) updates.subjects = subjects;
        if (qualifications !== undefined) updates.qualifications = qualifications;
        if (experienceYears !== undefined) updates.experience_years = experienceYears;
        if (hourlyRate !== undefined) updates.hourly_rate = hourlyRate;
        if (availability !== undefined) updates.availability = availability;

        const { data, error } = await supabase
            .from('tutors')
            .update(updates)
            .eq('id', tutorId)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Update Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Tutor profile updated successfully',
            tutor: data
        });
    } catch (error) {
        console.error('Update tutor error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update tutor profile'
        });
    }
});

/**
 * GET /api/users/students/:studentId
 * Get student details
 */
router.get('/students/:studentId', authenticate, async (req, res) => {
    try {
        const { studentId } = req.params;

        // Check authorization - student themselves, their parent, or admin
        if (req.user.id !== studentId && req.profile.role !== 'admin') {
            // Check if requester is the student's parent
            const { data: parentLink } = await supabase
                .from('parent_students')
                .select('*')
                .eq('parent_id', req.user.id)
                .eq('student_id', studentId)
                .single();

            if (!parentLink) {
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'You do not have access to this student'
                });
            }
        }

        const { data, error } = await supabase
            .from('students')
            .select(`
                *,
                profiles!inner(id, full_name, email, avatar_url, phone)
            `)
            .eq('id', studentId)
            .single();

        if (error) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Student not found'
            });
        }

        res.json({ student: data });
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch student'
        });
    }
});

/**
 * PUT /api/users/students/:studentId
 * Update student profile
 */
router.put('/students/:studentId', authenticate, requireOwnership, async (req, res) => {
    try {
        const { studentId } = req.params;
        const { gradeLevel, school, learningGoals } = req.body;

        const updates = {};
        if (gradeLevel !== undefined) updates.grade_level = gradeLevel;
        if (school !== undefined) updates.school = school;
        if (learningGoals !== undefined) updates.learning_goals = learningGoals;

        const { data, error } = await supabase
            .from('students')
            .update(updates)
            .eq('id', studentId)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Update Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Student profile updated successfully',
            student: data
        });
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update student profile'
        });
    }
});

/**
 * GET /api/users/parents/:parentId/students
 * Get all students for a parent
 */
router.get('/parents/:parentId/students', authenticate, requireOwnership, async (req, res) => {
    try {
        const { parentId } = req.params;

        const { data, error } = await supabase
            .from('parent_students')
            .select(`
                student_id,
                relationship,
                students!inner(
                    *,
                    profiles!inner(id, full_name, email, avatar_url)
                )
            `)
            .eq('parent_id', parentId);

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ students: data });
    } catch (error) {
        console.error('Get parent students error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch students'
        });
    }
});

/**
 * POST /api/users/parents/:parentId/students
 * Link a student to a parent
 */
router.post('/parents/:parentId/students', authenticate, requireOwnership, async (req, res) => {
    try {
        const { parentId } = req.params;
        const { studentId, relationship } = req.body;

        if (!studentId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'studentId is required'
            });
        }

        const { data, error } = await supabase
            .from('parent_students')
            .insert({
                parent_id: parentId,
                student_id: studentId,
                relationship: relationship || 'parent'
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Link Failed',
                message: error.message
            });
        }

        res.status(201).json({
            message: 'Student linked successfully',
            link: data
        });
    } catch (error) {
        console.error('Link student error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to link student'
        });
    }
});

/**
 * GET /api/users/search
 * Search users by name or email
 */
router.get('/search', authenticate, async (req, res) => {
    try {
        const { query, role } = req.query;

        if (!query) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Search query is required'
            });
        }

        let dbQuery = supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url, role')
            .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
            .limit(10);

        if (role) {
            dbQuery = dbQuery.eq('role', role);
        }

        const { data, error } = await dbQuery;

        if (error) {
            return res.status(400).json({
                error: 'Search Failed',
                message: error.message
            });
        }

        res.json({ users: data });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to search users'
        });
    }
});

export default router;
