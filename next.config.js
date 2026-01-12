/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar otimizações de imagem
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
