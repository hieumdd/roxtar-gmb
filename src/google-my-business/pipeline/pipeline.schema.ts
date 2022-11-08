export const locationSchema = [
    { name: 'name', type: 'STRING' },
    { name: 'title', type: 'STRING' },
];

export const insightSchema = [
    { name: 'location_id', type: 'STRING' },
    { name: 'metric', type: 'STRING' },
    { name: 'date', type: 'STRING' },
    { name: 'value', type: 'NUMERIC' },
];

export const reviewSchema = [
    { name: 'reviewId', type: 'STRING' },
    {
        name: 'reviewer',
        type: 'record',
        fields: [
            { name: 'profilePhotoUrl', type: 'STRING' },
            { name: 'displayName', type: 'STRING' },
        ],
    },
    { name: 'starRating', type: 'STRING' },
    { name: 'comment', type: 'STRING' },
    { name: 'createTime', type: 'TIMESTAMP' },
    { name: 'updateTime', type: 'TIMESTAMP' },
    {
        name: 'reviewReply',
        type: 'record',
        fields: [
            { name: 'comment', type: 'STRING' },
            { name: 'updateTime', type: 'TIMESTAMP' },
        ],
    },
    { name: 'name', type: 'STRING' },
    { name: 'accountId', type: 'STRING' },
    { name: 'locationId', type: 'STRING' },
];
