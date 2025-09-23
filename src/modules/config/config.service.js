import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to configs directory
const CONFIGS_DIR = path.join(__dirname, '../../../configs');

// Ensure configs directory exists
const ensureConfigsDir = async () => {
  try {
    await fs.access(CONFIGS_DIR);
  } catch {
    await fs.mkdir(CONFIGS_DIR, { recursive: true });
  }
};

export const getConfigService = async (configName) => {
  try {
    await ensureConfigsDir();
    
    const configPath = path.join(CONFIGS_DIR, `${configName}.json`);
    
    try {
      const configData = await fs.readFile(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Config '${configName}' not found`);
      }
      throw error;
    }
  } catch (error) {
    throw new Error(`Failed to get config: ${error.message}`);
  }
};

export const updateConfigService = async (configName, configData) => {
  try {
    await ensureConfigsDir();
    
    const configPath = path.join(CONFIGS_DIR, `${configName}.json`);
    
    // Validate config structure
    if (!configData.name || !configData.charts) {
      throw new Error('Invalid config structure. Must include name and charts fields');
    }
    
    // Ensure dataSource field exists for each chart
    if (configData.charts) {
      configData.charts.forEach((chart, index) => {
        if (!chart.dataSource) {
          chart.dataSource = {
            type: 'flux',
            query: '',
            parameters: {}
          };
        }
      });
    }
    
    await fs.writeFile(configPath, JSON.stringify(configData, null, 2));
    return configData;
  } catch (error) {
    throw new Error(`Failed to update config: ${error.message}`);
  }
};

export const listConfigsService = async () => {
  try {
    await ensureConfigsDir();
    
    const files = await fs.readdir(CONFIGS_DIR);
    const configFiles = files.filter(file => file.endsWith('.json'));
    
    const configs = await Promise.all(
      configFiles.map(async (file) => {
        const configName = path.basename(file, '.json');
        try {
          const config = await getConfigService(configName);
          return {
            name: configName,
            displayName: config.name || configName,
            description: config.description || '',
            charts: config.charts?.length || 0,
            lastModified: (await fs.stat(path.join(CONFIGS_DIR, file))).mtime
          };
        } catch (error) {
          return {
            name: configName,
            displayName: configName,
            description: 'Error loading config',
            charts: 0,
            lastModified: new Date()
          };
        }
      })
    );
    
    return configs;
  } catch (error) {
    throw new Error(`Failed to list configs: ${error.message}`);
  }
};
