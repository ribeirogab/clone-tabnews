if (process.env.NODE_ENV === 'development') {
  const os = await import('os');
  const networkInterfaces = os.networkInterfaces();

  const interfaces = ['wlp8s0', 'en0', 'en1'];

  for (const iface of interfaces) {
    if (networkInterfaces[iface]) {
      for (const details of networkInterfaces[iface]) {
        if (details.family === 'IPv4' && !details.internal) {
          console.log(`  - Network IP: http://${details.address}:3000`);
        }
      }
    }
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
