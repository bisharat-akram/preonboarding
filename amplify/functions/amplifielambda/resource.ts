import { defineFunction } from '@aws-amplify/backend';

export const amplifielambda = defineFunction({
    name: 'amplifielambda',
    entry: './handler.ts'
});