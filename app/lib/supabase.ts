import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://mappnpmbfqecnqutlfot.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZlNWExYjNiLTdmMzQtNGUxMC05NDA0LTgxNmJhYjU1Y2UyOSJ9.eyJwcm9qZWN0SWQiOiJtYXBwbnBtYmZxZWNucXV0bGZvdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY1NDY0Mzg2LCJleHAiOjIwODA4MjQzODYsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.-c4FEmgW6P5G5_L0kkNxEtu_W3uGI-A9Rc-K16EhUlU';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };