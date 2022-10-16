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
