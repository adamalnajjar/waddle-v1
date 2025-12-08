import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import type { PageProps as AppPageProps } from './index.ts';

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}

declare module '*.svg' {
    const content: string;
    export default content;
}
