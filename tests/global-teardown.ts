import { getBackendContainer } from './utils/create-backend-container';
import { deleteContainerInfoFile } from './utils/get-container-info-from-file';

async function globalTeardown() {
  console.log('Starting global teardown...');

  try {
    const backendContainer = await getBackendContainer();
    const containerId = backendContainer.getId();
    const backendPort = backendContainer.getMappedPort(8000);
    const backendHost = backendContainer.getHost();
    await backendContainer.stop();
    await deleteContainerInfoFile();

    console.log(`Backend service at ${backendHost}:${String(backendPort)} was stopped`);
    console.log(`Backend container ${containerId} cleanup completed`);

    console.log('Global teardown completed');
  } catch (error) {
    console.error('Global teardown failed:', error);
  }
}

export default globalTeardown;
