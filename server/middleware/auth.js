import { verifyToken, getUserProfile } from '../config/supabase.js';

/**
 * Middleware to authenticate requests using Supabase JWT
 * Expects Authorization header with format: "Bearer <token>"
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing or invalid authorization header'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token with Supabase
        const { user, error } = await verifyToken(token);

        if (error || !user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired token'
            });
        }

        // Get user profile to include role information
        const { profile, error: profileError } = await getUserProfile(user.id);

        if (profileError) {
            return res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch user profile'
            });
        }

        // Attach user and profile to request object
        req.user = user;
        req.profile = profile;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed'
        });
    }
};

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.profile) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User not authenticated'
            });
        }

        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!roles.includes(req.profile.role)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Access denied. Required role(s): ${roles.join(', ')}`
            });
        }

        next();
    };
};

/**
 * Middleware to check if user is accessing their own resource
 * Compares req.params.userId or req.params.id with authenticated user's ID
 */
export const requireOwnership = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'User not authenticated'
        });
    }

    const resourceUserId = req.params.userId || req.params.id;

    if (resourceUserId !== req.user.id) {
        // Allow admins to access any resource
        if (req.profile?.role !== 'admin') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only access your own resources'
            });
        }
    }

    next();
};

/**
 * Optional authentication - doesn't fail if no token provided
 * Useful for routes that have different behavior for authenticated vs unauthenticated users
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided, continue without authentication
            return next();
        }

        const token = authHeader.substring(7);
        const { user, error } = await verifyToken(token);

        if (!error && user) {
            const { profile } = await getUserProfile(user.id);
            req.user = user;
            req.profile = profile;
        }

        next();
    } catch (error) {
        // Continue without authentication on error
        next();
    }
};

/**
 * Middleware to validate request body against a schema
 * @param {object} schema - Object with required fields and their types
 */
export const validateBody = (schema) => {
    return (req, res, next) => {
        const errors = [];

        for (const [field, config] of Object.entries(schema)) {
            const value = req.body[field];

            // Check if required field is missing
            if (config.required && (value === undefined || value === null || value === '')) {
                errors.push(`${field} is required`);
                continue;
            }

            // Skip validation if field is optional and not provided
            if (!config.required && (value === undefined || value === null)) {
                continue;
            }

            // Type validation
            if (config.type) {
                const actualType = Array.isArray(value) ? 'array' : typeof value;
                if (actualType !== config.type) {
                    errors.push(`${field} must be of type ${config.type}`);
                }
            }

            // Custom validation function
            if (config.validate && typeof config.validate === 'function') {
                const validationError = config.validate(value);
                if (validationError) {
                    errors.push(validationError);
                }
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Invalid request body',
                details: errors
            });
        }

        next();
    };
};

export default {
    authenticate,
    requireRole,
    requireOwnership,
    optionalAuth,
    validateBody
};
