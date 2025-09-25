export const baseURL = 'http://localhost:3000'; // backend
const SummaryApi = {
    register: {
        url: '/user/register',  // Axios already has baseURL
        method: "POST"
    },
    login: {
        url: '/user/login',
        method: "POST"
    }
};
export default SummaryApi;
