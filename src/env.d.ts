/// <reference types="astro/client" />

declare global {
	interface Window {
		CMS_MANUAL_INIT?: boolean;
		CMS?: {
			init?: (options?: { config?: string } | Record<string, unknown>) => void;
		};
	}
}

export {};
