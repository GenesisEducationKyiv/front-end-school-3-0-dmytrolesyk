import { StartedTestContainer } from 'testcontainers';
import { getBackendContainer } from './utils/create-backend-container';
import { writeContainerInfoToFile } from './utils/get-container-info-from-file';

let backendContainer: StartedTestContainer;

async function globalSetup() {
  try {
    backendContainer = await getBackendContainer();

    await backendContainer.exec(['node', 'dist/seed.js']);

    const backendPort = backendContainer.getMappedPort(8000);
    const backendHost = backendContainer.getHost();

    console.log(`Backend service started at ${backendHost}:${String(backendPort)}`);

    await writeContainerInfoToFile({ host: backendHost, port: backendPort });
  } catch (e) {
    console.log('Global setup failed');
    throw e;
  }
}

export default globalSetup;
