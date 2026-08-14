import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Sub-modules are routable: the active tab lives in the URL as `?tab=`,
 * so every tab has its own address, survives refresh and supports
 * back/forward navigation.
 */
export function initialTab(fallback: string): string {
  return inject(ActivatedRoute).snapshot.queryParamMap.get('tab') ?? fallback;
}

/** Must be called in an injection context; returns the URL-sync setter. */
export function tabNavigator(): (tabId: string) => void {
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  return (tabId) =>
    void router.navigate([], {
      relativeTo: route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge',
    });
}
