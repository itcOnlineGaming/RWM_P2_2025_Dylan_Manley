import type { Meta, StoryObj } from '@storybook/svelte';
import SetTimer from './SetTimer.svelte';

const meta: Meta<typeof SetTimer> = {
  title: 'Yoga Page/Components',
  component: SetTimer,
};

export default meta;

type Story = StoryObj<typeof SetTimer>;

export const SetDuration: Story = {
  args: {
  },
};
