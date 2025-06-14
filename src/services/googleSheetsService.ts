
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
  apiKey: string;
  sheetName: string;
}

class GoogleSheetsService {
  private config: GoogleSheetsConfig | null = null;

  setConfig(config: GoogleSheetsConfig) {
    this.config = config;
    localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
  }

  getConfig(): GoogleSheetsConfig | null {
    if (this.config) return this.config;
    
    const stored = localStorage.getItem('googleSheetsConfig');
    if (stored) {
      this.config = JSON.parse(stored);
      return this.config;
    }
    
    return null;
  }

  clearConfig() {
    this.config = null;
    localStorage.removeItem('googleSheetsConfig');
  }

  private extractSpreadsheetId(url: string): string {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : '';
  }

  async appendData(data: SheetData[]): Promise<boolean> {
    const config = this.getConfig();
    if (!config) {
      throw new Error('Google Sheets no está configurado');
    }

    const spreadsheetId = this.extractSpreadsheetId(config.spreadsheetId);
    if (!spreadsheetId) {
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

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${config.sheetName}:append?valueInputOption=RAW&key=${config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: values
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error al enviar datos a Google Sheets:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    const config = this.getConfig();
    if (!config) return false;

    const spreadsheetId = this.extractSpreadsheetId(config.spreadsheetId);
    if (!spreadsheetId) return false;

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${config.apiKey}`
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
