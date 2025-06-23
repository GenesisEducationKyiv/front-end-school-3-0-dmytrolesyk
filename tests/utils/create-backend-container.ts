import { GenericContainer, StartedTestContainer } from 'testcontainers';

export const getBackendContainer = async (): Promise<StartedTestContainer> => {
  const backendContainer = await new GenericContainer('music-manager-backend')
    .withExposedPorts(8000)
    .withReuse()
    .start();

  const containerId = backendContainer.getId();

  console.log(`Backend container ${containerId} started}`);

  return backendContainer;
};
