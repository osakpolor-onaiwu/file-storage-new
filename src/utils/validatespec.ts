export function validateSchema(spec: any, data: object, optionalConfig = {}) {
    const { error, value } = spec.validate(data, {
        allowUnknown: true,
        stripUnknown: true,
        errors: {
            wrap: {
                label: '',
            },
        },
        ...optionalConfig,
    });
    if (error) {
        throw new Error(error.message);
    }
    return value;
};

export async function validateSchemaAsync(spec: any, data: object, optionalConfig = {}) {
    try {
        const value = await spec.validateAsync(data, {
            allowUnknown: true,
            stripUnknown: true,
            errors: {
                wrap: {
                    label: '',
                },
            },
            ...optionalConfig,
        });
        return value;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

module.exports = {
    validateSchema,
    validateSchemaAsync
}
