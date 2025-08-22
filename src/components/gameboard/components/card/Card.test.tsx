import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

jest.mock('../card.module.scss', () => ({
  card: 'card',
  flipped: 'flipped',
  shake: 'shake',
  cardInner: 'cardInner',
  cardFront: 'cardFront',
  cardFrontCover: 'cardFrontCover',
  cardBack: 'cardBack',
  cardBackCover: 'cardBackCover',
}));

describe('Card component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders the card with default (not flipped, not wrong) state', () => {
    render(<Card value="icon-class" isFlipped={false} onClick={mockOnClick} />);

    const card = screen.getByRole('button');
    expect(card.className).toContain('card');
    expect(card.className).not.toContain('flipped');
    expect(card.className).not.toContain('shake');

    const icon = screen.queryByRole('img');
    expect(icon).not.toBeInTheDocument();
  });

  it('renders with flipped class when isFlipped is true', () => {
    render(<Card value="icon-class" isFlipped={true} onClick={mockOnClick} />);
    const card = screen.getByRole('button');
    expect(card.className).toContain('flipped');
  });

  it('renders with shake class when isWrong is true', () => {
    render(<Card value="icon-class" isFlipped={true} isWrong={true} onClick={mockOnClick} />);
    const card = screen.getByRole('button');
    expect(card.className).toContain('shake');
  });

  it('calls onClick when card is clicked', () => {
    render(<Card value="icon-class" isFlipped={false} onClick={mockOnClick} />);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays the correct icon class when flipped', () => {
    render(<Card value="fa-star" isFlipped={true} onClick={mockOnClick} />);
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon.className).toBe('fa-star');
  });
});