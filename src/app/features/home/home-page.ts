import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModuleDashboard } from '../../shared/components/module-dashboard';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { HomeOpsPanel } from './home-ops-panel';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleDashboard, UiPageHeader, HomeOpsPanel],
  template: `
    <ui-page-header titleKey="home.title" subtitleKey="home.subtitle" />
    <module-dashboard moduleId="home">
      <app-home-ops-panel />
    </module-dashboard>
  `,
})
export class HomePage {}
