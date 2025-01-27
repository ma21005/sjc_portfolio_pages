import SkillItem from './SkillItem';

const Skill = (props) => {
  const {skills} = props;

  return (
    <div>
      {skills.map(skill => (
        <SkillItem key={skill.id} skill={skill} />
      ))}
    </div>
  );
};

export default Skill;
