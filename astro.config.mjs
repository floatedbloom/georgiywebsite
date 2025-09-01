import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'node:path';

// https://astro.build/config
export default defineConfig({
    integrations: [react(), tailwind({ applyBaseStyles: false })],
    vite: {
        resolve: {
            alias: {
                'webcore.config.scss': path.resolve(process.cwd(), 'webcore.config.scss')
            }
        },
        ssr: {
            noExternal: ['webcoreui']
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use 'webcore.config.scss' as *;\n",
                    includePaths: [path.resolve(process.cwd()), path.resolve(process.cwd(), 'node_modules')]
                }
            }
        }
    }
});
