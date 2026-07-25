composables/engine/
│
├─ useSchema.ts
├─ useState.ts
├─ useNodes.ts
├─ useGraph.ts
├─ useExpressions.ts
├─ useExecutor.ts
├─ useScheduler.ts
├─ useAction.ts
├─ useEngine.ts
│
├─ actions/
│  ├─ fetch.ts
│  ├─ calc.ts
│  ├─ reset.ts
│  ├─ set.ts
│  └─ validate.ts
│
├─ utils/
│  ├─ extractDeps.ts
│  ├─ resolvePath.ts
│  ├─ topologicalSort.ts
│  └─ evaluate.ts
│
└─ types/
   ├─ field.ts
   ├─ rule.ts
   └─ node.ts

# Form Engine Use Cases

## 1. Data Fetching
- Preload field value from API
- Load select options from API
- Load dependent options (Country → City → Events)
<!-- - Autocomplete / search -->
- Load related entity data
- Refresh data when dependencies change
- Lazy-load data when field becomes visible

---

## 2. Computed Values
- Arithmetic calculations
- Totals and subtotals
- Percentages
- Taxes
- Discounts
- Currency conversion
- Date calculations
- Duration calculations
- Aggregations (sum, avg, min, max)
- Derived fields (Full Name, Display Name, etc.)

---

## 3. Visibility
- Show field
- Hide field
- Show section
- Hide section
- Show step
- Hide step

---

## 4. State Control
- Enable field
- Disable field
- Read-only field
- Set default value
- Reset field
- Reset dependent fields
- Clear field
- Copy value from another field

---

## 5. Validation
- Required
- Conditional required
- Pattern validation
- Range validation
- Cross-field validation
- API validation
- Business rule validation

---

## 6. Value Transformation
- Uppercase
- Lowercase
- Trim
- Format phone
- Format currency
- Format date
- Normalize value
- Unit conversion

---

## 7. Actions
- Fetch data
- Save draft
- Submit form
- Trigger workflow
- Send notification
- Call webhook
- Execute custom action

---

## 8. Collections
- Add row
- Remove row
- Clone row
- Calculate row totals
- Calculate collection totals
- Validate collection size

---

## 9. Access Control
- Role-based visibility
- Role-based editing
- Feature flags
- User-specific behavior

---

## 10. File Handling
- Upload file
- Validate file
- Extract metadata
- OCR processing
- Generate document

---

## 11. Workflow
- Step progression
- Step skipping
- Approval flows
- Status transitions

---

## 12. Integrations
- CRM lookup
- ERP lookup
- Address lookup
- Tax service lookup
- Payment provider lookup
- Shipping provider lookup


- Field A
  - this field is required
  - this field is invalid
  - this field is empty
- Field B
  - this field value must be greater than Field C
  - this field value equal Field C
  - 