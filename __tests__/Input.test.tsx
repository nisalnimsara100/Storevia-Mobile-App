import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Input } from '@/components/ui';
import { theme } from '@/theme';

const flatten = (style: unknown): Record<string, unknown> =>
  Object.assign({}, ...[style].flat(Infinity).filter(Boolean));

describe('Input', () => {
  it('renders its label and placeholder', () => {
    render(<Input label="Email" placeholder="Enter your email" />);

    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
  });

  it('pins a font family and zero letter spacing on the text itself', () => {
    // Regression: with neither set, the placeholder rendered in the OS font
    // with a visible gap between every glyph.
    render(<Input placeholder="Enter your email" />);

    const style = flatten(screen.getByPlaceholderText('Enter your email').props.style);
    expect(style.fontFamily).toBe(theme.font.family.regular);
    expect(style.letterSpacing).toBe(0);
  });

  it('uses a font size from the token scale', () => {
    render(<Input placeholder="Sized" />);

    const style = flatten(screen.getByPlaceholderText('Sized').props.style);
    expect(Object.values(theme.font.size)).toContain(style.fontSize);
  });

  it('masks the value and toggles it with the eye button', () => {
    render(<Input placeholder="Password" secureToggle />);

    const field = screen.getByPlaceholderText('Password');
    expect(field.props.secureTextEntry).toBe(true);

    fireEvent.press(screen.getByLabelText('Show password'));
    expect(screen.getByPlaceholderText('Password').props.secureTextEntry).toBe(
      false,
    );

    fireEvent.press(screen.getByLabelText('Hide password'));
    expect(screen.getByPlaceholderText('Password').props.secureTextEntry).toBe(
      true,
    );
  });

  it('lays the field out as a row so the eye sits inside the box', () => {
    // Regression: the toggle used to render *below* the input.
    render(<Input placeholder="Password" secureToggle />);

    const field = screen.getByTestId('input-field');
    expect(flatten(field.props.style).flexDirection).toBe('row');
    expect(flatten(field.props.style).alignItems).toBe('center');
  });

  it('keeps the toggle inert while the field is disabled', () => {
    render(<Input placeholder="Password" secureToggle editable={false} />);

    fireEvent.press(screen.getByLabelText('Show password'));
    expect(screen.getByPlaceholderText('Password').props.secureTextEntry).toBe(
      true,
    );
  });

  it('renders a label accessory beside the label', () => {
    render(<Input label="Password" labelAccessory={<Text>Forgot?</Text>} />);
    expect(screen.getByText('Forgot?')).toBeTruthy();
  });

  it('shows an error in place of the helper text', () => {
    render(<Input helperText="At least 6 characters" error="Too short" />);

    expect(screen.getByText('Too short')).toBeTruthy();
    expect(screen.queryByText('At least 6 characters')).toBeNull();
  });

  it('reports changes to the caller', () => {
    const onChangeText = jest.fn();
    render(<Input placeholder="Email" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.com');
    expect(onChangeText).toHaveBeenCalledWith('a@b.com');
  });
});
