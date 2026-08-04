import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shri Bhashyam Rama Krishna, MP',
    short_name: 'Bhashyam RK MP',
    description: 'Official Portal of Shri Bhashyam Rama Krishna, Member of Parliament (Rajya Sabha)',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#F59E0B',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
