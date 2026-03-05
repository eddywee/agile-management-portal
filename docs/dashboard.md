# Dashboard

The Dashboard provides a high-level overview of your SAFe organization's FTE allocation for the currently selected Program Increment.

!!! info "How FTE is calculated"
    FTE (Full-Time Equivalent) values represent the fraction of a
    person's capacity allocated to a specific team within the active PI.
    A value of `1.0` means full-time, `0.5` means half-time.

## KPI Cards

Four summary cards appear at the top of the dashboard:

| Card | Description |
|------|-------------|
| **Total FTE** | Sum of all FTE allocations across all assignments (team memberships + leadership roles) for the active PI. |
| **Solutions** | Number of Solutions configured in the system. |
| **ARTs** | Number of Agile Release Trains currently defined. |
| **Conflicts** | Number of people whose total FTE allocation exceeds 100% in the active PI. Click this card to scroll to the conflict table. |

When there are no conflicts, the Conflicts card shows a green checkmark with "all within bounds." When conflicts exist, a warning indicator appears with the count of over-allocated people.

## Solution FTE Bar Chart

A stacked bar chart showing FTE distribution across Solutions. Each bar is broken down into:

- **Delivery** — FTE allocated to team memberships
- **ART Overhead** — FTE allocated to ART leadership roles
- **Solution Overhead** — FTE allocated to Solution leadership roles

This visualization helps identify which Solutions consume the most capacity and how FTE is split between delivery work and leadership overhead.

## Role Distribution Donut Chart

A donut chart showing the overall split between:

- **Delivery** — People in team membership roles
- **ART Leadership** — People in ART leadership positions
- **Solution Leadership** — People in Solution leadership positions

Use this to check whether your organization's overhead ratio is within acceptable bounds.

## Conflict Table

!!! warning "Over-Allocation Conflicts"
    When a person's total FTE across all teams exceeds `1.0`, the
    dashboard flags this as a conflict. Resolve these before finalizing
    your PI plan.

The bottom section lists all people whose total FTE allocation in the active PI exceeds 100%. For each conflicting person, the table shows:

- **Name** and **email**
- **Department**
- **Total FTE** — Their combined allocation percentage
- **Assignments** — Number of separate roles/memberships they hold

Click the **Conflicts** KPI card to scroll directly to this table. If there are no conflicts, the table displays a success message.

Resolving conflicts typically involves adjusting FTE percentages on the [Organization](organization.md) page or removing duplicate memberships.
