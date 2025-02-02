import { computed } from 'vue';

const statusColors = {
    'needs action': 'error',
    'open issue': 'secondary',
    'acknowledged': 'orange',
    'resolved': 'primary',
    'open': 'secondary',
    'overdue': 'orange',
    'closed': 'cyan',
} as any;


const priorityColors = {
    'no priority': 'grey',
    'high': 'error',
    'medium': '#883000',
    'low': '#fc6600',
} as any;

export const useColor = () => {
    const getStatusColor = (status: string | undefined) => {
        return statusColors[(status || '').toLowerCase()] || 'default'; // Fallback color
    };

    const getPriorityColor = (priority: string | undefined) => {
        return priorityColors[(priority || '').toLowerCase()] || 'default'; // Fallback color
    };

    return { getStatusColor, getPriorityColor };
};