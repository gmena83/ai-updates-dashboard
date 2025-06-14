
export interface SheetData {
  timestamp: string;
  type: string;
  title: string;
  description: string;
  source: string;
  impact: string;
  url: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  scriptUrl: string;
  sheetName: string;
}

class GoogleSheetsService {
  private config: GoogleSheetsConfig | null = null;

  setConfig(config: GoogleSheetsConfig) {
    console.log('Configurando Google Sheets con Apps Script:', {
      hasSpreadsheetId: !!config.spreadsheetId,
      hasScriptUrl: !!config.scriptUrl,
      sheetName: config.sheetName,
      scriptUrl: config.scriptUrl
    });
    this.config = config;
    localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
  }

  getConfig(): GoogleSheetsConfig | null {
    if (this.config) return this.config;
    
    const stored = localStorage.getItem('googleSheetsConfig');
    if (stored) {
      this.config = JSON.parse(stored);
      console.log('Configuración cargada desde localStorage:', this.config);
      return this.config;
    }
    
    console.log('No hay configuración de Google Sheets guardada');
    return null;
  }

  clearConfig() {
    console.log('Limpiando configuración de Google Sheets');
    this.config = null;
    localStorage.removeItem('googleSheetsConfig');
  }

  private extractSpreadsheetId(url: string): string {
    console.log('Extrayendo ID de la URL:', url);
    
    // Si ya es un ID, devolverlo directamente
    if (url.match(/^[a-zA-Z0-9-_]{44}$/)) {
      console.log('Es un ID directo:', url);
      return url;
    }
    
    // Extraer de URL completa
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    const id = match ? match[1] : '';
    console.log('ID extraído:', id);
    return id;
  }

  async testConnection(): Promise<boolean> {
    console.log('🔍 Probando conexión con Google Apps Script...');
    
    const config = this.getConfig();
    if (!config) {
      console.error('❌ No hay configuración para probar');
      return false;
    }

    console.log('📋 Configuración encontrada:', {
      scriptUrl: config.scriptUrl,
      sheetName: config.sheetName,
      spreadsheetId: config.spreadsheetId.substring(0, 20) + '...'
    });

    const spreadsheetId = this.extractSpreadsheetId(config.spreadsheetId);
    if (!spreadsheetId) {
      console.error('❌ ID de spreadsheet inválido');
      return false;
    }

    try {
      const testPayload = {
        action: 'test',
        spreadsheetId: spreadsheetId,
        sheetName: config.sheetName,
        values: []
      };

      console.log('📤 Enviando payload de prueba:', testPayload);
      console.log('🌐 URL del script:', config.scriptUrl);
      
      const response = await fetch(config.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
        mode: 'cors'
      });
      
      console.log('📥 Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error HTTP:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        return false;
      }

      const data = await response.json();
      console.log('✅ Datos de respuesta:', data);
      
      return data.success !== false;
    } catch (error) {
      console.error('❌ Error en conexión:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🚨 Posible problema de CORS o URL incorrecta');
      }
      return false;
    }
  }

  async appendData(data: SheetData[]): Promise<boolean> {
    console.log('📊 Iniciando appendData con Google Apps Script:', data.length, 'elementos');
    
    const config = this.getConfig();
    if (!config) {
      console.error('❌ No hay configuración de Google Sheets');
      throw new Error('Google Sheets no está configurado');
    }

    const spreadsheetId = this.extractSpreadsheetId(config.spreadsheetId);
    if (!spreadsheetId) {
      console.error('❌ URL de Google Sheets inválida:', config.spreadsheetId);
      throw new Error('URL de Google Sheets inválida');
    }

    try {
      const values = data.map(item => [
        item.timestamp,
        item.type,
        item.title,
        item.description,
        item.source,
        item.impact,
        item.url
      ]);

      const payload = {
        action: 'append',
        spreadsheetId: spreadsheetId,
        sheetName: config.sheetName,
        values: values
      };

      console.log('📤 Enviando datos:', payload);

      const response = await fetch(config.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      console.log('📥 Respuesta de envío:', {
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error de Apps Script:', errorText);
        throw new Error(`Error de Google Apps Script: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('✅ Datos enviados correctamente:', responseData);

      if (!responseData.success) {
        throw new Error(`Error del script: ${responseData.error || 'Error desconocido'}`);
      }

      return true;
    } catch (error) {
      console.error('❌ Error al enviar datos:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
