import type { Meta, StoryObj } from '@storybook/svelte';
import SelectExercisesArea from './SelectExercisesArea.svelte';

const meta: Meta<typeof SelectExercisesArea> = {
  title: 'Yoga Page/Components',
  component: SelectExercisesArea,
};

export default meta;

type Story = StoryObj<typeof SelectExercisesArea>;

export const ExerciseButtons: Story = {
  args: {
  },
};
