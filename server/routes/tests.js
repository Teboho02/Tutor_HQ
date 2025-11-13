import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate, requireRole, validateBody } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/tests
 * Get all tests (with optional filters)
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const { tutorId, subject, testType } = req.query;

        let query = supabase
            .from('tests')
            .select(`
                *,
                tutors(
                    id,
                    profiles(full_name, avatar_url)
                )
            `)
            .order('created_at', { ascending: false });

        if (tutorId) {
            query = query.eq('tutor_id', tutorId);
        }

        if (subject) {
            query = query.eq('subject', subject);
        }

        if (testType) {
            query = query.eq('test_type', testType);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ tests: data });
    } catch (error) {
        console.error('Get tests error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch tests'
        });
    }
});

/**
 * GET /api/tests/:testId
 * Get test details by ID
 */
router.get('/:testId', authenticate, async (req, res) => {
    try {
        const { testId } = req.params;

        const { data, error } = await supabase
            .from('tests')
            .select(`
                *,
                tutors(
                    id,
                    profiles(full_name, avatar_url)
                )
            `)
            .eq('id', testId)
            .single();

        if (error) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Test not found'
            });
        }

        res.json({ test: data });
    } catch (error) {
        console.error('Get test error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch test'
        });
    }
});

/**
 * POST /api/tests
 * Create a new test (tutors only)
 */
router.post('/', authenticate, requireRole('tutor'), validateBody({
    title: { required: true, type: 'string' },
    subject: { required: true, type: 'string' },
    testType: { required: true, type: 'string' },
    questions: { required: true, type: 'object' },
    totalPoints: { required: true, type: 'number' }
}), async (req, res) => {
    try {
        const {
            title,
            subject,
            description,
            testType,
            questions,
            totalPoints,
            duration,
            dueDate
        } = req.body;

        const { data, error } = await supabase
            .from('tests')
            .insert({
                title,
                subject,
                description,
                tutor_id: req.user.id,
                test_type: testType,
                questions,
                total_points: totalPoints,
                duration,
                due_date: dueDate
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
            message: 'Test created successfully',
            test: data
        });
    } catch (error) {
        console.error('Create test error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create test'
        });
    }
});

/**
 * PUT /api/tests/:testId
 * Update test (tutor who created it only)
 */
router.put('/:testId', authenticate, requireRole('tutor'), async (req, res) => {
    try {
        const { testId } = req.params;

        // Check if user is the test creator
        const { data: existingTest, error: fetchError } = await supabase
            .from('tests')
            .select('tutor_id')
            .eq('id', testId)
            .single();

        if (fetchError || !existingTest) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Test not found'
            });
        }

        if (existingTest.tutor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only update your own tests'
            });
        }

        const {
            title,
            subject,
            description,
            testType,
            questions,
            totalPoints,
            duration,
            dueDate
        } = req.body;

        const updates = {};
        if (title !== undefined) updates.title = title;
        if (subject !== undefined) updates.subject = subject;
        if (description !== undefined) updates.description = description;
        if (testType !== undefined) updates.test_type = testType;
        if (questions !== undefined) updates.questions = questions;
        if (totalPoints !== undefined) updates.total_points = totalPoints;
        if (duration !== undefined) updates.duration = duration;
        if (dueDate !== undefined) updates.due_date = dueDate;

        const { data, error } = await supabase
            .from('tests')
            .update(updates)
            .eq('id', testId)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Update Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Test updated successfully',
            test: data
        });
    } catch (error) {
        console.error('Update test error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update test'
        });
    }
});

/**
 * DELETE /api/tests/:testId
 * Delete test (tutor who created it only)
 */
router.delete('/:testId', authenticate, requireRole('tutor'), async (req, res) => {
    try {
        const { testId } = req.params;

        // Check if user is the test creator
        const { data: existingTest, error: fetchError } = await supabase
            .from('tests')
            .select('tutor_id')
            .eq('id', testId)
            .single();

        if (fetchError || !existingTest) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Test not found'
            });
        }

        if (existingTest.tutor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only delete your own tests'
            });
        }

        const { error } = await supabase
            .from('tests')
            .delete()
            .eq('id', testId);

        if (error) {
            return res.status(400).json({
                error: 'Delete Failed',
                message: error.message
            });
        }

        res.json({
            message: 'Test deleted successfully'
        });
    } catch (error) {
        console.error('Delete test error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete test'
        });
    }
});

/**
 * POST /api/tests/:testId/assign
 * Assign test to student(s) (tutors only)
 */
router.post('/:testId/assign', authenticate, requireRole('tutor'), validateBody({
    studentIds: { required: true, type: 'object' }
}), async (req, res) => {
    try {
        const { testId } = req.params;
        const { studentIds, dueDate } = req.body;

        // Verify tutor owns the test
        const { data: test, error: testError } = await supabase
            .from('tests')
            .select('tutor_id')
            .eq('id', testId)
            .single();

        if (testError || !test || test.tutor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only assign your own tests'
            });
        }

        // Create assignments for each student
        const assignments = studentIds.map(studentId => ({
            test_id: testId,
            student_id: studentId,
            due_date: dueDate || null,
            status: 'assigned'
        }));

        const { data, error } = await supabase
            .from('test_assignments')
            .insert(assignments)
            .select();

        if (error) {
            return res.status(400).json({
                error: 'Assignment Failed',
                message: error.message
            });
        }

        res.status(201).json({
            message: 'Test assigned successfully',
            assignments: data
        });
    } catch (error) {
        console.error('Assign test error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to assign test'
        });
    }
});

/**
 * GET /api/tests/assignments/student/:studentId
 * Get all test assignments for a student
 */
router.get('/assignments/student/:studentId', authenticate, async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status } = req.query;

        // Check authorization
        if (req.user.id !== studentId && req.profile.role !== 'admin' && req.profile.role !== 'tutor') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only view your own assignments'
            });
        }

        let query = supabase
            .from('test_assignments')
            .select(`
                *,
                tests(
                    id,
                    title,
                    subject,
                    test_type,
                    total_points,
                    duration,
                    description
                ),
                test_submissions(
                    id,
                    score,
                    submitted_at,
                    graded_at
                )
            `)
            .eq('student_id', studentId)
            .order('assigned_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({
                error: 'Query Failed',
                message: error.message
            });
        }

        res.json({ assignments: data });
    } catch (error) {
        console.error('Get student assignments error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch assignments'
        });
    }
});

/**
 * GET /api/tests/assignments/:assignmentId
 * Get specific assignment details
 */
router.get('/assignments/:assignmentId', authenticate, async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const { data, error } = await supabase
            .from('test_assignments')
            .select(`
                *,
                tests(*),
                students(
                    id,
                    profiles(full_name)
                ),
                test_submissions(*)
            `)
            .eq('id', assignmentId)
            .single();

        if (error) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Assignment not found'
            });
        }

        // Check authorization
        const isStudent = req.user.id === data.student_id;
        const isTutor = req.user.id === data.tests.tutor_id;
        const isAdmin = req.profile.role === 'admin';

        if (!isStudent && !isTutor && !isAdmin) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have access to this assignment'
            });
        }

        res.json({ assignment: data });
    } catch (error) {
        console.error('Get assignment error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch assignment'
        });
    }
});

/**
 * POST /api/tests/assignments/:assignmentId/submit
 * Submit test answers (students only)
 */
router.post('/assignments/:assignmentId/submit', authenticate, requireRole('student'), validateBody({
    answers: { required: true, type: 'object' }
}), async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { answers } = req.body;

        // Verify assignment exists and belongs to student
        const { data: assignment, error: assignmentError } = await supabase
            .from('test_assignments')
            .select('student_id, status')
            .eq('id', assignmentId)
            .single();

        if (assignmentError || !assignment) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Assignment not found'
            });
        }

        if (assignment.student_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only submit your own assignments'
            });
        }

        // Create submission
        const { data: submission, error: submissionError } = await supabase
            .from('test_submissions')
            .insert({
                assignment_id: assignmentId,
                answers
            })
            .select()
            .single();

        if (submissionError) {
            return res.status(400).json({
                error: 'Submission Failed',
                message: submissionError.message
            });
        }

        // Update assignment status
        await supabase
            .from('test_assignments')
            .update({ status: 'submitted' })
            .eq('id', assignmentId);

        res.status(201).json({
            message: 'Test submitted successfully',
            submission
        });
    } catch (error) {
        console.error('Submit test error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to submit test'
        });
    }
});

/**
 * PUT /api/tests/submissions/:submissionId/grade
 * Grade a test submission (tutors only)
 */
router.put('/submissions/:submissionId/grade', authenticate, requireRole('tutor'), validateBody({
    score: { required: true, type: 'number' }
}), async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { score, feedback } = req.body;

        // Verify the submission exists and tutor has access
        const { data: submission, error: fetchError } = await supabase
            .from('test_submissions')
            .select(`
                *,
                test_assignments(
                    test_id,
                    tests(tutor_id)
                )
            `)
            .eq('id', submissionId)
            .single();

        if (fetchError || !submission) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Submission not found'
            });
        }

        if (submission.test_assignments.tests.tutor_id !== req.user.id) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only grade submissions for your own tests'
            });
        }

        // Update submission with grade
        const { data, error } = await supabase
            .from('test_submissions')
            .update({
                score,
                feedback,
                graded_at: new Date().toISOString(),
                graded_by: req.user.id
            })
            .eq('id', submissionId)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                error: 'Grading Failed',
                message: error.message
            });
        }

        // Update assignment status
        await supabase
            .from('test_assignments')
            .update({ status: 'graded' })
            .eq('id', submission.assignment_id);

        res.json({
            message: 'Test graded successfully',
            submission: data
        });
    } catch (error) {
        console.error('Grade test error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to grade test'
        });
    }
});

export default router;
