import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

/**
 * Custom hook for tracking page views and session duration
 */
export function usePageTracking() {
    const location = useLocation();
    const entryTimeRef = useRef<number>(Date.now());
    const sessionIdRef = useRef<string>(getOrCreateSessionId());

    useEffect(() => {
        // Track page entry
        const entryTime = Date.now();
        entryTimeRef.current = entryTime;

        trackPageView({
            page_path: location.pathname,
            referrer: document.referrer,
            session_id: sessionIdRef.current,
            entry_time: new Date(entryTime).toISOString(),
        });

        // Track page exit on cleanup
        return () => {
            const exitTime = Date.now();
            const duration = Math.floor((exitTime - entryTimeRef.current) / 1000); // in seconds

            trackPageExit({
                page_path: location.pathname,
                session_id: sessionIdRef.current,
                exit_time: new Date(exitTime).toISOString(),
                duration,
            });
        };
    }, [location.pathname]);
}

/**
 * Get or create a session ID
 */
function getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');

    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
    }

    return sessionId;
}

/**
 * Track page view entry
 */
async function trackPageView(data: {
    page_path: string;
    referrer: string;
    session_id: string;
    entry_time: string;
}) {
    try {
        await api.post('/analytics/page-view', {
            ...data,
            user_agent: navigator.userAgent,
        });
    } catch (error) {
        // Silently fail - analytics should not disrupt user experience
        console.debug('Analytics tracking failed:', error);
    }
}

/**
 * Track page exit
 */
async function trackPageExit(data: {
    page_path: string;
    session_id: string;
    exit_time: string;
    duration: number;
}) {
    try {
        // Use sendBeacon for reliable tracking on page unload
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(`${api.defaults.baseURL}/analytics/page-exit`, blob);
    } catch (error) {
        // Fallback to regular API call
        try {
            await api.post('/analytics/page-exit', data);
        } catch (err) {
            console.debug('Analytics exit tracking failed:', err);
        }
    }
}
