if (process.env.NODE_ENV === 'development') {
  const os = await import('os');
  const networkInterfaces = os.networkInterfaces();

  if (networkInterfaces?.wlp8s0 && networkInterfaces.wlp8s0[0]?.address) {
    const ip = networkInterfaces.wlp8s0[0].address;
    const url = `http://${ip}:3000`;

    console.log('  - Local URL: ', url);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
