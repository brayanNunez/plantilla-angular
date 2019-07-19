// import { Component, OnDestroy } from '@angular/core';
// // import { navItems } from '@app/_nav';
// // import { navItems } from '@app/_nav';
//  import { navItems } from '../../../../_nav';
// // import { faLock } from '@fortawesome/free-solid-svg-icons';

// @Component({
//   selector: 'app-default-layout',
//   templateUrl: './default-layout.component.html',
//   styleUrls: ['./default-layout.component.scss']
// })
// export class DefaultLayoutComponent implements OnDestroy {
//   // public faLock = faLock;
//   public navItems = navItems;
//   public sidebarMinimized = true;
//   private changes: MutationObserver;
//   public element: HTMLElement = document.body;
//   constructor() {
//     this.changes = new MutationObserver(mutations => {
//       this.sidebarMinimized = document.body.classList.contains(
//         'sidebar-minimized'
//       );
//     });

//     this.changes.observe(<Element>this.element, {
//       attributes: true,
//       attributeFilter: ['class']
//     });
//   }

//   ngOnDestroy(): void {
//     this.changes.disconnect();
//   }
// }




import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
// import { navItems } from '../../_nav';
import { navItems } from '../../../../_nav';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(@Inject(DOCUMENT) _document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
