import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '@/ui/input';

const meta = {
  title: 'Example/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: [
        'text',
        'email',
        'password',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime-local',
        'file',
      ],
      description: 'The type of input field',
      defaultValue: 'text',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the input',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
      defaultValue: false,
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the input is required',
      defaultValue: false,
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Whether the input is read-only',
      defaultValue: false,
    },
    value: {
      control: { type: 'text' },
      description: 'The value of the input',
    },
    onChange: {
      action: 'changed',
      description: 'Function called when input value changes',
    },
    onFocus: {
      action: 'focused',
      description: 'Function called when input gains focus',
    },
    onBlur: {
      action: 'blurred',
      description: 'Function called when input loses focus',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email...',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password...',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number...',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

export const Date: Story = {
  args: {
    type: 'date',
  },
};

export const File: Story = {
  args: {
    type: 'file',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Pre-filled value',
    placeholder: 'This has a value...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'This input is disabled...',
  },
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    placeholder: 'This input has an error...',
  },
};
