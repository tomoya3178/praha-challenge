import { Board } from '../components/Board';

export default {
  component: Board,
  title: Board.name,
};

const Template = (args) => <Board {...args} />;

export const initial = Template.bind({});
initial.args = {
  squares: Array(9).fill(null)
};

export const triangles = Template.bind({});
triangles.args = {
  squares: Array(9).fill("△")
};
