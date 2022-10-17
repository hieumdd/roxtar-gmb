import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

import ndjson from 'ndjson';
import { BigQuery } from '@google-cloud/bigquery';
import dayjs from 'dayjs';

type TAddBatchedAtOptions = {
    rows: Record<string, any>[];
    schema: Record<string, any>[];
};

type TLoadOptions = {
    table: string;
    schema: Record<string, any>[];
};

const client = new BigQuery();

const DATASET = 'GoogleMyBusiness';

const addBatchedAt = ({ rows, schema }: TAddBatchedAtOptions) => [
    rows.map((row) => ({ ...row, _batched_at: dayjs().toISOString() })),
    [...schema, { name: '_batched_at', type: 'TIMESTAMP' }],
];

export const load = (rows: Record<string, any>[], options: TLoadOptions) => {
    const [_rows, fields] = addBatchedAt({ rows, schema: options.schema });

    const tableWriteStream = client
        .dataset(DATASET)
        .table(`p_${options.table}`)
        .createWriteStream({
            schema: { fields },
            sourceFormat: 'NEWLINE_DELIMITED_JSON',
            createDisposition: 'CREATE_IF_NEEDED',
            writeDisposition: 'WRITE_APPEND',
        });

    return pipeline(Readable.from(_rows), ndjson.stringify(), tableWriteStream);
};
