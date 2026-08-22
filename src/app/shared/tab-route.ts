import { inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteTarget } from '../core/models/common.models';

/**
 * Sub-modules are routable: the active tab lives in the URL as `?tab=`.
 * The signal stays in sync when dashboard cards, search, or back/forward
 * change the query — not only on the first render.
 */
export function routedTab(fallback: string): WritableSignal<string> {
  const route = inject(ActivatedRoute);
  const active = signal(route.snapshot.queryParamMap.get('tab') ?? fallback);
  route.queryParamMap.subscribe((params) => {
    active.set(params.get('tab') ?? fallback);
  });
  return active;
}

/** KPI cards and alerts share this so a click always lands on the same URL. */
export function navigateToTarget(router: Router, target: RouteTarget): void {
  if (!target.route) return;
  void router.navigate([target.route], {
    queryParams: target.query ?? {},
    fragment: target.fragment,
  });
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
