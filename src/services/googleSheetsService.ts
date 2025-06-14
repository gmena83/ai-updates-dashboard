
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
  scriptUrl: string;  // Cambiado de apiKey a scriptUrl
  sheetName: string;
}

class GoogleSheetsService {
  private config: GoogleSheetsConfig | null = null;

  setConfig(config: GoogleSheetsConfig) {
    console.log('Configurando Google Sheets con Apps Script:', {
      hasSpreadsheetId: !!config.spreadsheetId,
      hasScriptUrl: !!config.scriptUrl,
      sheetName: config.sheetName
    });
    this.config = config;
    localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
  }

  getConfig(): GoogleSheetsConfig | null {
    if (this.config) return this.config;
    
    const stored = localStorage.getItem('googleSheetsConfig');
    if (stored) {
      this.config = JSON.parse(stored);
      console.log('Configuración cargada desde localStorage:', {
        hasConfig: !!this.config,
        sheetName: this.config?.sheetName
      });
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

  async appendData(data: SheetData[]): Promise<boolean> {
    console.log('Iniciando appendData con Google Apps Script:', data.length, 'elementos');
    
    const config = this.getConfig();
    if (!config) {
      console.error('No hay configuración de Google Sheets');
      throw new Error('Google Sheets no está configurado');
    }

    const spreadsheetId = this.extractSpreadsheetId(config.spreadsheetId);
    if (!spreadsheetId) {
      console.error('URL de Google Sheets inválida:', config.spreadsheetId);
      throw new Error('URL de Google Sheets inválida');
    }

    console.log('Configuración para envío:', {
      spreadsheetId,
      scriptUrl: config.scriptUrl,
      sheetName: config.sheetName,
      dataCount: data.length
    });

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

      console.log('Valores a enviar:', values);

      const payload = {
        spreadsheetId: spreadsheetId,
        sheetName: config.sheetName,
        values: values
      };

      console.log('Payload para Google Apps Script:', payload);

      const response = await fetch(config.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Respuesta de Google Apps Script:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error de Google Apps Script:', errorText);
        throw new Error(`Error de Google Apps Script: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Datos de respuesta exitosa:', responseData);

      if (!responseData.success) {
        throw new Error(`Error del script: ${responseData.error || 'Error desconocido'}`);
      }

      return true;
    } catch (error) {
      console.error('Error detallado al enviar datos a Google Apps Script:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    console.log('Probando conexión con Google Apps Script...');
    
    const config = this.getConfig();
    if (!config) {
      console.log('No hay configuración para probar');
      return false;
    }

    const spreadsheetId = this.extractSpreadsheetId(config.spreadsheetId);
    if (!spreadsheetId) {
      console.log('ID de spreadsheet inválido');
      return false;
    }

    try {
      // Enviar datos de prueba vacíos para verificar la conexión
      const testPayload = {
        spreadsheetId: spreadsheetId,
        sheetName: config.sheetName,
        values: [] // Array vacío para solo probar la conexión
      };

      console.log('Probando conexión con payload:', testPayload);
      
      const response = await fetch(config.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });
      
      console.log('Respuesta de prueba de conexión:', {
        status: response.status,
        ok: response.ok
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Conexión exitosa con Google Apps Script:', data);
        return data.success !== false; // Consideramos exitoso si no hay error explícito
      }
      
      return false;
    } catch (error) {
      console.error('Error en prueba de conexión:', error);
      return false;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
