import type { Meta, StoryObj } from '@storybook/svelte';
import NextPageButton from './NextPageButton.svelte';

const meta: Meta<typeof NextPageButton> = {
    title: 'Yoga Page/Components',
    component: NextPageButton,
};

    export default meta;

    type Story = StoryObj<typeof NextPageButton>;

export const NavigationButton: Story = {
    args: {
        label: 'Start',
        to: '/YogaScreen/results',
        navigate: (path: string) => {
            alert(`Navigated to: ${path}`);
        },
    },
};
