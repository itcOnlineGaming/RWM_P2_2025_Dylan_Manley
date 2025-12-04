import type { Meta, StoryObj } from '@storybook/svelte';
import CycleExercises from './CycleExercises.svelte';

const meta: Meta<typeof CycleExercises> = {
    title: 'Yoga Page/Components',
    component: CycleExercises,
};

    export default meta;

    type Story = StoryObj<typeof CycleExercises>;

export const CycleSelectedExercises: Story = {
};
