export const CLAIMS_API = 'http://localhost:3000/reclamo';

export const createClaim = async (data: FormData, token: string) => {
    const response = await fetch(CLAIMS_API, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Content-Type is set automatically by browser for FormData
        },
        body: data
    });

    if (!response.ok) {
        let message = 'Error al crear el reclamo';
        try {
            const errorData = await response.json();
            message = errorData.message || message;
        } catch (e) { }
        throw new Error(message);
    }

    return response.json();
};

export const getClaims = async (token: string) => {
    const response = await fetch(CLAIMS_API, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar reclamos');
    }

    return response.json();
};
