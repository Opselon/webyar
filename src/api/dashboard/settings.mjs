// src/api/dashboard/settings.mjs
import { json } from '../../utils/response.mjs';
import { queryDb, execDb } from '../../utils/db.mjs';

/**
 * GET /api/dashboard/settings
 * Retrieves all site settings from the database.
 */
export const getSettings = async (request, env) => {
    const { results } = await queryDb(env.DB, 'SELECT key, value FROM settings');

    // Convert array of {key, value} to a single object {key1: value1, key2: value2}
    const settings = (results || []).reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
    }, {});

    return json(settings);
};

/**
 * PUT /api/dashboard/settings
 * Updates multiple site settings at once.
 * Expects a JSON body like: { "site_title": "New Title", "site_description": "New Desc" }
 */
export const updateSettings = async (request, env) => {
    const settingsToUpdate = await request.json();
    if (typeof settingsToUpdate !== 'object' || Object.keys(settingsToUpdate).length === 0) {
        return json({ error: 'Invalid request body.' }, 400);
    }

    // Use transactions for updating multiple settings to ensure atomicity
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
