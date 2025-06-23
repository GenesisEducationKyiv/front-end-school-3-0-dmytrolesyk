// debug-docker.js - Run this to check Docker accessibility
import { execSync } from 'child_process';

console.log('=== Docker Debug Information ===');

try {
  console.log('1. Docker version:');
  console.log(execSync('docker --version', { encoding: 'utf8' }));

  console.log('2. Docker info:');
  console.log(execSync('docker info --format "{{json .}}"', { encoding: 'utf8' }));

  console.log('3. Available images:');
  console.log(
    execSync('docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.ID}}"', {
      encoding: 'utf8',
    }),
  );

  console.log('4. Docker daemon accessible: ✅');

  // Test simple container run
  console.log('5. Testing simple container run:');
  execSync('docker run --rm hello-world', { encoding: 'utf8' });
  console.log('Simple container run: ✅');
} catch (error) {
  console.error('Docker accessibility issue:', error.message);
  console.error('Error code:', error.status);
}

// Test Testcontainers specifically
console.log('\n=== Testing Testcontainers ===');

try {
  const { getContainerRuntimeClient } = await import('testcontainers');

  console.log('6. Getting Testcontainers runtime client...');
  const client = await getContainerRuntimeClient();
  console.log('Testcontainers client: ✅');

  console.log('7. Getting Docker info via Testcontainers...');
  const info = await client.info();
  console.log('Docker info via Testcontainers:', JSON.stringify(info, null, 2));
} catch (error) {
  console.error('Testcontainers issue:', error.message);
  console.error('Full error:', error);
}
