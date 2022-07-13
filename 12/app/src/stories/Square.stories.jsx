import { Square } from '../components/Square';

export default {
  component: Square,
  title: Square.name,
};

const Template = (args) => <Square {...args} />;

export const initial = Template.bind({});
initial.args = {
  value: null
};

export const circle = Template.bind({});
circle.args = {
  value: "O"
};

export const cross = Template.bind({});
cross.args = {
  value: "X"
};
