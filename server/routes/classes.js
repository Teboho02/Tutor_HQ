import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate, requireRole, validateBody } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/classes
 * Get all classes (with optional filters)
 */
router.get('/', async (req, res) => {
    try {
        const { tutorId, studentId, status, subject, startDate, endDate } = req.query;

        let query = supabase
            .from('classes')
            .select(`
                *,
                tutors!inner(
                    id,
                    subjects,
                    profiles!inner(full_name, avatar_url)
                )
            `)
            .order('start_time', { ascending: true });

        // Apply filters
        if (tutorId) {
            query = query.eq('tutor_id', tutorId);
        }

        if (status) {
            query = query.eq('status', status);
        }

        if (subject) {
            query = query.eq('subject', subject);
        }

        if (startDate) {
            query = query.gte('start_time', startDate);
        }

        if (endDate) {
            query = query.lte('start_time', endDate);
        }

        // If filtering by student, join with enrollments
        if (studentId) {
            const { data: enrollments, error: enrollError } = await supabase
                .from('class_enrollments')
                .select('class_id')
                .eq('student_id', studentId);

            if (enrollError) {
                return res.status(400).json({
                    error: 'Query Failed',
                    message: enrollError.message
                });
            }

            const classIds = enrollments.map(e => e.class_id);
            query = query.in('id', classIds);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ classes: data });
    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch classes'
        });
    }
});

/**
 * GET /api/classes/:classId
 * Get class details by ID
 */
router.get('/:classId', async (req, res) => {
    try {
        const { classId } = req.params;

        const { data, error } = await supabase
            .from('classes')
            .select(`
                *,
                tutors(
                    id,
                    subjects,
                    hourly_rate,
                    profiles(full_name, avatar_url, bio)
                ),
                class_enrollments(
                    id,
                    attendance_status,
                    students(
                        id,
                        profiles(full_name, avatar_url)
                    )
                )
            `)
            .eq('id', classId)
            .single();

        if (error) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Class not found'
            });
        }

        res.json({ class: data });
    } catch (error) {
        console.error('Get class error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch class'
        });
    }
});

/**
 * POST /api/classes
 * Create a new class (tutors only)
 */
router.post('/', authenticate, requireRole('tutor'), validateBody({
    title: { required: true, type: 'string' },
    subject: { required: true, type: 'string' },
    startTime: { required: true, type: 'string' },
    endTime: { required: true, type: 'string' }
}), async (req, res) => {
    try {
        const {
            title,
            subject,
            description,
            startTime,
            endTime,
            duration,
            meetingUrl,
            maxStudents,
            isGroup
        } = req.body;

        const { data, error } = await supabase
            .from('classes')
            .insert({
                title,
                subject,
                description,
                tutor_id: req.user.id,
                start_time: startTime,
                end_time: endTime,
                duration,
                meeting_url: meetingUrl,
                max_students: maxStudents,
                is_group: isGroup || false,
                status: 'scheduled'
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Creation Failed',
                message: error.message
            });
        }

        res.status(201).json({
            message: 'Class created successfully',
            class: data
        });
    } catch (error) {
        console.error('Create class error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create class'
        });
    }
});

/**
 * PUT /api/classes/:classId
 * Update class (tutor who created it only)
 */
router.put('/:classId', authenticate, requireRole('tutor'), async (req, res) => {
    try {
        const { classId } = req.params;

        // Check if user is the class tutor
        const { data: existingClass, error: fetchError } = await supabase
            .from('classes')
            .select('tutor_id')
            .eq('id', classId)
            .single();

        if (fetchError || !existingClass) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Class not found'
            });
        }

        if (existingClass.tutor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only update your own classes'
            });
        }

        const {
            title,
            subject,
            description,
            startTime,
            endTime,
            duration,
            meetingUrl,
            status,
            maxStudents
        } = req.body;

        const updates = {};
        if (title !== undefined) updates.title = title;
        if (subject !== undefined) updates.subject = subject;
        if (description !== undefined) updates.description = description;
        if (startTime !== undefined) updates.start_time = startTime;
        if (endTime !== undefined) updates.end_time = endTime;
        if (duration !== undefined) updates.duration = duration;
        if (meetingUrl !== undefined) updates.meeting_url = meetingUrl;
        if (status !== undefined) updates.status = status;
        if (maxStudents !== undefined) updates.max_students = maxStudents;

        const { data, error } = await supabase
            .from('classes')
            .update(updates)
            .eq('id', classId)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Update Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Class updated successfully',
            class: data
        });
    } catch (error) {
        console.error('Update class error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update class'
        });
    }
});

/**
 * DELETE /api/classes/:classId
 * Delete class (tutor who created it only)
 */
router.delete('/:classId', authenticate, requireRole('tutor'), async (req, res) => {
    try {
        const { classId } = req.params;

        // Check if user is the class tutor
        const { data: existingClass, error: fetchError } = await supabase
            .from('classes')
            .select('tutor_id')
            .eq('id', classId)
            .single();

        if (fetchError || !existingClass) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Class not found'
            });
        }

        if (existingClass.tutor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only delete your own classes'
            });
        }

        const { error } = await supabase
            .from('classes')
            .delete()
            .eq('id', classId);

        if (error) {
            return res.status(400).json({
                error: 'Delete Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Class deleted successfully'
        });
    } catch (error) {
        console.error('Delete class error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete class'
        });
    }
});

/**
 * POST /api/classes/:classId/enroll
 * Enroll in a class (students only)
 */
router.post('/:classId/enroll', authenticate, requireRole('student'), async (req, res) => {
    try {
        const { classId } = req.params;

        // Check if class exists and has space
        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('id, max_students, class_enrollments(count)')
            .eq('id', classId)
            .single();

        if (classError || !classData) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Class not found'
            });
        }

        // Check if already enrolled
        const { data: existing } = await supabase
            .from('class_enrollments')
            .select('id')
            .eq('class_id', classId)
            .eq('student_id', req.user.id)
            .single();

        if (existing) {
            return res.status(400).json({
                error: 'Already Enrolled',
                message: 'You are already enrolled in this class'
            });
        }

        const { data, error } = await supabase
            .from('class_enrollments')
            .insert({
                class_id: classId,
                student_id: req.user.id,
                attendance_status: 'pending'
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Enrollment Failed',
                message: error.message
            });
        }

        res.status(201).json({
            message: 'Enrolled successfully',
            enrollment: data
        });
    } catch (error) {
        console.error('Enroll class error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to enroll in class'
        });
    }
});

/**
 * DELETE /api/classes/:classId/enroll
 * Unenroll from a class
 */
router.delete('/:classId/enroll', authenticate, requireRole('student'), async (req, res) => {
    try {
        const { classId } = req.params;

        const { error } = await supabase
            .from('class_enrollments')
            .delete()
            .eq('class_id', classId)
            .eq('student_id', req.user.id);

        if (error) {
            return res.status(400).json({
                error: 'Unenroll Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Unenrolled successfully'
        });
    } catch (error) {
        console.error('Unenroll class error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to unenroll from class'
        });
    }
});

/**
 * PUT /api/classes/:classId/attendance/:enrollmentId
 * Update attendance status (tutor only)
 */
router.put('/:classId/attendance/:enrollmentId', authenticate, requireRole('tutor'), async (req, res) => {
    try {
        const { classId, enrollmentId } = req.params;
        const { attendanceStatus } = req.body;

        if (!['pending', 'attended', 'absent', 'excused'].includes(attendanceStatus)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid attendance status'
            });
        }

        // Verify the tutor owns this class
        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('tutor_id')
            .eq('id', classId)
            .single();

        if (classError || !classData || classData.tutor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only update attendance for your own classes'
            });
        }

        const { data, error } = await supabase
            .from('class_enrollments')
            .update({ attendance_status: attendanceStatus })
            .eq('id', enrollmentId)
            .eq('class_id', classId)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Update Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Attendance updated successfully',
            enrollment: data
        });
    } catch (error) {
        console.error('Update attendance error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update attendance'
        });
    }
});

export default router;
