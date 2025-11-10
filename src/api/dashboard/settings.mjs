// src/api/dashboard/settings.mjs
import { json } from '../../utils/response.mjs';
import { queryDb, execDb } from '../../utils/db.mjs';

export const getSettings = async (request, env) => {
    const { results } = await queryDb(env.DB, 'SELECT key, value FROM settings');

    const settings = (results || []).reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
    }, {});

    return json(settings);
};

export const updateSettings = async (request, env) => {
    const settingsToUpdate = await request.json();
    if (typeof settingsToUpdate !== 'object' || Object.keys(settingsToUpdate).length === 0) {
        return json({ error: 'Invalid request body.' }, 400);
    }

    const statements = Object.entries(settingsToUpdate).map(([key, value]) =>
        env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
              .bind(key, value)
    );

    try {
        await env.DB.batch(statements);
        return json({ success: true, message: 'Settings updated successfully.' });
    } catch (e) {
        return json({ error: 'Failed to update settings.', details: e.message }, 500);
    }
};
