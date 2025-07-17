import * as YAML from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

const swaggerYamlPath = path.join(process.cwd(), 'swagger.yaml');
const swaggerYamlContent = fs.readFileSync(swaggerYamlPath, 'utf8');
const swaggerDefinition = YAML.parse(swaggerYamlContent);

export const swaggerSpec = swaggerDefinition;
export const swaggerYaml = swaggerYamlContent;
