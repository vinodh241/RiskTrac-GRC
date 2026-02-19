import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[matSelectSearch]'
})
export class MatSelectSearchDirective implements OnInit, OnDestroy {
  @Input() searchPlaceholder: string = 'Search...';
  @Input() noResultsText: string = 'No results found';

  private searchInput: HTMLInputElement | null = null;
  private panel: HTMLElement | null = null;
  private destroy$ = new Subject<void>();
  private originalOptions: MatOption[] = [];
  private filteredOptions: MatOption[] = [];
  private searchValue: string = '';

  private static readonly PANEL_SELECTORS = [
    '.mat-mdc-select-panel',
    '.mat-select-panel',
    '.cdk-overlay-pane .mat-mdc-select-panel',
    '.cdk-overlay-pane .mat-select-panel'
  ];

  constructor(
    private matSelect: MatSelect,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.matSelect.openedChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((opened: boolean) => {
        if (opened) {
          setTimeout(() => this.setupSearch(), 100);
          setTimeout(() => {
            if (!this.searchInput) {
              this.setupSearch();
            }
          }, 300);
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeSearchInput();
  }

  private findPanel(): HTMLElement | null {
    const overlays = document.querySelectorAll('.cdk-overlay-pane');
    if (overlays.length > 0) {
      for (let i = overlays.length - 1; i >= 0; i--) {
        for (const selector of ['.mat-mdc-select-panel', '.mat-select-panel']) {
          const panel = overlays[i].querySelector(selector) as HTMLElement;
          if (panel) return panel;
        }
      }
    }
    for (const selector of MatSelectSearchDirective.PANEL_SELECTORS) {
      const panel = document.querySelector(selector) as HTMLElement;
      if (panel) return panel;
    }
    return null;
  }

  private setupSearch(): void {
    this.panel = this.findPanel();
    if (!this.panel) return;

    const existingSearch = this.panel.querySelector('.mat-select-search-container');
    if (existingSearch) {
      this.renderer.removeChild(this.panel, existingSearch);
      this.searchInput = null;
    }

    this.createSearchInput();

    setTimeout(() => {
      try {
        if (!this.matSelect || !this.matSelect.options) return;
        const options = this.matSelect.options.toArray();
        this.originalOptions = options.filter(opt => opt != null && typeof opt._getHostElement === 'function');
        if (this.originalOptions.length > 0) {
          this.filterOptions('');
        }
      } catch (e) {
        this.originalOptions = [];
      }
    }, 100);
  }

  private createSearchInput(): void {
    if (!this.panel) return;

    const searchContainer = this.renderer.createElement('div');
    this.renderer.addClass(searchContainer, 'mat-select-search-container');
    this.renderer.setStyle(searchContainer, 'padding', '8px');
    this.renderer.setStyle(searchContainer, 'border-bottom', '1px solid rgba(0,0,0,0.12)');
    this.renderer.setStyle(searchContainer, 'background', '#fff');
    this.renderer.setStyle(searchContainer, 'position', 'sticky');
    this.renderer.setStyle(searchContainer, 'top', '0');
    this.renderer.setStyle(searchContainer, 'z-index', '1');

    this.searchInput = this.renderer.createElement('input');
    this.renderer.setAttribute(this.searchInput, 'type', 'text');
    this.renderer.setAttribute(this.searchInput, 'placeholder', this.searchPlaceholder);
    this.renderer.addClass(this.searchInput, 'mat-select-search-input');
    this.renderer.setStyle(this.searchInput, 'width', '100%');
    this.renderer.setStyle(this.searchInput, 'padding', '8px');
    this.renderer.setStyle(this.searchInput, 'border', '1px solid rgba(0,0,0,0.12)');
    this.renderer.setStyle(this.searchInput, 'border-radius', '4px');
    this.renderer.setStyle(this.searchInput, 'outline', 'none');
    this.renderer.setStyle(this.searchInput, 'font-size', '14px');
    this.renderer.setStyle(this.searchInput, 'box-sizing', 'border-box');
    this.renderer.setStyle(this.searchInput, 'font-family', 'inherit');

    this.renderer.appendChild(searchContainer, this.searchInput);

    if (this.panel.firstChild) {
      this.renderer.insertBefore(this.panel, searchContainer, this.panel.firstChild);
    } else {
      this.renderer.appendChild(this.panel, searchContainer);
    }

    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.focus();
      }
    }, 150);

    this.renderer.listen(this.searchInput, 'input', (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      this.searchValue = value;
      this.filterOptions(value);
    });

    this.renderer.listen(this.searchInput, 'click', (event: Event) => {
      event.stopPropagation();
    });

    this.renderer.listen(this.searchInput, 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusFirstOption();
      } else if (event.key === 'Escape') {
        this.clearSearch();
        this.matSelect.close();
      }
      event.stopPropagation();
    });
  }

  private filterOptions(searchValue: string): void {
    if (!this.panel) return;

    const searchLower = searchValue.toLowerCase().trim();

    this.filteredOptions = this.originalOptions.filter(option => {
      if (!option) return false;
      try {
        const optionText = option.viewValue?.toString().toLowerCase() || '';
        return optionText.includes(searchLower);
      } catch (e) {
        return false;
      }
    });

    requestAnimationFrame(() => {
      this.originalOptions.forEach(option => {
        if (!option) return;
        try {
          if (typeof option._getHostElement !== 'function') return;
          const optionElement = option._getHostElement();
          if (!optionElement) return;
          if (this.filteredOptions.includes(option)) {
            this.renderer.setStyle(optionElement, 'display', '');
          } else {
            this.renderer.setStyle(optionElement, 'display', 'none');
          }
        } catch (e) {
          // Option element not yet available
        }
      });
    });

    this.showNoResultsMessage(searchLower);
  }

  private showNoResultsMessage(searchValue: string): void {
    if (!this.panel) return;

    const existingMessage = this.panel.querySelector('.mat-select-search-no-results');
    if (existingMessage) {
      this.renderer.removeChild(this.panel, existingMessage);
    }

    if (searchValue && this.filteredOptions.length === 0) {
      const noResultsDiv = this.renderer.createElement('div');
      this.renderer.addClass(noResultsDiv, 'mat-select-search-no-results');
      this.renderer.setStyle(noResultsDiv, 'padding', '16px');
      this.renderer.setStyle(noResultsDiv, 'text-align', 'center');
      this.renderer.setStyle(noResultsDiv, 'color', 'rgba(0,0,0,0.54)');
      this.renderer.setStyle(noResultsDiv, 'font-size', '14px');
      this.renderer.setStyle(noResultsDiv, 'user-select', 'none');
      this.renderer.setStyle(noResultsDiv, 'pointer-events', 'none');
      this.renderer.appendChild(noResultsDiv, this.renderer.createText(this.noResultsText));

      const searchContainer = this.panel.querySelector('.mat-select-search-container');
      if (searchContainer && searchContainer.nextSibling) {
        this.renderer.insertBefore(this.panel, noResultsDiv, searchContainer.nextSibling);
      } else {
        this.renderer.appendChild(this.panel, noResultsDiv);
      }
    }
  }

  private focusFirstOption(): void {
    const firstVisibleOption = this.filteredOptions.find(option => {
      if (!option) return false;
      try {
        if (typeof option._getHostElement !== 'function') return false;
        const element = option._getHostElement();
        return element && element.style.display !== 'none';
      } catch (e) {
        return false;
      }
    });

    if (firstVisibleOption) {
      try {
        if (typeof firstVisibleOption._getHostElement === 'function') {
          const element = firstVisibleOption._getHostElement();
          if (element) element.focus();
        }
      } catch (e) {
        // Option element not available
      }
    }
  }

  private clearSearch(): void {
    if (this.searchInput) {
      this.searchInput.value = '';
      this.searchValue = '';
      if (this.panel && this.originalOptions.length > 0) {
        requestAnimationFrame(() => {
          this.originalOptions.forEach(option => {
            if (!option) return;
            try {
              if (typeof option._getHostElement !== 'function') return;
              const optionElement = option._getHostElement();
              if (optionElement) {
                this.renderer.setStyle(optionElement, 'display', '');
              }
            } catch (e) {
              // Option element not available
            }
          });
        });
      }
    }
    this.searchInput = null;
    this.panel = null;
  }

  private removeSearchInput(): void {
    const searchContainer = this.panel?.querySelector('.mat-select-search-container');
    if (searchContainer && this.panel) {
      this.renderer.removeChild(this.panel, searchContainer);
    }

    const noResults = this.panel?.querySelector('.mat-select-search-no-results');
    if (noResults && this.panel) {
      this.renderer.removeChild(this.panel, noResults);
    }

    this.searchInput = null;
  }
}
