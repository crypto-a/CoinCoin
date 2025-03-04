// src/db.js


import { createClient } from "@supabase/supabase-js";

const baseUrl = import.meta.env.VITE_DB_BASE_URL;
const apiKey = import.meta.env.VITE_DB_API_KEY;

export const db = createClient(baseUrl, apiKey);
