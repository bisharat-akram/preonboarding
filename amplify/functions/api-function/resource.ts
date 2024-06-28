import { defineFunction, secret } from "@aws-amplify/backend";

export const myApiFunction = defineFunction({
    name: "api-function",
    environment: {
        BUCKET: secret("BUCKET"),
    }
});