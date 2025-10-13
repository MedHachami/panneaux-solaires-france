import axios from 'axios';

const API_URL = 'https://www.panneauxsolairfrance.com/api';
// Make sure your PHP files are accessible at this URL

export const submitLead = async(leadData) => {
    try {
        const response = await axios.post(`https://www.panneauxsolairfrance.com/api/submit-lead.php`, leadData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false,
        });

        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ Erreur submitLead:', error);

        if (error.response) {
            // backend responded with an error
            return {
                success: false,
                error: error.response.data ?.error || 'Erreur serveur',
            };
        }

        return { success: false, error: error.message || 'Erreur inconnue' };
    }
};

export const getLeads = async() => {
    try {
        const response = await axios.get(`${API_URL}/getLeads.php`, {
            withCredentials: false,
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ Erreur getLeads:', error);

        if (error.response) {
            return {
                success: false,
                error: error.response.data ?.error || 'Erreur serveur',
            };
        }

        return { success: false, error: error.message || 'Erreur inconnue' };
    }
};
