import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '../App';

describe('Button', () => {
  it('renders its children as the label', () => {
    render(<Button onClick={() => {}}>Find closest booking</Button>);

    expect(screen.getByRole('button', { name: /find closest booking/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Accept</Button>);

    await userEvent.click(screen.getByRole('button', { name: /accept/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  describe('loading', () => {
    it('shows "loading..." instead of the children when loading is true', () => {
      render(
        <Button onClick={() => {}} loading>
          Find closest booking
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveTextContent('loading...');
      expect(screen.queryByText(/find closest booking/i)).not.toBeInTheDocument();
    });

    it('disables the button when loading is true', () => {
      render(
        <Button onClick={() => {}} loading>
          Find closest booking
        </Button>,
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onClick when loading is true', async () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} loading>
          Find closest booking
        </Button>,
      );

      await userEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('danger', () => {
    it('applies the danger modifier class when danger is true', () => {
      render(
        <Button onClick={() => {}} danger>
          Cancel
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveClass('primary-button', 'primary-button--danger');
    });

    it('does not apply the danger class by default', () => {
      render(<Button onClick={() => {}}>Accept</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('primary-button');
      expect(button).not.toHaveClass('primary-button--danger');
    });
  });
});
