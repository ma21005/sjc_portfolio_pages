import "../style/SkillItem.css";

const SkillItem = ({ skill }) => {
  const skillExperience = skill.experience
  const imagePath = `/img/skill_icons/${skill.name}.png`;

  return (
    <div className="skill_container nes-container is-rounded is-dark">
      <div className="skill_icon_and_name_container">
        <div className="skill_icon_container nes-container is-rounded is-dark">
          <img className="skill_icon" src={imagePath} alt={skill.name} />
        </div>
        <div className="skill_name_container">
          <p className="skill_name">{skill.name}</p>
        </div>
      </div>
      <div className="skill_star_and_level_container">
        <div className="skill_star_container">
          {Array.from({ length: skillExperience }).map((_, index) => (
            <img key={index} className="skill_star" src="/img/skill_star.jpg" alt="Skill Star" />
          ))}
        </div>
        <div className="skill_level_container">
          <span>{skillExperience}</span>
        </div>
      </div>
    </div>
  );
};

export default SkillItem;
