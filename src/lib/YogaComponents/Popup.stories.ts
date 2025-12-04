import type { Meta, StoryObj } from '@storybook/svelte';
import Popup from './Popup.svelte';

const meta: Meta<typeof Popup> = {
    title: 'Yoga Page/Components',
    component: Popup,
};

export default meta;

type Story = StoryObj<typeof Popup>;

export const PopupBubble: Story = {
    render: (args) => ({
        Component: Popup,
        props: { ...args, show: true },
        on: {
            ratingSelected: (e: CustomEvent) => console.log('rated:', e.detail.rating),
            close: () => console.log('closed')
        }
  }),
  args: {
    question: 'How do you feel currently?'
  }
};
