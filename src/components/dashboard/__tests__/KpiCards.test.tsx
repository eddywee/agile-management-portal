// © Edmund Wallner
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { mockRoleDist, mockSolutions, mockArts, mockConflicts } from '@/test/helpers';

describe('KpiCards', () => {
  it('renders total FTE from role distribution', () => {
    render(
      <KpiCards
        dist={mockRoleDist}
        solutions={mockSolutions}
        arts={mockArts}
        conflicts={[]}
        onScrollToConflicts={vi.fn()}
      />,
    );
    expect(screen.getByText('17.0')).toBeInTheDocument();
    expect(screen.getByText('Total FTE')).toBeInTheDocument();
  });

  it('renders solution and ART counts', () => {
    render(
      <KpiCards
        dist={mockRoleDist}
        solutions={mockSolutions}
        arts={mockArts}
        conflicts={[]}
        onScrollToConflicts={vi.fn()}
      />,
    );
    expect(screen.getByText('2')).toBeInTheDocument(); // solutions
    expect(screen.getByText('3')).toBeInTheDocument(); // ARTs
  });

  it('shows "all within bounds" when no conflicts', () => {
    render(
      <KpiCards
        dist={mockRoleDist}
        solutions={mockSolutions}
        arts={mockArts}
        conflicts={[]}
        onScrollToConflicts={vi.fn()}
      />,
    );
    expect(screen.getByText(/all within bounds/)).toBeInTheDocument();
  });

  it('shows conflict count and calls onScrollToConflicts on click', async () => {
    const onScroll = vi.fn();
    render(
      <KpiCards
        dist={mockRoleDist}
        solutions={mockSolutions}
        arts={mockArts}
        conflicts={mockConflicts}
        onScrollToConflicts={onScroll}
      />,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/over-allocated people/)).toBeInTheDocument();

    const conflictCard = screen.getByText('Conflicts').closest('.kpi-card')!;
    await userEvent.click(conflictCard);
    expect(onScroll).toHaveBeenCalledOnce();
  });
});
