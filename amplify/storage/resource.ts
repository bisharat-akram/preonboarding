import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'filestorages',
    access: (allow) => ({
        'files/{entity_id}/*': [
            allow.guest.to(['read']),
            allow.entity('identity').to(['read', 'write', 'delete'])
        ],
        'files-submissions/{user_sub}/*': [
            allow.authenticated.to(['read', 'write']),
            allow.guest.to(['read', 'write']),
            allow.entity('identity').to(['read', 'write', 'delete'])
        ],
        'files-submissions/*': [
            allow.authenticated.to(['read', 'write']),
            allow.guest.to(['read', 'write'])
        ],
    })
});