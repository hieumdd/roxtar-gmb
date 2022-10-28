import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export const getSecret = (name: string) =>
    client
        .getProjectId()
        .then((projectId) => `projects/${projectId}/secrets/${name}/versions/latest`)
        .then((path) => client.accessSecretVersion({ name: path }))
        .then(([res]) => res.payload?.data?.toString() || '');
