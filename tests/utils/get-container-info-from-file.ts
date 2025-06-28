import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

type ContainerInfo = {
  host: string;
  port: number;
};

const containerInfoPath = path.resolve(import.meta.dirname, './.container-info.json');

const isValidContainerInfo = (value: unknown): value is ContainerInfo => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'host' in value &&
    typeof value.host === 'string' &&
    'port' in value &&
    typeof value.port === 'number'
  );
};

export const getContainerInfoFromFile = async (): Promise<ContainerInfo> => {
  const fileContents = await fs.readFile(containerInfoPath, 'utf-8');
  const parsedFileContents: unknown = JSON.parse(fileContents);
  if (isValidContainerInfo(parsedFileContents)) {
    return parsedFileContents;
  } else {
    throw new Error('.container-info.json contains invalid data');
  }
};

export const writeContainerInfoToFile = async ({ host, port }: ContainerInfo) => {
  await fs.writeFile(
    containerInfoPath,
    JSON.stringify({ host, port, timestamp: Date.now() }, null, 2),
  );
};

export const deleteContainerInfoFile = async () => {
  if (existsSync(containerInfoPath)) {
    await fs.unlink(containerInfoPath);
  }
};
