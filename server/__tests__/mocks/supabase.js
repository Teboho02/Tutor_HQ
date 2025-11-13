// Mock Supabase client for testing

export const mockSupabaseUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
};

export const mockStudentProfile = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    full_name: 'Test Student',
    role: 'student',
    avatar_url: null,
    phone: null,
    bio: null,
    created_at: new Date().toISOString(),
};

export const mockTutorProfile = {
    id: 'test-tutor-id-456',
    email: 'tutor@example.com',
    full_name: 'Test Tutor',
    role: 'tutor',
    avatar_url: null,
    phone: null,
    bio: 'Experienced tutor',
    created_at: new Date().toISOString(),
};

export const mockSession = {
    access_token: 'mock-jwt-token-12345',
    refresh_token: 'mock-refresh-token-12345',
    expires_in: 3600,
    token_type: 'bearer',
    user: mockSupabaseUser,
};

// Mock Supabase query builder
class MockQueryBuilder {
    constructor(data = null, error = null) {
        this.data = data;
        this.error = error;
        this.filters = {};
    }

    select(columns) {
        return this;
    }

    insert(values) {
        return this;
    }

    update(values) {
        return this;
    }

    delete() {
        return this;
    }

    eq(column, value) {
        this.filters[column] = value;
        return this;
    }

    neq(column, value) {
        return this;
    }

    gt(column, value) {
        return this;
    }

    gte(column, value) {
        return this;
    }

    lt(column, value) {
        return this;
    }

    lte(column, value) {
        return this;
    }

    in(column, values) {
        return this;
    }

    contains(column, values) {
        return this;
    }

    or(query) {
        return this;
    }

    order(column, options) {
        return this;
    }

    limit(count) {
        return this;
    }

    single() {
        return Promise.resolve({ data: this.data, error: this.error });
    }

    then(resolve, reject) {
        const result = { data: this.data, error: this.error };
        return resolve ? resolve(result) : Promise.resolve(result);
    }
}

// Mock Supabase client
export const createMockSupabase = (overrides = {}) => {
    const mockFrom = (table) => {
        return new MockQueryBuilder(overrides[table]?.data, overrides[table]?.error);
    };

    const mockAuth = {
        signUp: jest.fn().mockResolvedValue({
            data: { user: mockSupabaseUser, session: mockSession },
            error: null,
        }),
        signInWithPassword: jest.fn().mockResolvedValue({
            data: { user: mockSupabaseUser, session: mockSession },
            error: null,
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
        getUser: jest.fn().mockResolvedValue({
            data: { user: mockSupabaseUser },
            error: null,
        }),
        refreshSession: jest.fn().mockResolvedValue({
            data: { session: mockSession },
            error: null,
        }),
        resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
        updateUser: jest.fn().mockResolvedValue({
            data: { user: mockSupabaseUser },
            error: null,
        }),
    };

    return {
        from: mockFrom,
        auth: mockAuth,
    };
};

// Mock the entire Supabase module
export const mockSupabaseModule = {
    createClient: jest.fn(() => createMockSupabase()),
};
