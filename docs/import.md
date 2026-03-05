# CSV Import

The Import wizard lets you bulk-load people and allocation data from CSV files. It is accessible from the **Import** page in the sidebar or from **Settings > Data Management**.

## Import Wizard

The wizard guides you through four steps:

### Step 1: Upload

Click the upload area to browse for a file. The wizard supports `.csv` and `.tsv` files.

Once a file is selected, the app parses it and displays the file name and row count. If the file is valid, click **Next: Map Columns** to proceed.

??? example "Supported CSV formats"
    The import wizard accepts UTF-8 encoded CSV files with comma,
    semicolon, or tab delimiters. Files up to 10MB are supported.
    Excel exports (`.xlsx`) must first be saved as CSV.

### Step 2: Mapping

In this step, you map each column from your CSV file to an application field. The available target fields are:

| Field | Description |
|-------|-------------|
| **Full Name** | Person's name (required) |
| **Email** | Email address |
| **Department** | Organizational department |
| **Cost Center** | Cost center code |
| **Hub** | Location or hub code |
| **Company** | Company name |
| **Team** | Product team name — if the team doesn't exist, it will be created automatically |
| **Role** | Role within the team (e.g., Developer, Tester) |
| **FTE %** | FTE allocation percentage for the team |

Use the dropdown menus to assign each CSV column to the corresponding field. Columns you don't need can be left unmapped.

Click **Next: Preview** when your mappings are complete.

### Step 3: Preview

Review the parsed data before importing. The preview table shows how each row will be interpreted based on your column mappings.

Check for any obvious issues such as:

- Missing required fields (Full Name)
- Incorrect column mappings
- Unexpected data in mapped columns

If something looks wrong, go back to the Mapping step and adjust. When satisfied, click **Import** to begin processing.

### Step 4: Result

After the import completes, a summary shows:

| Metric | Description |
|--------|-------------|
| **Created** | Number of new people added to the database |
| **Updated** | Number of existing people matched and updated |
| **Teams Created** | Number of new teams auto-created from the Team column |
| **Total** | Total rows processed |

People are matched by **full name** — if a person with the same name already exists, their record is updated rather than duplicated.

## Tips

!!! warning "Active PI matters"
    The import assigns all memberships to the **currently active PI**.
    Make sure you've selected the correct PI in the sidebar before
    importing.

!!! tip "Use an export as a template"
    Export a PI first (from **Settings > Data Management**) to see
    the expected CSV format, then use that as a template for your
    import file.

- Teams referenced in the CSV that don't already exist will be auto-created as standalone teams (not assigned to any ART). You can reassign them to ARTs afterward on the [Organization](organization.md) page.
