# UI Text Centralization + i18n Implementation Guide

> **Reusable prompt template for implementing i18n on other modules in the GRC RiskTrac Application**

---

## 📌 Context

You are working on an enterprise-grade GRC application called **RiskTrac**.
This change applies ONLY to the **[MODULE_NAME]** module UI.

> ⚠️ **Replace `[MODULE_NAME]` with the actual module name** (e.g., Risk-Assessment, Audit-Management, Compliance, etc.)

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend (Web) | Angular |
| UI Framework | Angular Material |
| i18n Library | @ngx-translate/core, @ngx-translate/http-loader |
| Backend & DB | **OUT OF SCOPE** (Do NOT touch) |

## 📂 Repository Structure (relative to VS Code root)

- `web/` → Angular application

## 🎯 Objectives

### Primary Objective
Rename **"Group" → "Department"** in ALL visible UI text within the [MODULE_NAME] module.

### Architectural Improvement (MANDATORY)

Currently, UI text is hardcoded across HTML and TS files.
You must refactor UI text handling so that:

- ✅ NO UI labels, headers, or messages remain hardcoded
- ✅ All UI text is read from a centralized configuration
- ✅ The solution supports future internationalization (i18n)
- ✅ Additional languages can be added easily

---

## 🔁 Text Management Strategy (REQUIRED)

### 1️⃣ Centralized UI Text Configuration

**Location:** `web/src/assets/i18n/en.json`

All UI-visible strings must be added/updated here, including:
- Labels
- Headers
- Table column names
- Button text
- Dialog titles
- Tooltips
- Validation messages
- Empty-state messages

### 2️⃣ ngx-translate Setup

If not already installed, add dependencies:

```bash
npm install @ngx-translate/core@^14.0.0 @ngx-translate/http-loader@^7.0.0 --save
```

**AppModule Configuration:**

```typescript
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: environment.defaultLanguage, // Use environment config
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class AppModule { }
```

**Feature Module Configuration:**

```typescript
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    TranslateModule  // For child/feature modules
  ]
})
export class FeatureModule { }
```

### 3️⃣ Environment Configuration

**`web/src/environments/environment.ts`** (development):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9002',
  hostUrl: 'http://localhost:5000',
  defaultLanguage: 'en'  // Default language setting
};
```

**`web/src/environments/environment.prod.ts`** (production):

```typescript
export const environment = {
  production: true,
  apiUrl: 'umapi',
  hostUrl: 'http://risktrac.secureyes.net:5000',
  defaultLanguage: 'en'  // Can be different per environment
};
```

---

## 📖 Usage Patterns

### In HTML Templates (using translate pipe)

```html
<!-- Simple translation -->
<mat-label>{{ 'module.fieldLabel' | translate }}</mat-label>

<!-- Button text -->
<button>{{ 'common.save' | translate }}</button>

<!-- Placeholder attribute -->
<input [placeholder]="'module.placeholder' | translate">

<!-- Tooltip -->
<button [matTooltip]="'module.tooltip' | translate">

<!-- Title attribute -->
<button [title]="'common.delete' | translate">

<!-- Aria label -->
<mat-icon [attr.aria-label]="'common.close' | translate">
```

### In TypeScript Files (using TranslateService)

```typescript
import { TranslateService } from '@ngx-translate/core';

@Component({...})
export class MyComponent {
  constructor(private translate: TranslateService) {}

  showMessage() {
    // Synchronous (instant) - use when translations are already loaded
    const message = this.translate.instant('module.errorMessage');
    
    // With interpolation parameters
    const rangeMsg = this.translate.instant('module.rangeError', { min: 5, max: 10 });
    
    // Asynchronous (observable) - safer, waits for translations
    this.translate.get('module.successMessage').subscribe(msg => {
      console.log(msg);
    });
  }
}
```

### Translation JSON Structure

```json
{
  "common": {
    "yes": "Yes",
    "no": "No",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "close": "Close",
    "action": "Action",
    "success": "Success",
    "error": "Error",
    "standard": "Standard",
    "power": "Power"
  },
  "moduleName": {
    "pageTitle": "Page Title",
    "columns": {
      "department": "Department",
      "unit": "Unit",
      "action": "Action"
    },
    "fields": {
      "firstName": "First Name",
      "lastName": "Last Name"
    },
    "placeholders": {
      "selectDepartment": "Select Department",
      "enterName": "Enter Name"
    },
    "validation": {
      "required": "This field is required.",
      "rangeError": "Value must be between {{min}} and {{max}}",
      "invalidEmail": "Please enter a valid email address."
    },
    "dialogs": {
      "confirmDelete": {
        "title": "Confirm Deletion",
        "content": "Are you sure you want to delete this item?"
      },
      "saveSuccess": {
        "title": "Success",
        "content": "Record saved successfully."
      }
    },
    "buttons": {
      "assignUnit": "+ Assign Unit",
      "saveDetails": "Save Details"
    },
    "tooltips": {
      "editRecord": "Edit record details",
      "deleteRecord": "Delete this record"
    }
  }
}
```

---

## 🔍 Scope of UI Analysis

Analyze ALL screens in the [MODULE_NAME] module and update UI text.

### Include (but not limited to):

#### Angular HTML Templates
- Page titles
- Section headers
- Labels
- Placeholders
- Error messages
- Confirmation dialogs
- Notes and hints

#### Angular Material Components
- `mat-table` column headers
- `mat-form-field` labels
- `mat-select`, `mat-option`
- `mat-dialog` titles/content
- `mat-tooltip`
- `mat-tab` labels
- `mat-menu` items
- `mat-card` titles
- `mat-checkbox` labels
- `mat-slide-toggle` labels

#### TypeScript Files (.ts)
- Column configuration objects
- Form field metadata
- Constants/enums used for UI text
- Dialog configuration text
- Validation messages
- Success/error messages
- Any user-facing string

---

## 🔤 Rename Rules

Apply renaming **only at the UI text level**:

| Original | Replacement |
|----------|-------------|
| Group | Department |
| Group Name | Department Name |
| Assign Group | Assign Department |
| Select Group | Select Department |
| User Group Mapping | User Department Mapping |
| group | department |

### ⚠️ Do NOT rename:
- API request/response fields
- Model property names
- Backend enums
- Database columns
- Variable names in TypeScript code
- CSS class names
- HTML element IDs (unless they contain visible text)

---

## 🚫 Explicitly Out of Scope

- ❌ Backend (Node.js / Express)
- ❌ API contracts
- ❌ Database schema or scripts
- ❌ Business logic
- ❌ Data migration
- ❌ Unit tests (unless they test UI text)

---

## 🧪 Mandatory Verification Checklist

After implementation:

- [ ] Search entire `web/` directory for hardcoded UI text
- [ ] Confirm no visible UI string contains "Group" (should be "Department")
- [ ] Verify all UI text is loaded from centralized config (`en.json`)
- [ ] Ensure application builds successfully (`npm run build`)
- [ ] Ensure UI renders correctly with no broken bindings
- [ ] Confirm future language files can be added without code changes
- [ ] Test all dialogs, tooltips, and error messages display correctly

---

## 📦 Final Deliverables

1. ✅ Updated/extended `web/src/assets/i18n/en.json` with all module text
2. ✅ Refactored [MODULE_NAME] UI using config-based text (translate pipe/service)
3. ✅ "Group" fully replaced by "Department" in visible UI
4. ✅ Clean, maintainable, scalable solution ready for i18n
5. ✅ TranslateModule imported in all necessary modules

---

## 📝 Adding New Languages (Future)

To add a new language (e.g., French):

### Step 1: Create Translation File

Create `web/src/assets/i18n/fr.json`:

```json
{
  "common": {
    "yes": "Oui",
    "no": "Non",
    "save": "Enregistrer",
    "cancel": "Annuler"
  }
}
```

### Step 2: Update Environment (Optional)

```typescript
// environment.ts or environment.prod.ts
export const environment = {
  defaultLanguage: 'fr'  // Change default language
};
```

### Step 3: Switch Language at Runtime

```typescript
import { TranslateService } from '@ngx-translate/core';

// Switch to French
this.translate.use('fr');

// Or use environment variable
this.translate.use(environment.defaultLanguage);
```

### Supported Language Codes

| Language | Code |
|----------|------|
| English | `en` |
| French | `fr` |
| German | `de` |
| Spanish | `es` |
| Arabic | `ar` |
| Hindi | `hi` |

---

## 📋 Quick Reference

### File Locations

| Purpose | Location |
|---------|----------|
| English translations | `web/src/assets/i18n/en.json` |
| Other languages | `web/src/assets/i18n/{lang}.json` |
| App module config | `web/src/app/app.module.ts` |
| Environment config | `web/src/environments/environment.ts` |

### Import Statements

```typescript
// For AppModule (root)
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// For Feature Modules
import { TranslateModule } from '@ngx-translate/core';

// For Components (when using instant/get)
import { TranslateService } from '@ngx-translate/core';
```

---

## 🔗 Reference Implementation

See the **User-Management** module for a complete working example:
- `web/src/app/pages/user-list/` - Components with i18n
- `web/src/assets/i18n/en.json` - Translation file structure
- `web/src/app/app.module.ts` - Module configuration

---

*Last Updated: February 2026*
*RiskTrac GRC Application - i18n Implementation Guide*
