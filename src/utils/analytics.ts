/**
 * Analytics Utility
 * Tracks user behavior and application metrics
 * Can be integrated with Google Analytics, Mixpanel, or custom analytics
 */

export interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
    metadata?: Record<string, any>;
}

export interface PageView {
    page: string;
    title: string;
    referrer?: string;
}

export interface UserProperties {
    userId?: string;
    role?: string;
    email?: string;
    [key: string]: any;
}

class Analytics {
    private enabled: boolean;
    private userId: string | null = null;
    private userProperties: UserProperties = {};

    constructor() {
        this.enabled = !import.meta.env.DEV; // Disabled in development
    }

    // Initialize analytics with user information
    initialize(userId: string, properties?: UserProperties): void {
        this.userId = userId;
        this.userProperties = { userId, ...properties };

        if (this.enabled) {
            // TODO: Initialize Google Analytics or other service
            // gtag('config', 'GA_MEASUREMENT_ID', { user_id: userId });
            console.log('[Analytics] Initialized for user:', userId);
        }
    }

    // Track page views
    trackPageView(page: string, title: string): void {
        if (!this.enabled) return;

        const pageView: PageView = {
            page,
            title,
            referrer: document.referrer,
        };

        // TODO: Send to analytics service
        // gtag('config', 'GA_MEASUREMENT_ID', { page_path: page });
        console.log('[Analytics] Page view:', pageView);
    }

    // Track custom events
    trackEvent(event: AnalyticsEvent): void {
        if (!this.enabled) return;

        const fullEvent = {
            ...event,
            timestamp: new Date().toISOString(),
            userId: this.userId,
        };

        // TODO: Send to analytics service
        // gtag('event', event.action, {
        //   event_category: event.category,
        //   event_label: event.label,
        //   value: event.value,
        // });
        console.log('[Analytics] Event:', fullEvent);
    }

    // Predefined event trackers
    trackLogin(method: string): void {
        this.trackEvent({
            category: 'Authentication',
            action: 'Login',
            label: method,
        });
    }

    trackSignup(method: string, role: string): void {
        this.trackEvent({
            category: 'Authentication',
            action: 'Signup',
            label: method,
            metadata: { role },
        });
    }

    trackLogout(): void {
        this.trackEvent({
            category: 'Authentication',
            action: 'Logout',
        });
    }

    trackTestSubmission(testId: string, score: number): void {
        this.trackEvent({
            category: 'Education',
            action: 'Test Submitted',
            label: testId,
            value: score,
        });
    }

    trackAssignmentSubmission(assignmentId: string): void {
        this.trackEvent({
            category: 'Education',
            action: 'Assignment Submitted',
            label: assignmentId,
        });
    }

    trackMaterialDownload(materialId: string, materialType: string): void {
        this.trackEvent({
            category: 'Education',
            action: 'Material Downloaded',
            label: materialId,
            metadata: { type: materialType },
        });
    }

    trackClassScheduled(classId: string, subject: string): void {
        this.trackEvent({
            category: 'Scheduling',
            action: 'Class Scheduled',
            label: classId,
            metadata: { subject },
        });
    }

    trackGoalCreated(goalId: string, category: string): void {
        this.trackEvent({
            category: 'Goals',
            action: 'Goal Created',
            label: goalId,
            metadata: { category },
        });
    }

    trackGoalCompleted(goalId: string): void {
        this.trackEvent({
            category: 'Goals',
            action: 'Goal Completed',
            label: goalId,
        });
    }

    trackBadgeEarned(badgeId: string, badgeName: string): void {
        this.trackEvent({
            category: 'Achievements',
            action: 'Badge Earned',
            label: badgeId,
            metadata: { name: badgeName },
        });
    }

    trackError(errorMessage: string, errorType: string): void {
        this.trackEvent({
            category: 'Errors',
            action: 'Error Occurred',
            label: errorType,
            metadata: { message: errorMessage },
        });
    }

    // Track user engagement metrics
    trackTimeOnPage(page: string, seconds: number): void {
        this.trackEvent({
            category: 'Engagement',
            action: 'Time on Page',
            label: page,
            value: seconds,
        });
    }

    trackSearch(query: string, resultsCount: number): void {
        this.trackEvent({
            category: 'Search',
            action: 'Search Performed',
            label: query,
            value: resultsCount,
        });
    }

    // Update user properties
    setUserProperty(key: string, value: any): void {
        this.userProperties[key] = value;

        if (this.enabled) {
            // TODO: Update user properties in analytics service
            // gtag('set', 'user_properties', { [key]: value });
            console.log('[Analytics] User property updated:', key, value);
        }
    }

    // Timing/Performance tracking
    startTiming(category: string, variable: string): () => void {
        const startTime = performance.now();

        return () => {
            const duration = performance.now() - startTime;

            if (this.enabled) {
                // TODO: Send timing to analytics
                // gtag('event', 'timing_complete', {
                //   name: variable,
                //   value: Math.round(duration),
                //   event_category: category,
                // });
                console.log('[Analytics] Timing:', category, variable, `${duration.toFixed(2)}ms`);
            }
        };
    }
}

// Singleton instance
export const analytics = new Analytics();

export default analytics;
