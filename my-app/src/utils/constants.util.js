const CONSTANTS = {
    VALIDATION_MESSAGES: {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    },
    apis: {
        root: 'http://localhost:4000',
    },
};

export default CONSTANTS;
