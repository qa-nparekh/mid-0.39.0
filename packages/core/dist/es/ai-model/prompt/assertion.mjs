const assertSchema = {
    type: 'json_schema',
    json_schema: {
        name: 'assert',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                pass: {
                    type: 'boolean',
                    description: 'Whether the assertion passed or failed'
                },
                thought: {
                    type: [
                        'string',
                        'null'
                    ],
                    description: 'The thought process behind the assertion'
                }
            },
            required: [
                'pass',
                'thought'
            ],
            additionalProperties: false
        }
    }
};
export { assertSchema };

//# sourceMappingURL=assertion.mjs.map