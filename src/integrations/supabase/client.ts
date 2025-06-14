
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si no hay variables de entorno, crear un cliente mock para evitar errores
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase variables de entorno no encontradas. Usando cliente mock.')
  
  // Cliente mock para desarrollo cuando no hay variables de Supabase
  const mockSupabase = {
    functions: {
      invoke: async () => {
        throw new Error('Supabase no está configurado. Configure las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
      }
    }
  }
  
  supabase = mockSupabase;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
